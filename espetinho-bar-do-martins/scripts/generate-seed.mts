/**
 * Gera supabase/migrations/..._seed_cardapio.sql e o arquivo único
 * supabase/aplicar_no_sql_editor.sql (todas as migrations, para colar no SQL Editor).
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { buildSeedSql } from "../lib/menu/seed-sql.ts"

const dir = join(process.cwd(), "supabase", "migrations")
writeFileSync(join(dir, "20261029000200_seed_cardapio.sql"), buildSeedSql())

const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()
const bundle = [
  "-- ARQUIVO GERADO por `pnpm seed:sql`. Cole todo o conteúdo no SQL Editor do Supabase e execute uma vez.",
  "",
  ...files.map((f) => `-- ===== ${f} =====\n${readFileSync(join(dir, f), "utf8")}`),
].join("\n")
writeFileSync(join(process.cwd(), "supabase", "aplicar_no_sql_editor.sql"), bundle)
console.log(`Gerado: ${files.join(", ")} + supabase/aplicar_no_sql_editor.sql`)
