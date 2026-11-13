import { createClient } from "@/lib/supabase/server";
import { CouponForm, type Cupom } from "@/components/admin/coupon-form";

export const dynamic = "force-dynamic";

export default async function AdminCupons() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("id,codigo,tipo,valor,minimo,usos_max,usos,valido_ate,ativo")
    .order("criado_em", { ascending: false });

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">Cupons</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        O cliente digita o código no checkout. O desconto entra sobre o valor
        dos produtos, depois do desconto geral da loja.
      </p>

      {error ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="text-[13px] font-bold text-amber-900">
            A tabela <code className="font-mono">coupons</code> ainda não existe.
          </p>
          <p className="mt-1.5 text-[13px] text-amber-900/80">
            Rode <code className="font-mono">supabase/06-descontos-e-cupons.sql</code>{" "}
            no SQL Editor do Supabase.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {((data ?? []) as Cupom[]).map((c) => (
            <CouponForm key={c.id} cupom={c} />
          ))}
          <div className="pt-2">
            <p className="mb-2 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
              NOVO CUPOM
            </p>
            <CouponForm />
          </div>
        </div>
      )}
    </>
  );
}
