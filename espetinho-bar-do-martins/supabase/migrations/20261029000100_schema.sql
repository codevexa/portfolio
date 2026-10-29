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
