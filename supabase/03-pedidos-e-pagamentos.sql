-- =====================================================================
-- Resenha FC Mantos — pedidos e pagamentos (InfinitePay)
-- Rode UMA VEZ no SQL Editor do Supabase. É seguro rodar de novo.
--
-- Observações sobre o pedido original:
--
-- 1. A tabela `products` JÁ EXISTE neste projeto, com as colunas em
--    português (id, nome, descricao, preco, ativo, criado_em). Ela não é
--    recriada aqui: recriar quebraria a loja inteira, que já roda em cima
--    dela. O mapeamento para os nomes pedidos é:
--      name -> nome | description -> descricao | price -> preco
--      active -> ativo | created_at -> criado_em
--
-- 2. `orders.product_id` virou a tabela `order_items`: o carrinho da loja
--    aceita vários produtos e vários tamanhos no mesmo pedido, então um
--    único product_id por pedido perderia informação.
--
-- 3. `orders.user_id` existe e é nulo por enquanto: a loja não tem login
--    de cliente, só do vendedor. A coluna fica pronta para quando tiver.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Frete, para o total poder ser fechado antes do pagamento
-- ---------------------------------------------------------------------
alter table public.settings
  add column if not exists frete_centavos integer not null default 0;

comment on column public.settings.frete_centavos is
  'Frete em centavos somado a todo pedido. 0 = frete grátis. Editado em /admin/config.';

-- ---------------------------------------------------------------------
-- 1. PEDIDOS
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid,
  order_nsu        text        not null unique,
  customer_name    text        not null,
  customer_email   text        not null,
  customer_phone   text,
  address          jsonb,
  items_amount     integer     not null,
  shipping_amount  integer     not null default 0,
  amount           integer     not null,
  status           text        not null default 'pendente',
  checkout_url     text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint orders_status_valido check (
    status in ('pendente','aprovado','recusado','cancelado','estornado')
  ),
  constraint orders_valores_positivos check (
    items_amount >= 0 and shipping_amount >= 0 and amount >= 100
  ),
  constraint orders_total_confere check (amount = items_amount + shipping_amount)
);

comment on table  public.orders is 'Pedidos da loja. Valores sempre em centavos.';
comment on column public.orders.order_nsu is 'Identificador enviado à InfinitePay como order_nsu.';
comment on column public.orders.user_id is 'Reservado: ainda não existe login de cliente.';

create index if not exists orders_status_idx     on public.orders (status);
create index if not exists orders_criado_idx     on public.orders (created_at desc);
create index if not exists orders_email_idx      on public.orders (customer_email);

-- ---------------------------------------------------------------------
-- 2. ITENS DO PEDIDO
-- ---------------------------------------------------------------------
create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid    not null references public.orders(id) on delete cascade,
  product_id    uuid    not null references public.products(id) on delete restrict,
  product_name  text    not null,
  product_slug  text    not null,
  size          text,
  quantity      integer not null check (quantity > 0),
  unit_amount   integer not null check (unit_amount >= 0),
  subtotal      integer not null check (subtotal >= 0),
  created_at    timestamptz not null default now()
);

comment on table public.order_items is
  'Itens congelados no momento do pedido: nome e preço ficam gravados aqui.';

create index if not exists order_items_pedido_idx  on public.order_items (order_id);
create index if not exists order_items_produto_idx on public.order_items (product_id);

-- ---------------------------------------------------------------------
-- 3. PAGAMENTOS
-- ---------------------------------------------------------------------
create table if not exists public.payments (
  id                   uuid primary key default gen_random_uuid(),
  order_id             uuid    not null references public.orders(id) on delete cascade,
  provider             text    not null default 'infinitepay',
  provider_payment_id  text,
  transaction_nsu      text    not null,
  payment_method       text,
  amount               integer not null,
  paid_amount          integer,
  installments         integer,
  status               text    not null default 'aprovado',
  receipt_url          text,
  paid_at              timestamptz,
  created_at           timestamptz not null default now()
);

-- Trava de pagamento duplicado: o mesmo aviso nunca entra duas vezes.
create unique index if not exists payments_provider_transacao_uidx
  on public.payments (provider, transaction_nsu);
create index if not exists payments_pedido_idx on public.payments (order_id);

comment on column public.payments.provider_payment_id is 'invoice_slug da InfinitePay.';
comment on column public.payments.paid_amount is
  'Valor efetivamente pago. Com taxa repassada pode ser maior que amount.';

