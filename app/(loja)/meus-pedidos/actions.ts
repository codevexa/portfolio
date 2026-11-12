"use server";

import { redirect } from "next/navigation";
import { createAdminClient, temServiceRole } from "@/lib/supabase/admin";

/**
 * Busca o pedido pelo número + e-mail.
 *
 * Os dois precisam bater. A mensagem de erro é sempre a mesma, não importa
 * qual dos dois esteja errado: assim ninguém descobre se um número de
 * pedido existe testando e-mails, nem o contrário.
 */
export async function buscarPedido(form: FormData) {
  const numero = String(form.get("numero") ?? "").trim().toUpperCase();
  const email = String(form.get("email") ?? "").trim().toLowerCase();

  if (!numero || !email || !temServiceRole()) redirect("/meus-pedidos?erro=1");

  const { data } = await createAdminClient()
    .from("orders")
    .select("id,customer_email")
    .eq("order_nsu", numero)
    .maybeSingle();

  const pedido = data as { id: string; customer_email: string } | null;

  if (!pedido || pedido.customer_email.trim().toLowerCase() !== email) {
    redirect("/meus-pedidos?erro=1");
  }

  redirect(`/pedido/${pedido.id}`);
}
