import { beforeAll, describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { as, asSuperuser, createDb, type Db } from "./harness"
import { buildSeedSql } from "@/lib/menu/seed-sql"
import { seedCatalog } from "@/lib/menu/seed-data"

const ADMIN = "11111111-1111-4111-8111-111111111111"
const CUSTOMER = "22222222-2222-4222-8222-222222222222"
const GADO = "00000000-0000-4000-8000-a00000000003"

let db: Db

beforeAll(async () => {
  db = await createDb()
  await asSuperuser(db, `insert into auth.users (id, email) values ($1, 'admin@x.com'), ($2, 'cliente@x.com')`, [ADMIN, CUSTOMER])
  await asSuperuser(db, `insert into public.admins (user_id, email) values ($1, 'admin@x.com')`, [ADMIN])
})

describe("migrations e carga inicial", () => {
  it("a migration de carga está em sincronia com seed-data.ts", () => {
    const file = readFileSync("supabase/migrations/20261029000200_seed_cardapio.sql", "utf8")
    expect(file).toBe(buildSeedSql())
  })

  it("carrega todos os produtos e preços do cardápio físico", async () => {
    const rows = await as<{ name: string; group_name: string | null; v: string; price_cents: number }>(
      db,
      null,
      `select p.name, v.group_name, v.name as v, v.price_cents from public.products p
       join public.product_variants v on v.product_id = p.id order by p.name, v.sort_order`,
    )
    const expected = seedCatalog.products.flatMap((p) => p.variants.map((v) => v.priceCents)).sort()
    expect(rows.map((r) => r.price_cents).sort()).toEqual(expected)
    const find = (name: string, v = "", g: string | null = null) =>
      rows.find((r) => r.name === name && r.v === v && r.group_name === g)?.price_cents
    expect(find("Espetinho de Gado")).toBe(1590)
    expect(find("Espetinho de Coalho")).toBe(1290)
    expect(find("Pão de Alho")).toBe(700)
    expect(find("Picado Martins")).toBe(7990)
    expect(find("Porção de batatas", "Média")).toBe(2500)
    expect(find("Porção de batatas", "Grande")).toBe(3000)
    expect(find("Medalhão de picanha")).toBe(3490)
    expect(find("Assado de gado em tiras", "300 g")).toBe(2690)
    expect(find("Assado de gado em tiras", "600 g")).toBe(4290)
    expect(find("Cachurrasco 30 cm", "1 espetinho", "Pão Tradicional 30 cm")).toBe(2690)
    expect(find("Cachurrasco 30 cm", "2 espetinhos", "Pão Tradicional 30 cm")).toBe(3990)
    expect(find("Cachurrasco 30 cm", "3 espetinhos", "Pão Tradicional 30 cm")).toBe(5590)
    expect(find("Cachurrasco 30 cm", "1 espetinho", "Pão Parmesão 30 cm")).toBe(2990)
    expect(find("Cachurrasco 30 cm", "2 espetinhos", "Pão Parmesão 30 cm")).toBe(4190)
    expect(find("Cachurrasco 30 cm", "3 espetinhos", "Pão Parmesão 30 cm")).toBe(5790)
    expect(find("Cachurrasco de contrafilé com geleia de pimenta")).toBe(4590)
  })

  it("aplicar a carga de novo não duplica nem sobrescreve", async () => {
    await asSuperuser(db, `update public.product_variants set price_cents = 1690 where product_id = $1`, [GADO])
    await db.exec(buildSeedSql())
    const [{ count }] = await asSuperuser<{ count: number }>(db, `select count(*)::int as count from public.products`)
    expect(count).toBe(seedCatalog.products.length)
    const [{ price_cents }] = await asSuperuser<{ price_cents: number }>(
      db, `select price_cents from public.product_variants where product_id = $1`, [GADO])
    expect(price_cents).toBe(1690)
    await asSuperuser(db, `update public.product_variants set price_cents = 1590 where product_id = $1`, [GADO])
  })
})

describe("RLS", () => {
  it("visitante não grava em nenhuma tabela", async () => {
    await expect(as(db, null, `update public.product_variants set price_cents = 1 where product_id = '${GADO}'`)).rejects.toThrow()
    await expect(as(db, null, `insert into public.categories (slug, name) values ('x', 'X')`)).rejects.toThrow()
    await expect(as(db, null, `update public.settings set whatsapp_number = '5511999999999'`)).rejects.toThrow()
    await expect(as(db, null, `insert into public.admins (user_id) values ('${CUSTOMER}')`)).rejects.toThrow()
  })

  it("usuário autenticado que não é admin não altera nada", async () => {
    const updated = await as(db, CUSTOMER, `update public.product_variants set price_cents = 1 where product_id = $1 returning id`, [GADO])
    expect(updated).toHaveLength(0)
    await expect(as(db, CUSTOMER, `insert into public.categories (slug, name) values ('x', 'X')`)).rejects.toThrow(/row-level security/)
    const settings = await as(db, CUSTOMER, `update public.settings set business_name = 'X' returning id`)
    expect(settings).toHaveLength(0)
    await expect(as(db, CUSTOMER, `insert into public.admins (user_id) values ('${CUSTOMER}')`)).rejects.toThrow()
    await expect(as(db, CUSTOMER, `insert into storage.objects (bucket_id, name) values ('menu-images', 'a.jpg')`)).rejects.toThrow()
  })

  it("admin edita preço, categoria, configurações e envia imagens", async () => {
    const updated = await as(db, ADMIN, `update public.product_variants set price_cents = 1600 where product_id = $1 returning price_cents`, [GADO])
    expect(updated).toEqual([{ price_cents: 1600 }])
    await as(db, ADMIN, `update public.product_variants set price_cents = 1590 where product_id = $1`, [GADO])
    await as(db, ADMIN, `insert into public.categories (slug, name, is_active) values ('bebidas', 'Bebidas', false)`)
    await as(db, ADMIN, `update public.settings set delivery_fee_cents = 500`)
    await as(db, ADMIN, `update public.settings set delivery_fee_cents = null`)
    await as(db, ADMIN, `insert into storage.objects (bucket_id, name) values ('menu-images', 'produtos/a.jpg')`)
  })

  it("admin não consegue se promover nem criar outros admins pela API", async () => {
    await expect(as(db, ADMIN, `insert into public.admins (user_id) values ('${CUSTOMER}')`)).rejects.toThrow()
  })

  it("visitante não vê categorias nem produtos inativos; admin vê", async () => {
    await asSuperuser(db, `update public.products set is_active = false where id = $1`, [GADO])
    const publicRows = await as(db, null, `select id from public.products where id = $1`, [GADO])
    const publicVariants = await as(db, null, `select id from public.product_variants where product_id = $1`, [GADO])
    const adminRows = await as(db, ADMIN, `select id from public.products where id = $1`, [GADO])
    expect(publicRows).toHaveLength(0)
    expect(publicVariants).toHaveLength(0)
    expect(adminRows).toHaveLength(1)
    await asSuperuser(db, `update public.products set is_active = true where id = $1`, [GADO])

    const hidden = await as(db, null, `select slug from public.categories where slug = 'bebidas'`)
    expect(hidden).toHaveLength(0)

    await asSuperuser(db, `update public.categories set is_active = false where slug = 'espetinhos'`)
    const inHiddenCategory = await as(db, null, `select id from public.products where id = $1`, [GADO])
    expect(inHiddenCategory).toHaveLength(0)
    await asSuperuser(db, `update public.categories set is_active = true where slug = 'espetinhos'`)
  })

  it("restrições do banco rejeitam dados inválidos mesmo para admin", async () => {
    await expect(as(db, ADMIN, `update public.product_variants set price_cents = -1 where product_id = $1`, [GADO])).rejects.toThrow()
    await expect(as(db, ADMIN, `update public.settings set whatsapp_number = 'abc'`)).rejects.toThrow()
    await expect(as(db, ADMIN, `insert into public.categories (slug, name) values ('Slug Inválido', 'X')`)).rejects.toThrow()
  })
})
