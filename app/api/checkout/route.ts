import { NextResponse } from "next/server";
import { createAdminClient, temServiceRole } from "@/lib/supabase/admin";
import { criarLinkDeCheckout, handleDaLoja } from "@/lib/infinitepay";
import {
  ehEmail,
  gerarOrderNsu,
  lerEndereco,
  montarPedido,
  type ItemPedido,
} from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function baseDoSite() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://resenha-fc-mantos.vercel.app"
  ).replace(/\/$/, "");
}

/**
 * Cria o pedido e devolve o link de pagamento da InfinitePay.
 *
 * O corpo aceito traz SÓ o que comprar — nenhum preço. Qualquer valor que
 * venha do navegador é ignorado: o total é remontado do banco.
 */
export async function POST(req: Request) {
  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "Pedido mal formado." }, { status: 400 });
  }

  const c = corpo as {
    itens?: ItemPedido[];
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: unknown;
    cupom?: string;
  };

  const nome = String(c.nome ?? "").trim();
  const email = String(c.email ?? "").trim().toLowerCase();
  const telefone = String(c.telefone ?? "").trim();

  if (nome.length < 3) {
    return NextResponse.json({ erro: "Escreva seu nome completo." }, { status: 400 });
  }
  if (!ehEmail(email)) {
    return NextResponse.json({ erro: "Confira o seu e-mail." }, { status: 400 });
  }
  if (!Array.isArray(c.itens) || c.itens.length === 0) {
    return NextResponse.json({ erro: "Carrinho vazio." }, { status: 400 });
  }

  const endereco = lerEndereco(c.endereco);
  if ("erro" in endereco) {
    return NextResponse.json({ erro: endereco.erro }, { status: 400 });
  }

  // Só depois de o pedido fazer sentido é que a configuração importa.
  if (!temServiceRole() || !handleDaLoja()) {
    return NextResponse.json(
      { erro: "Pagamento ainda não configurado no servidor." },
      { status: 503 },
    );
  }

  const montado = await montarPedido(c.itens ?? [], c.cupom);
  if ("erro" in montado) {
    return NextResponse.json({ erro: montado.erro }, { status: 400 });
  }

  const supabase = createAdminClient();
  const orderNsu = gerarOrderNsu();

  const { data: pedido, error: erroPedido } = await supabase
    .from("orders")
    .insert({
      order_nsu: orderNsu,
      customer_name: nome,
      customer_email: email,
      customer_phone: telefone || null,
      address: endereco,
      items_amount: montado.itemsAmount,
      shipping_amount: montado.shippingAmount,
      discount_amount: montado.discountAmount,
      coupon_code: montado.cupom,
      amount: montado.amount,
      status: "pendente",
    })
    .select("id")
    .single();

  if (erroPedido || !pedido) {
    console.error("[checkout] falha ao gravar o pedido:", erroPedido?.message);
    return NextResponse.json(
      { erro: "Não consegui abrir o seu pedido. Tente de novo." },
      { status: 500 },
    );
  }

  const { error: erroItens } = await supabase.from("order_items").insert(
    montado.itens.map((i) => ({ ...i, order_id: pedido.id })),
  );

  if (erroItens) {
    console.error("[checkout] falha ao gravar os itens:", erroItens.message);
    await supabase.from("orders").delete().eq("id", pedido.id);
    return NextResponse.json(
      { erro: "Não consegui abrir o seu pedido. Tente de novo." },
      { status: 500 },
    );
  }

  const base = baseDoSite();
  // O link vale 3 dias. Só é enviado quando existe API Key: a
  // documentação exige a chave para o objeto `options`.
  const validoAte = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const link = await criarLinkDeCheckout({
    items: montado.itens.map((i) => ({
      description: i.size ? `${i.product_name} — tam. ${i.size}` : i.product_name,
      price: i.unit_amount,
      quantity: i.quantity,
    })),
    orderNsu,
    redirectUrl: `${base}/pedido/${pedido.id}`,
    webhookUrl: `${base}/api/webhooks/infinitepay`,
    cliente: { nome, email, telefone: telefone || undefined },
    endereco: {
      cep: endereco.cep,
      street: endereco.rua,
      number: endereco.numero,
      neighborhood: endereco.bairro,
      city: endereco.cidade,
      state: endereco.uf,
      ...(endereco.complemento ? { complement: endereco.complemento } : {}),
    },
    validoAte,
  });

  if (!link.ok) {
    console.error("[checkout] InfinitePay recusou:", link.status, link.erro);
    await supabase
      .from("orders")
      .update({ status: "recusado", updated_at: new Date().toISOString() })
      .eq("id", pedido.id);
    return NextResponse.json(
      { erro: "A InfinitePay não conseguiu abrir o pagamento agora." },
      { status: 502 },
    );
  }

  await supabase
    .from("orders")
    .update({ checkout_url: link.url, updated_at: new Date().toISOString() })
    .eq("id", pedido.id);

  return NextResponse.json({
    pedidoId: pedido.id,
    orderNsu,
    total: montado.amount,
    url: link.url,
  });
}
