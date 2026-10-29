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