-- ---------------------------------------------------------------------
-- 4. EVENTOS RECEBIDOS (auditoria e idempotência)
-- ---------------------------------------------------------------------
create table if not exists public.payment_events (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references public.orders(id) on delete set null,
  event_type  text        not null,
  event_key   text        not null,
  payload     jsonb       not null,
  processed   boolean     not null default false,
  result      text,
  created_at  timestamptz not null default now()
);

-- Mesmo evento, da mesma transação, só é gravado uma vez.
create unique index if not exists payment_events_chave_uidx
  on public.payment_events (event_key);
create index if not exists payment_events_pedido_idx on public.payment_events (order_id);
create index if not exists payment_events_criado_idx on public.payment_events (created_at desc);

comment on column public.payment_events.event_key is
  'event_type + transaction_nsu. Garante que um aviso repetido não seja processado de novo.';

-- ---------------------------------------------------------------------
-- 5. CONFIRMAÇÃO DO PAGAMENTO (atômica e idempotente)
-- ---------------------------------------------------------------------
-- Só é chamada DEPOIS de o servidor confirmar o pagamento no
-- /payment_check da InfinitePay. Ela mesma confere o valor de novo, grava
-- o pagamento, aprova o pedido e baixa o estoque, tudo numa transação.
create or replace function public.confirmar_pagamento(
  p_order_nsu       text,
  p_transaction_nsu text,
  p_invoice_slug    text,
  p_payment_method  text,
  p_amount          integer,
  p_paid_amount     integer,
  p_installments    integer,
  p_receipt_url     text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order   public.orders%rowtype;
  v_item    record;
  v_gravou  integer;
begin
  select * into v_order from public.orders
    where order_nsu = p_order_nsu
    for update;

  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'pedido_nao_encontrado');
  end if;

  -- O valor cobrado tem de ser exatamente o que o pedido fechou.
  if p_amount is distinct from v_order.amount then
    return jsonb_build_object(
      'ok', false, 'motivo', 'valor_divergente',
      'esperado', v_order.amount, 'recebido', p_amount
    );
  end if;

  insert into public.payments (
    order_id, provider, provider_payment_id, transaction_nsu,
    payment_method, amount, paid_amount, installments,
    status, paid_at, receipt_url
  ) values (
    v_order.id, 'infinitepay', p_invoice_slug, p_transaction_nsu,
    p_payment_method, p_amount, p_paid_amount, p_installments,
    'aprovado', now(), p_receipt_url
  )
  on conflict (provider, transaction_nsu) do nothing;

  get diagnostics v_gravou = row_count;

  if v_gravou = 0 then
    -- Já tinha sido processado antes. Nada é feito de novo.
    return jsonb_build_object('ok', true, 'ja_processado', true,
                              'order_id', v_order.id, 'status', v_order.status);
  end if;

  update public.orders
     set status = 'aprovado', updated_at = now()
   where id = v_order.id;

  -- Baixa de estoque, um item por vez (o mesmo produto pode aparecer em
  -- tamanhos diferentes no mesmo pedido).
  for v_item in
    select product_id, size, quantity from public.order_items where order_id = v_order.id
  loop
    if v_item.size is not null then
      update public.products
         set estoque = jsonb_set(
               coalesce(estoque, '{}'::jsonb),
               array[v_item.size],
               to_jsonb(greatest(0, coalesce((estoque ->> v_item.size)::int, 0) - v_item.quantity))
             ),
             atualizado_em = now()
       where id = v_item.product_id and controla_estoque;
    end if;
  end loop;

  return jsonb_build_object('ok', true, 'ja_processado', false,
                            'order_id', v_order.id, 'status', 'aprovado');
end $$;

revoke all on function public.confirmar_pagamento(
  text, text, text, text, integer, integer, integer, text) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 6. SEGURANÇA (RLS)
-- ---------------------------------------------------------------------
-- Ninguém anônimo lê pedido nem pagamento. O site mostra o pedido ao
-- comprador por uma rota de servidor, com a service role key. O painel lê
-- como admin. A service role ignora RLS, como é esperado.
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.payments       enable row level security;
alter table public.payment_events enable row level security;

do $$
declare t text;
begin
  foreach t in array array['orders','order_items','payments','payment_events'] loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_le', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_total', t);
    execute format('drop policy if exists %I on public.%I', t || '_anon_nada', t);

    -- O vendedor logado lê tudo pelo painel.
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_admin())',
      t || '_admin_le', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 7. Conferência rápida depois de rodar
-- ---------------------------------------------------------------------
-- select table_name from information_schema.tables
--  where table_schema = 'public'
--    and table_name in ('orders','order_items','payments','payment_events');
