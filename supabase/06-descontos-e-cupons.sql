-- =====================================================================
-- Desconto geral da loja + cupons + limpeza dos descontos antigos
-- Rode UMA VEZ no SQL Editor. Seguro rodar de novo.
-- =====================================================================

-- ---------- 1. Desconto geral, em % sobre todo produto ----------
alter table public.settings
  add column if not exists desconto_percentual numeric(5,2) not null default 0;

comment on column public.settings.desconto_percentual is
  'Desconto aplicado a todo o catalogo, em %. 10 = 10% off. Editado em /admin/config.';

-- Liga os 10% pedidos.
update public.settings set desconto_percentual = 10 where id = 1;

-- ---------- 2. Apaga os descontos antigos por produto ----------
-- O "preco_de" era o riscado de cada produto. Some, porque agora quem
-- manda e o desconto geral.
update public.products set preco_de = null where preco_de is not null;

-- ---------- 3. Cupons ----------
create table if not exists public.coupons (
  id             uuid primary key default gen_random_uuid(),
  codigo         text not null,
  tipo           text not null default 'percentual',
  valor          numeric(10,2) not null,
  minimo         integer not null default 0,
  usos_max       integer,
  usos           integer not null default 0,
  valido_ate     timestamptz,
  ativo          boolean not null default true,
  criado_em      timestamptz not null default now(),
  constraint coupons_tipo_valido check (tipo in ('percentual','valor')),
  constraint coupons_valor_positivo check (valor > 0),
  constraint coupons_percentual_ate_100 check (tipo <> 'percentual' or valor <= 100)
);

comment on column public.coupons.tipo   is 'percentual (% off) ou valor (desconto fixo em reais).';
comment on column public.coupons.minimo is 'Valor minimo do pedido, em centavos, para o cupom valer.';
comment on column public.coupons.usos_max is 'Quantas vezes pode ser usado. Vazio = sem limite.';

-- O codigo e unico ignorando maiuscula/minuscula.
create unique index if not exists coupons_codigo_uidx on public.coupons (upper(codigo));

-- ---------- 4. Cupom usado no pedido ----------
alter table public.orders
  add column if not exists coupon_code     text,
  add column if not exists discount_amount integer not null default 0;

comment on column public.orders.discount_amount is 'Desconto do cupom, em centavos.';

-- O total passa a aceitar o desconto.
alter table public.orders drop constraint if exists orders_total_confere;
alter table public.orders add constraint orders_total_confere
  check (amount = items_amount + shipping_amount - discount_amount);

-- ---------- 5. Seguranca ----------
alter table public.coupons enable row level security;

drop policy if exists coupons_admin_total on public.coupons;
drop policy if exists coupons_leitura on public.coupons;

-- Ninguem anonimo le cupom: a validacao acontece no servidor.
create policy coupons_admin_total on public.coupons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- 6. Conta o uso do cupom, sem corrida ----------
create or replace function public.usar_cupom(p_codigo text, p_total integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare c public.coupons%rowtype;
begin
  select * into c from public.coupons
   where upper(codigo) = upper(p_codigo) for update;

  if not found      then return jsonb_build_object('ok', false, 'motivo', 'nao_existe'); end if;
  if not c.ativo    then return jsonb_build_object('ok', false, 'motivo', 'desativado'); end if;
  if c.valido_ate is not null and c.valido_ate < now()
                    then return jsonb_build_object('ok', false, 'motivo', 'expirado'); end if;
  if c.usos_max is not null and c.usos >= c.usos_max
                    then return jsonb_build_object('ok', false, 'motivo', 'esgotado'); end if;
  if p_total < c.minimo
     then return jsonb_build_object('ok', false, 'motivo', 'minimo', 'minimo', c.minimo); end if;

  update public.coupons set usos = usos + 1 where id = c.id;

  return jsonb_build_object(
    'ok', true, 'codigo', c.codigo, 'tipo', c.tipo, 'valor', c.valor
  );
end $$;

revoke all on function public.usar_cupom(text, integer) from public, anon, authenticated;
grant execute on function public.usar_cupom(text, integer) to service_role;
