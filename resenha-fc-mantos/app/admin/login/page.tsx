import { LogoMark } from "@/components/logo";
import { entrar } from "../actions";

const inputCls =
  "w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; next?: string }>;
}) {
  const { e, next } = await searchParams;

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center text-center">
          <LogoMark size={64} />
          <h1 className="mt-4 text-xl font-extrabold text-white">
            Painel do vendedor
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Entre para cuidar do catálogo da loja.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6">
          <form action={entrar} className="space-y-4">
            <input type="hidden" name="next" value={next ?? "/admin"} />

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-bold">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="senha" className="mb-1.5 block text-[13px] font-bold">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                autoComplete="current-password"
                className={inputCls}
              />
            </div>

            {e && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
                {e === "senha"
                  ? "E-mail ou senha incorretos."
                  : "Não consegui entrar agora. Tente de novo em instantes."}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-ink/85"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
