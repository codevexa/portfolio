"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/products";
import { ICONES_GARANTIA, TEXTOS_PADRAO, type TextKey } from "@/lib/texts";

export type ActionState = { ok?: string; erro?: string } | null;

/** Revalida o site inteiro: o que o vendedor salva aparece na hora. */
function revalidarLoja() {
  revalidatePath("/", "layout");
}

function num(v: FormDataEntryValue | null): number | null {
  if (v == null) return null;
  const s = String(v).replace(/\./g, "").replace(",", ".").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function listaDe(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function dadosDoProduto(form: FormData) {
  const nome = String(form.get("nome") ?? "").trim();
  const preco = num(form.get("preco"));
  const precoDe = num(form.get("preco_de"));

  if (!nome) return { erro: "Dá um nome pro produto." as const };
  if (preco === null || preco < 0) return { erro: "Preço inválido." as const };
  if (precoDe !== null && precoDe <= preco) {
    return { erro: 'O "preço de" precisa ser maior que o preço de venda.' as const };
  }

  const tamanhos = listaDe(form.get("tamanhos"));
  const lista = tamanhos.length ? tamanhos : ["P", "M", "G", "GG", "XGG"];
  const estoque: Record<string, number> = {};
  for (const t of lista) {
    const n = Number(form.get(`estoque_${t}`) ?? 0);
    estoque[t] = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  return {
    dados: {
      nome,
      slug: slugify(String(form.get("slug") ?? "").trim() || nome),
      clube: String(form.get("clube") ?? "") || null,
      liga: String(form.get("liga") ?? "") || null,
      categoria: String(form.get("categoria") ?? "camisas"),
      preco,
      preco_de: precoDe,
      pronta_entrega: form.get("pronta_entrega") === "on",
      ativo: form.get("ativo") === "on",
      tamanhos: lista,
      controla_estoque: form.get("controla_estoque") === "on",
      estoque,
      foto_url: String(form.get("foto_url") ?? "").trim() || null,
      descricao: String(form.get("descricao") ?? "").trim() || null,
      ordem: Number(form.get("ordem") ?? 0) || 0,
    },
  };
}

export async function salvarProduto(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const id = String(form.get("id") ?? "");
  const parsed = dadosDoProduto(form);
  if ("erro" in parsed) return { erro: parsed.erro };

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("products")
      .update(parsed.dados)
      .eq("id", id);
    if (error) return { erro: traduzir(error.message) };
  } else {
    const { error } = await supabase.from("products").insert(parsed.dados);
    if (error) return { erro: traduzir(error.message) };
  }

  revalidarLoja();
  redirect("/admin?salvo=1");
}

export async function excluirProduto(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidarLoja();
  redirect("/admin?excluido=1");
}

const CAMPOS_ALTERNAVEIS: Record<string, string[]> = {
  products: ["ativo", "pronta_entrega"],
  clubs: ["ativo", "destaque"],
  leagues: ["ativo"],
  banners: ["ativo"],
  categories: ["ativo", "destaque"],
  faqs: ["ativo"],
  depoimentos: ["ativo"],
  garantias: ["ativo"],
};

export async function alternarCampo(form: FormData) {
  const id = String(form.get("id") ?? "");
  const campo = String(form.get("campo") ?? "");
  const tabela = String(form.get("tabela") ?? "products");
  const valor = String(form.get("valor") ?? "") === "true";
  const volta = String(form.get("volta") ?? "/admin");

  if (!id || !CAMPOS_ALTERNAVEIS[tabela]?.includes(campo)) return;

  const supabase = await createClient();
  await supabase
    .from(tabela)
    .update({ [campo]: !valor })
    .eq("id", id);

  revalidarLoja();
  revalidatePath(volta);
}

/* ------------------------------------------------------------------ */
/* Banners                                                             */
/* ------------------------------------------------------------------ */

export async function salvarBanner(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const titulo = String(form.get("titulo") ?? "").trim();
  if (!titulo) return { erro: "O banner precisa de um título." };

  const dados = {
    etiqueta: String(form.get("etiqueta") ?? "").trim(),
    titulo,
    texto: String(form.get("texto") ?? "").trim(),
    cta_texto: String(form.get("cta_texto") ?? "").trim(),
    cta_link: String(form.get("cta_link") ?? "/").trim() || "/",
    imagem_url: String(form.get("imagem_url") ?? "").trim() || null,
    cor_fundo: String(form.get("cor_fundo") ?? "#0b0b0b"),
    cor_destaque: String(form.get("cor_destaque") ?? "#e3ff00"),
    ativo: form.get("ativo") === "on",
    ordem: Number(form.get("ordem") ?? 0) || 0,
  };

  const supabase = await createClient();
  const id = String(form.get("id") ?? "");
  const { error } = id
    ? await supabase.from("banners").update(dados).eq("id", id)
    : await supabase.from("banners").insert(dados);

  if (error) return { erro: traduzir(error.message) };

  revalidarLoja();
  redirect("/admin/banners?salvo=1");
}

export async function excluirBanner(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("banners").delete().eq("id", id);
  revalidarLoja();
  redirect("/admin/banners?excluido=1");
}

/* ------------------------------------------------------------------ */
/* Times                                                               */
/* ------------------------------------------------------------------ */

export async function salvarTime(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const nome = String(form.get("nome") ?? "").trim();
  if (!nome) return { erro: "O time precisa de um nome." };

  const idAtual = String(form.get("id_atual") ?? "");
  const id = slugify(String(form.get("id") ?? "").trim() || nome);

  const dados = {
    id,
    nome,
    liga: String(form.get("liga") ?? "") || null,
    cor1: String(form.get("cor1") ?? "#121212"),
    cor2: String(form.get("cor2") ?? "#e3ff00"),
    padrao: String(form.get("padrao") ?? "solid"),
    logo_url: String(form.get("logo_url") ?? "").trim() || null,
    ativo: form.get("ativo") === "on",
    destaque: form.get("destaque") === "on",
    ordem: Number(form.get("ordem") ?? 0) || 0,
  };

  const supabase = await createClient();
  const { error } = idAtual
    ? await supabase.from("clubs").update(dados).eq("id", idAtual)
    : await supabase.from("clubs").insert(dados);

  if (error) return { erro: traduzir(error.message) };

  revalidarLoja();
  redirect("/admin/times?salvo=1");
}

export async function excluirTime(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("clubs").delete().eq("id", id);
  revalidarLoja();
  redirect("/admin/times?excluido=1");
}

/* ------------------------------------------------------------------ */
/* Ligas                                                               */
/* ------------------------------------------------------------------ */

export async function salvarLiga(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const nome = String(form.get("nome") ?? "").trim();
  if (!nome) return { erro: "A liga precisa de um nome." };

  const idAtual = String(form.get("id_atual") ?? "");
  const dados = {
    id: slugify(String(form.get("id") ?? "").trim() || nome),
    nome,
    descricao: String(form.get("descricao") ?? "").trim(),
    cor_fundo: String(form.get("cor_fundo") ?? "#0b0b0b"),
    cor_destaque: String(form.get("cor_destaque") ?? "#e3ff00"),
    ativo: form.get("ativo") === "on",
    ordem: Number(form.get("ordem") ?? 0) || 0,
  };

  const supabase = await createClient();
  const { error } = idAtual
    ? await supabase.from("leagues").update(dados).eq("id", idAtual)
    : await supabase.from("leagues").insert(dados);

  if (error) return { erro: traduzir(error.message) };

  revalidarLoja();
  return { ok: `Liga "${nome}" salva.` };
}

export async function excluirLiga(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("leagues").delete().eq("id", id);
  revalidarLoja();
  revalidatePath("/admin/ligas");
}

export async function salvarConfig(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const whatsapp = String(form.get("whatsapp") ?? "").replace(/\D/g, "");
  if (whatsapp && (whatsapp.length < 12 || whatsapp.length > 13)) {
    return {
      erro: "WhatsApp deve ter DDI + DDD + número, ex.: 5583999998888.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({
      nome_loja: String(form.get("nome_loja") ?? "").trim() || "Resenha FC Mantos",
      whatsapp,
      instagram: String(form.get("instagram") ?? "").replace("@", "").trim(),
      horario: String(form.get("horario") ?? "").trim(),
      abre_hora: Number(form.get("abre_hora") ?? 8),
      fecha_hora: Number(form.get("fecha_hora") ?? 18),
      dias_abertos: form.getAll("dias_abertos").map((d) => Number(d)),
      frase_topo: listaDe(form.get("frase_topo")),
      pagamentos: listaDe(form.get("pagamentos")),
    })
    .eq("id", 1);

  if (error) return { erro: traduzir(error.message) };

  revalidarLoja();
  return { ok: "Configurações salvas. O site já está atualizado." };
}

/** Login do vendedor. Server action: funciona mesmo antes da página hidratar. */
export async function entrar(form: FormData) {
  const email = String(form.get("email") ?? "").trim();
  const senha = String(form.get("senha") ?? "");
  const destino = String(form.get("next") || "/admin");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    const motivo = error.message.toLowerCase().includes("invalid")
      ? "senha"
      : "erro";
    redirect(`/admin/login?e=${motivo}`);
  }

  redirect(destino.startsWith("/admin") ? destino : "/admin");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function traduzir(msg: string) {
  if (msg.includes("duplicate key") && msg.includes("slug")) {
    return "Já existe um produto com esse endereço (slug). Mude o nome ou o slug.";
  }
  if (msg.includes("duplicate key")) {
    return "Já existe um registro com esse endereço (slug). Escolha outro.";
  }
  if (msg.includes("violates foreign key")) {
    return "Esse item está em uso por produtos. Desative em vez de excluir.";
  }
  if (msg.includes("row-level security")) {
    return "Sua conta não tem permissão para essa alteração.";
  }
  return msg;
}

/* ------------------------------------------------------------------ */
/* Categorias                                                          */
/* ------------------------------------------------------------------ */

export async function salvarCategoria(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const nome = String(form.get("nome") ?? "").trim();
  if (!nome) return { erro: "A categoria precisa de um nome." };

  const idAtual = String(form.get("id_atual") ?? "");
  const id = slugify(String(form.get("id") ?? "").trim() || nome);
  if (!id) return { erro: "Não consegui gerar o endereço da categoria." };

  const dados = {
    id,
    nome,
    descricao: String(form.get("descricao") ?? "").trim(),
    cor_fundo: String(form.get("cor_fundo") ?? "#0b0b0b"),
    cor_destaque: String(form.get("cor_destaque") ?? "#e3ff00"),
    ativo: form.get("ativo") === "on",
    destaque: form.get("destaque") === "on",
    ordem: Number(form.get("ordem") ?? 0) || 0,
  };

  const supabase = await createClient();
  const { error } = idAtual
    ? await supabase.from("categories").update(dados).eq("id", idAtual)
    : await supabase.from("categories").insert(dados);

  if (error) return { erro: traduzir(error.message) };

  revalidarLoja();
  revalidatePath("/admin/categorias");
  return { ok: `Categoria "${nome}" salva.` };
}

export async function excluirCategoria(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();

  // Categoria em uso não é apagada: seria produto órfão no catálogo.
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("categoria", id);

  if (count && count > 0) {
    await supabase.from("categories").update({ ativo: false }).eq("id", id);
    revalidarLoja();
    revalidatePath("/admin/categorias");
    redirect("/admin/categorias?emuso=1");
  }

  await supabase.from("categories").delete().eq("id", id);
  revalidarLoja();
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias?excluido=1");
}

/* ------------------------------------------------------------------ */
/* Textos do site                                                      */
/* ------------------------------------------------------------------ */

/** Salva um grupo de textos de uma vez. Campo vazio volta ao padrão. */
export async function salvarTextos(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const grupo = String(form.get("grupo") ?? "");
  const chaves = form.getAll("chave").map((c) => String(c));
  if (chaves.length === 0) return { erro: "Nada para salvar." };

  const supabase = await createClient();
  const guardar: { chave: string; valor: string }[] = [];
  const apagar: string[] = [];

  for (const chave of chaves) {
    if (!(chave in TEXTOS_PADRAO)) continue;
    const valor = String(form.get(`t:${chave}`) ?? "").trim();
    const padrao = TEXTOS_PADRAO[chave as TextKey];
    if (!valor || valor === padrao) apagar.push(chave);
    else guardar.push({ chave, valor });
  }

  if (guardar.length) {
    const { error } = await supabase
      .from("site_texts")
      .upsert(guardar, { onConflict: "chave" });
    if (error) return { erro: traduzir(error.message) };
  }
  if (apagar.length) {
    const { error } = await supabase
      .from("site_texts")
      .delete()
      .in("chave", apagar);
    if (error) return { erro: traduzir(error.message) };
  }

  revalidarLoja();
  revalidatePath("/admin/textos");
  return {
    ok: `${guardar.length + apagar.length} texto(s) salvos${grupo ? ` em "${grupo}"` : ""}. O site já está atualizado.`,
  };
}

/* ------------------------------------------------------------------ */
/* Perguntas frequentes                                                */
/* ------------------------------------------------------------------ */

export async function salvarPergunta(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const pergunta = String(form.get("pergunta") ?? "").trim();
  const resposta = String(form.get("resposta") ?? "").trim();
  if (!pergunta) return { erro: "Escreva a pergunta." };
  if (!resposta) return { erro: "Escreva a resposta." };

  const dados = {
    pergunta,
    resposta,
    ativo: form.get("ativo") === "on",
    ordem: Number(form.get("ordem") ?? 0) || 0,
  };

  const supabase = await createClient();
  const id = String(form.get("id") ?? "");
  const { error } = id
    ? await supabase.from("faqs").update(dados).eq("id", id)
    : await supabase.from("faqs").insert(dados);

  if (error) return { erro: traduzir(error.message) };

  revalidarLoja();
  revalidatePath("/admin/textos/perguntas");
  return { ok: "Pergunta salva." };
}

export async function excluirPergunta(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("faqs").delete().eq("id", id);
  revalidarLoja();
  revalidatePath("/admin/textos/perguntas");
}

/* ------------------------------------------------------------------ */
/* Depoimentos                                                         */
/* ------------------------------------------------------------------ */

export async function salvarDepoimento(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const nome = String(form.get("nome") ?? "").trim();
  const texto = String(form.get("texto") ?? "").trim();
  if (!nome) return { erro: "Diga quem escreveu." };
  if (!texto) return { erro: "Escreva o depoimento." };

  const dados = {
    nome,
    cidade: String(form.get("cidade") ?? "").trim(),
    texto,
    ativo: form.get("ativo") === "on",
    ordem: Number(form.get("ordem") ?? 0) || 0,
  };

  const supabase = await createClient();
  const id = String(form.get("id") ?? "");
  const { error } = id
    ? await supabase.from("depoimentos").update(dados).eq("id", id)
    : await supabase.from("depoimentos").insert(dados);

  if (error) return { erro: traduzir(error.message) };

  revalidarLoja();
  revalidatePath("/admin/textos/depoimentos");
  return { ok: "Depoimento salvo." };
}

export async function excluirDepoimento(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("depoimentos").delete().eq("id", id);
  revalidarLoja();
  revalidatePath("/admin/textos/depoimentos");
}

/* ------------------------------------------------------------------ */
/* Garantias (a faixa de selos)                                        */
/* ------------------------------------------------------------------ */

export async function salvarGarantia(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const texto = String(form.get("texto") ?? "").trim();
  if (!texto) return { erro: "Escreva a garantia." };

  const icone = String(form.get("icone") ?? "star");
  const dados = {
    texto,
    icone: ICONES_GARANTIA.some((i) => i.id === icone) ? icone : "star",
    ativo: form.get("ativo") === "on",
    ordem: Number(form.get("ordem") ?? 0) || 0,
  };

  const supabase = await createClient();
  const id = String(form.get("id") ?? "");
  const { error } = id
    ? await supabase.from("garantias").update(dados).eq("id", id)
    : await supabase.from("garantias").insert(dados);

  if (error) return { erro: traduzir(error.message) };

  revalidarLoja();
  revalidatePath("/admin/textos/garantias");
  return { ok: "Garantia salva." };
}

export async function excluirGarantia(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("garantias").delete().eq("id", id);
  revalidarLoja();
  revalidatePath("/admin/textos/garantias");
}
