/**
 * PostgreSQL local (PGlite) com o mínimo do Supabase para testar migrations e RLS
 * sem tocar em nenhum projeto real: roles anon/authenticated, auth.uid() e storage.
 */
import { PGlite } from "@electric-sql/pglite"
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const SUPABASE_STUB = `
create role anon nologin;
create role authenticated nologin;
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant execute on functions to anon, authenticated;

create schema auth;
grant usage on schema auth to anon, authenticated;
create table auth.users (id uuid primary key, email text unique);
create function auth.uid() returns uuid language sql stable as $f$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$f$;
grant execute on function auth.uid() to anon, authenticated;

create schema storage;
grant usage on schema storage to anon, authenticated;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
grant all on storage.objects to authenticated;
grant select on storage.objects to anon;
create schema extensions;
`

export type Db = PGlite

export async function createDb(): Promise<Db> {
  const db = await PGlite.create({ extensions: { pgcrypto } })
  await db.exec(SUPABASE_STUB)
  const dir = join(process.cwd(), "supabase", "migrations")
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    try {
      await db.exec(readFileSync(join(dir, file), "utf8"))
    } catch (error) {
      throw new Error(`Falha ao aplicar ${file}: ${(error as Error).message}`)
    }
  }
  return db
}

/** Executa SQL como visitante (userId null) ou usuário autenticado, com RLS ativa. */
export async function as<T = Record<string, unknown>>(db: Db, userId: string | null, sql: string, params: unknown[] = []) {
  return db.transaction(async (tx) => {
    await tx.exec(
      userId
        ? `set local role authenticated; select set_config('request.jwt.claim.sub', '${userId}', true);`
        : `set local role anon; select set_config('request.jwt.claim.sub', '', true);`,
    )
    return (await tx.query<T>(sql, params)).rows
  })
}

export async function asSuperuser<T = Record<string, unknown>>(db: Db, sql: string, params: unknown[] = []) {
  return (await db.query<T>(sql, params)).rows
}
