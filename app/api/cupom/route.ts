import { NextResponse } from "next/server";
import { temServiceRole } from "@/lib/supabase/admin";
import { conferirCupom } from "@/lib/cupom";
import { montarPedido, type ItemPedido } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Prévia do cupom no checkout.
 *
 * O total vem do banco, nunca do navegador: o carrinho enviado é remontado
 * aqui antes de o mínimo do cupom ser conferido. Nenhum uso é gasto.
 */
export async function POST(req: Request) {
  if (!temServiceRole()) {
    return NextResponse.json({ erro: "Cupom indisponível agora." }, { status: 503 });
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "Pedido mal formado." }, { status: 400 });
  }

  const c = corpo as { codigo?: string; itens?: ItemPedido[] };

  const montado = await montarPedido(c.itens ?? []);
  if ("erro" in montado) {
    return NextResponse.json({ erro: montado.erro }, { status: 400 });
  }

  const r = await conferirCupom(String(c.codigo ?? ""), montado.itemsAmount);
  if (!r.ok) return NextResponse.json({ erro: r.erro }, { status: 400 });

  return NextResponse.json({ codigo: r.codigo, desconto: r.desconto });
}
