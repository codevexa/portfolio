-- ARQUIVO GERADO por `pnpm seed:sql`. Cole todo o conteúdo no SQL Editor do Supabase e execute uma vez.

-- ===== 20261029000100_schema.sql =====
-- Espetinho Bar do Martins — estrutura do cardápio, configurações e administradores.
-- Leitura pública somente do que está ativo; gravação somente por administradores (RLS).

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Administradores
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

-- ---------------------------------------------------------------------------
-- Categorias
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  description text check (char_length(description) <= 500),
  info_note text check (char_length(info_note) <= 500),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_highlighted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Produtos
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  description text check (char_length(description) <= 1000),
  details text check (char_length(details) <= 2000),
  image_path text check (char_length(image_path) <= 500),
  image_alt text check (char_length(image_alt) <= 200),
  variant_label text check (char_length(variant_label) <= 60),
  group_label text check (char_length(group_label) <= 60),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  allows_notes boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category_id, sort_order);

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Variações (todo produto tem ao menos uma; o preço mora aqui)
-- ---------------------------------------------------------------------------
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  group_name text check (char_length(group_name) <= 80),
  name text not null default '' check (char_length(name) <= 80),
  price_cents integer not null check (price_cents >= 0 and price_cents <= 10000000),
  sort_order integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_variants_product_idx on public.product_variants (product_id, sort_order);

create trigger product_variants_touch before update on public.product_variants
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Configurações do estabelecimento (linha única)
-- ---------------------------------------------------------------------------
create table public.settings (
  id smallint primary key default 1 check (id = 1),
  business_name text not null check (char_length(btrim(business_name)) between 1 and 120),
  logo_path text check (char_length(logo_path) <= 500),
  whatsapp_number text not null check (whatsapp_number ~ '^[0-9]{10,15}$'),
  phone_display text not null check (char_length(phone_display) <= 40),
  address_line text check (char_length(address_line) <= 300),
  address_confirmed boolean not null default false,
  city text not null default 'Porto Alegre' check (char_length(city) <= 80),
  state text not null default 'RS' check (char_length(state) <= 40),
  maps_query text check (char_length(maps_query) <= 300),
  opening_hours jsonb not null default '[]'::jsonb check (jsonb_typeof(opening_hours) = 'array'),
  delivery_enabled boolean not null default false,
  pickup_enabled boolean not null default true,
  delivery_fee_cents integer check (delivery_fee_cents is null or (delivery_fee_cents >= 0 and delivery_fee_cents <= 1000000)),
  delivery_note text check (char_length(delivery_note) <= 300),
  instagram_url text check (instagram_url is null or instagram_url ~ '^https://'),
  facebook_url text check (facebook_url is null or facebook_url ~ '^https://'),
  about_text text check (char_length(about_text) <= 2000),
  service_message text check (char_length(service_message) <= 500),
  notice_text text check (char_length(notice_text) <= 300),
  notice_active boolean not null default false,
  updated_at timestamptz not null default now()
);

create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.settings enable row level security;

-- O público não grava nada; mesmo com RLS, retiramos o privilégio por precaução.
revoke insert, update, delete, truncate on public.admins, public.categories, public.products,
  public.product_variants, public.settings from anon;
-- Administradores não são criados pela API: somente pelo SQL Editor (ver README).
revoke insert, update, delete, truncate on public.admins from authenticated;
revoke insert, delete, truncate on public.settings from authenticated;

create policy admins_select_self on public.admins for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy categories_select on public.categories for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy categories_insert on public.categories for insert to authenticated
  with check ((select public.is_admin()));
create policy categories_update on public.categories for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy categories_delete on public.categories for delete to authenticated
  using ((select public.is_admin()));

create policy products_select on public.products for select to anon, authenticated
  using (
    (is_active and exists (select 1 from public.categories c where c.id = category_id and c.is_active))
    or (select public.is_admin())
  );
create policy products_insert on public.products for insert to authenticated
  with check ((select public.is_admin()));
create policy products_update on public.products for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy products_delete on public.products for delete to authenticated
  using ((select public.is_admin()));

create policy variants_select on public.product_variants for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id));
create policy variants_insert on public.product_variants for insert to authenticated
  with check ((select public.is_admin()));
create policy variants_update on public.product_variants for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy variants_delete on public.product_variants for delete to authenticated
  using ((select public.is_admin()));

create policy settings_select on public.settings for select to anon, authenticated using (true);
create policy settings_update on public.settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Storage: imagens do cardápio e logotipo (leitura pública, gravação de admins)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-images', 'menu-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy menu_images_admin_select on storage.objects for select to authenticated
  using (bucket_id = 'menu-images' and (select public.is_admin()));
