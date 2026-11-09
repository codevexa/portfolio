import { getSettings } from "@/lib/settings";
import { ConfigForm } from "@/components/admin/config-form";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const s = await getSettings();
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">Configurações</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        O que você muda aqui aparece no site na hora.
      </p>
      <ConfigForm settings={s} />
    </>
  );
}