create policy menu_images_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'menu-images' and (select public.is_admin()));
create policy menu_images_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'menu-images' and (select public.is_admin()))
  with check (bucket_id = 'menu-images' and (select public.is_admin()));
create policy menu_images_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'menu-images' and (select public.is_admin()));

-- ===== 20261029000200_seed_cardapio.sql =====
-- ARQUIVO GERADO por `pnpm seed:sql` a partir de lib/menu/seed-data.ts. Não edite à mão.
-- Carga inicial do cardápio físico. Não sobrescreve dados já existentes (on conflict do nothing).

insert into public.categories (id, slug, name, description, info_note, sort_order, is_active, is_highlighted) values ('00000000-0000-4000-8000-c00000000001', 'cachurrascos', 'Cachurrascos', 'Sanduíches de 30 cm preparados com pão, espetinhos e recheios de churrasco.', 'Todos os cachurrascos são recheados com tomate, alface, batata palha e maionese verde da casa.', 10, true, true) on conflict do nothing;
insert into public.categories (id, slug, name, description, info_note, sort_order, is_active, is_highlighted) values ('00000000-0000-4000-8000-c00000000002', 'espetinhos', 'Espetinhos', 'Espetinhos assados na brasa.', null, 20, true, false) on conflict do nothing;
insert into public.categories (id, slug, name, description, info_note, sort_order, is_active, is_highlighted) values ('00000000-0000-4000-8000-c00000000003', 'espetinhos-especiais', 'Espetinhos especiais', 'Espetinhos com cobertura de maionese verde.', null, 30, true, false) on conflict do nothing;
insert into public.categories (id, slug, name, description, info_note, sort_order, is_active, is_highlighted) values ('00000000-0000-4000-8000-c00000000004', 'porcoes-e-combos', 'Porções e combos', null, null, 40, true, false) on conflict do nothing;
insert into public.categories (id, slug, name, description, info_note, sort_order, is_active, is_highlighted) values ('00000000-0000-4000-8000-c00000000005', 'picanha', 'Picanha', null, null, 50, true, false) on conflict do nothing;
insert into public.categories (id, slug, name, description, info_note, sort_order, is_active, is_highlighted) values ('00000000-0000-4000-8000-c00000000006', 'assado-em-tiras', 'Assado em tiras', null, null, 60, true, false) on conflict do nothing;

insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000001', '00000000-0000-4000-8000-c00000000001', 'cachurrasco-30-cm', 'Cachurrasco 30 cm', 'Sanduíche de 30 cm com pão, espetinhos e recheio de churrasco. Escolha o pão e a quantidade de espetinhos.', null, '/img/menu/cachurrasco.svg', 'Ilustração de cachurrasco: sanduíche de churrasco de 30 cm', 'Quantidade de espetinhos', 'Pão', 10, true, true, true, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000001', '00000000-0000-4000-8000-a00000000001', 'Pão Tradicional 30 cm', '1 espetinho', 2690, 10, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000002', '00000000-0000-4000-8000-a00000000001', 'Pão Tradicional 30 cm', '2 espetinhos', 3990, 20, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000003', '00000000-0000-4000-8000-a00000000001', 'Pão Tradicional 30 cm', '3 espetinhos', 5590, 30, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000004', '00000000-0000-4000-8000-a00000000001', 'Pão Parmesão 30 cm', '1 espetinho', 2990, 40, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000005', '00000000-0000-4000-8000-a00000000001', 'Pão Parmesão 30 cm', '2 espetinhos', 4190, 50, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000006', '00000000-0000-4000-8000-a00000000001', 'Pão Parmesão 30 cm', '3 espetinhos', 5790, 60, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000002', '00000000-0000-4000-8000-c00000000001', 'cachurrasco-contrafile-geleia-de-pimenta', 'Cachurrasco de contrafilé com geleia de pimenta', 'Cachurrasco de contrafilé acompanhado de geleia de pimenta.', null, '/img/menu/cachurrasco-contrafile.svg', 'Ilustração de cachurrasco de contrafilé com geleia de pimenta', null, null, 20, true, true, true, true, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000007', '00000000-0000-4000-8000-a00000000002', null, '', 4590, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000003', '00000000-0000-4000-8000-c00000000002', 'espetinho-de-gado', 'Espetinho de Gado', 'Espetinho de carne de gado assado na brasa.', null, '/img/menu/espetinho-gado.svg', 'Ilustração de espetinho de gado na brasa', null, null, 10, true, true, true, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000008', '00000000-0000-4000-8000-a00000000003', null, '', 1590, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000004', '00000000-0000-4000-8000-c00000000002', 'espetinho-de-frango', 'Espetinho de Frango', 'Espetinho de frango assado na brasa.', null, '/img/menu/espetinho-frango.svg', 'Ilustração de espetinho de frango na brasa', null, null, 20, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000009', '00000000-0000-4000-8000-a00000000004', null, '', 1590, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000005', '00000000-0000-4000-8000-c00000000002', 'espetinho-misto', 'Espetinho Misto', 'Espetinho misto assado na brasa.', null, '/img/menu/espetinho-misto.svg', 'Ilustração de espetinho misto na brasa', null, null, 30, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000010', '00000000-0000-4000-8000-a00000000005', null, '', 1590, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000006', '00000000-0000-4000-8000-c00000000002', 'espetinho-de-coracao', 'Espetinho de Coração', 'Espetinho de coração assado na brasa.', null, '/img/menu/espetinho-coracao.svg', 'Ilustração de espetinho de coração na brasa', null, null, 40, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000011', '00000000-0000-4000-8000-a00000000006', null, '', 1590, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000007', '00000000-0000-4000-8000-c00000000002', 'espetinho-de-calabresa', 'Espetinho de Calabresa', 'Espetinho de calabresa assado na brasa.', null, '/img/menu/espetinho-calabresa.svg', 'Ilustração de espetinho de calabresa na brasa', null, null, 50, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000012', '00000000-0000-4000-8000-a00000000007', null, '', 1590, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000008', '00000000-0000-4000-8000-c00000000002', 'espetinho-de-coalho', 'Espetinho de Coalho', 'Espetinho de queijo coalho na brasa.', null, '/img/menu/espetinho-coalho.svg', 'Ilustração de espetinho de coalho na brasa', null, null, 60, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000013', '00000000-0000-4000-8000-a00000000008', null, '', 1290, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000009', '00000000-0000-4000-8000-c00000000002', 'pao-de-alho', 'Pão de Alho', 'Pão de alho na brasa.', null, '/img/menu/pao-de-alho.svg', 'Ilustração de pão de alho na brasa', null, null, 70, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000014', '00000000-0000-4000-8000-a00000000009', null, '', 700, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000010', '00000000-0000-4000-8000-c00000000003', 'espetinho-maionese-verde-batata-palha', 'Espetinho com maionese verde e batata palha', 'Opção especial de espetinho com cobertura de maionese verde e batata palha.', null, '/img/menu/espetinho-especial-batata.svg', 'Ilustração de espetinho com maionese verde e batata palha', null, null, 10, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000015', '00000000-0000-4000-8000-a00000000010', null, '', 1590, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000011', '00000000-0000-4000-8000-c00000000003', 'espetinho-maionese-verde-farofa', 'Espetinho com maionese verde e farofa', 'Opção especial de espetinho com cobertura de maionese verde e farofa.', null, '/img/menu/espetinho-especial-farofa.svg', 'Ilustração de espetinho com maionese verde e farofa', null, null, 20, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000016', '00000000-0000-4000-8000-a00000000011', null, '', 1590, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000012', '00000000-0000-4000-8000-c00000000004', 'picado-martins', 'Picado Martins', '3 espetinhos, pão de alho, picles, ovo de codorna e batata frita.', null, '/img/menu/picado.svg', 'Ilustração do Picado Martins: espetinhos, pão de alho, picles, ovo de codorna e batata frita', null, null, 10, true, true, true, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000017', '00000000-0000-4000-8000-a00000000012', null, '', 7990, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000013', '00000000-0000-4000-8000-c00000000004', 'porcao-de-batatas', 'Porção de batatas', 'Porção de batata frita.', null, '/img/menu/batatas.svg', 'Ilustração de porção de batatas fritas', 'Tamanho', null, 20, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000018', '00000000-0000-4000-8000-a00000000013', null, 'Média', 2500, 10, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000019', '00000000-0000-4000-8000-a00000000013', null, 'Grande', 3000, 20, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000014', '00000000-0000-4000-8000-c00000000005', 'medalhao-de-picanha', 'Medalhão de picanha', 'Medalhão de picanha com peso aproximado de 200 g.', null, '/img/menu/medalhao.svg', 'Ilustração de medalhões de picanha grelhados', null, null, 10, true, true, true, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000020', '00000000-0000-4000-8000-a00000000014', null, '', 3490, 10, true) on conflict do nothing;
insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values ('00000000-0000-4000-8000-a00000000015', '00000000-0000-4000-8000-c00000000006', 'assado-de-gado-em-tiras', 'Assado de gado em tiras', 'Gado assado servido em tiras.', null, '/img/menu/assado-tiras.svg', 'Ilustração de carne de gado assada em tiras', 'Peso', null, 10, true, true, false, false, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000021', '00000000-0000-4000-8000-a00000000015', null, '300 g', 2690, 10, true) on conflict do nothing;
insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values ('00000000-0000-4000-8000-b00000000022', '00000000-0000-4000-8000-a00000000015', null, '600 g', 4290, 20, true) on conflict do nothing;

insert into public.settings (id, business_name, logo_path, whatsapp_number, phone_display, address_line, address_confirmed, city, state, maps_query, opening_hours, delivery_enabled, pickup_enabled, delivery_fee_cents, delivery_note, instagram_url, facebook_url, about_text, service_message, notice_text, notice_active) values (1, 'Espetinho Bar do Martins', null, '5551994261019', '(51) 99426-1019', null, false, 'Porto Alegre', 'RS', null, '[{"day":0,"open":"17:00","close":"00:00","closed":true},{"day":1,"open":"17:00","close":"00:00","closed":false},{"day":2,"open":"17:00","close":"00:00","closed":false},{"day":3,"open":"17:00","close":"00:00","closed":false},{"day":4,"open":"17:00","close":"00:00","closed":false},{"day":5,"open":"17:00","close":"00:00","closed":false},{"day":6,"open":"17:00","close":"00:00","closed":false}]'::jsonb, false, true, null, null, null, null, 'O Espetinho Bar do Martins é uma espetaria de Porto Alegre especializada em espetinhos na brasa, carnes assadas e cachurrascos de 30 cm.', 'Depois de enviar o pedido pelo WhatsApp, aguarde a confirmação do estabelecimento.', null, false) on conflict do nothing;

-- ===== 20261029000300_admin_functions.sql =====
-- Salva produto + variações numa única transação. Executa com as permissões de quem chama
-- (security invoker): a RLS continua valendo e a função ainda confere is_admin().

create or replace function public.admin_save_product(p jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  pid uuid;
  cat uuid := (p ->> 'category_id')::uuid;
  v jsonb;
  vid uuid;
  keep uuid[] := '{}';
  i integer := 0;
begin
  if not public.is_admin() then
    raise exception 'acesso negado' using errcode = '42501';
  end if;
  if jsonb_typeof(p -> 'variants') is distinct from 'array' or jsonb_array_length(p -> 'variants') = 0 then
    raise exception 'o produto precisa de ao menos um preço' using errcode = '22023';
  end if;

  pid := nullif(p ->> 'id', '')::uuid;
  if pid is null then
    insert into public.products (category_id, slug, name, description, details, image_path, image_alt, variant_label,
      group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes)
    values (cat, p ->> 'slug', p ->> 'name', p ->> 'description', p ->> 'details', p ->> 'image_path', p ->> 'image_alt',
      p ->> 'variant_label', p ->> 'group_label',
      coalesce((select max(sort_order) from public.products where category_id = cat), 0) + 10,
      (p ->> 'is_active')::boolean, (p ->> 'is_available')::boolean, (p ->> 'is_featured')::boolean,
      (p ->> 'is_new')::boolean, (p ->> 'allows_notes')::boolean)
    returning id into pid;
  else
    update public.products set
      category_id = cat,
      slug = p ->> 'slug',
      name = p ->> 'name',
      description = p ->> 'description',
      details = p ->> 'details',
      image_path = p ->> 'image_path',
      image_alt = p ->> 'image_alt',
      variant_label = p ->> 'variant_label',
      group_label = p ->> 'group_label',
      is_active = (p ->> 'is_active')::boolean,
      is_available = (p ->> 'is_available')::boolean,
      is_featured = (p ->> 'is_featured')::boolean,
      is_new = (p ->> 'is_new')::boolean,
      allows_notes = (p ->> 'allows_notes')::boolean
    where id = pid;
    if not found then
      raise exception 'produto não encontrado' using errcode = 'P0002';
    end if;
  end if;

  for v in select value from jsonb_array_elements(p -> 'variants') loop
    i := i + 1;
    vid := nullif(v ->> 'id', '')::uuid;
    if vid is not null then
      update public.product_variants set
        group_name = nullif(v ->> 'group_name', ''),
        name = coalesce(v ->> 'name', ''),
        price_cents = (v ->> 'price_cents')::integer,
        sort_order = i * 10,
        is_available = (v ->> 'is_available')::boolean
      where id = vid and product_id = pid;
      if not found then
        vid := null;
      end if;
    end if;
    if vid is null then
      insert into public.product_variants (product_id, group_name, name, price_cents, sort_order, is_available)
      values (pid, nullif(v ->> 'group_name', ''), coalesce(v ->> 'name', ''), (v ->> 'price_cents')::integer, i * 10,
        (v ->> 'is_available')::boolean)
      returning id into vid;
    end if;
    keep := keep || vid;
  end loop;

  delete from public.product_variants where product_id = pid and not (id = any (keep));
  return pid;
end
$$;

revoke all on function public.admin_save_product(jsonb) from public, anon;
grant execute on function public.admin_save_product(jsonb) to authenticated;
