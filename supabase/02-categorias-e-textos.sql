-- =====================================================================
-- Resenha FC Mantos — categorias e textos editáveis no painel
-- Rode este arquivo UMA VEZ no SQL Editor do Supabase.
-- É seguro rodar de novo: tudo usa "if not exists" / "on conflict".
-- =====================================================================

-- Confere antes de tudo: as políticas abaixo usam a função public.is_admin(),
-- criada no primeiro arquivo de migração deste projeto.
do $$
begin
  if to_regprocedure('public.is_admin()') is null then
    raise exception
      'A função public.is_admin() não existe. Rode primeiro a migração que cria a tabela public.admins e essa função.';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 1. CATEGORIAS
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id            text primary key,
  nome          text    not null,
  descricao     text    not null default '',
  cor_fundo     text    not null default '#0b0b0b',
  cor_destaque  text    not null default '#e3ff00',
  ativo         boolean not null default true,
  destaque      boolean not null default true,
  ordem         integer not null default 0,
  criado_em     timestamptz not null default now()
);

comment on table  public.categories is 'Categorias da loja. Editadas em /admin/categorias.';
comment on column public.categories.destaque is 'Aparece nos cards "Compre por Categoria" da home.';

insert into public.categories (id, nome, descricao, cor_fundo, cor_destaque, ordem, destaque) values
  ('pronta-entrega', 'Pronta Entrega',    'Sai hoje do estoque', '#0b0b0b', '#e3ff00', 1, true),
  ('camisas',        'Camisas',           'Clubes e seleções',   '#0f0f0f', '#f5f5f5', 2, false),
  ('kits',           'Kits',              'Camisa + shorts',     '#0b0b0b', '#e3ff00', 3, true),
  ('retro',          'Retrô',             'Mantos clássicos',    '#141208', '#a8801a', 4, true),
  ('selecoes',       'Seleções Mundiais', 'Copa e amistosos',    '#12100a', '#c9a227', 5, true),
  ('chuteiras',      'Chuteiras',         'Campo e society',     '#0f0f0f', '#f5f5f5', 6, true),
  ('acessorios',     'Acessórios',        'Caixas e brindes',    '#12100a', '#c9a227', 7, true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 2. TEXTOS DO SITE (chave -> valor)
-- ---------------------------------------------------------------------
create table if not exists public.site_texts (
  chave         text primary key,
  valor         text not null,
  atualizado_em timestamptz not null default now()
);

comment on table public.site_texts is
  'Textos fixos que o cliente lê. Vazio = usa o padrão do código. Editado em /admin/textos.';

-- ---------------------------------------------------------------------
-- 3. PERGUNTAS FREQUENTES
-- ---------------------------------------------------------------------
create table if not exists public.faqs (
  id        uuid primary key default gen_random_uuid(),
  pergunta  text    not null,
  resposta  text    not null,
  ativo     boolean not null default true,
  ordem     integer not null default 0
);

insert into public.faqs (pergunta, resposta, ordem)
select * from (values
  ('Qual o prazo de entrega?',
   'Enviamos para todo o Brasil. Após a confirmação do pagamento, o prazo varia conforme a sua região — combinamos tudo pelo WhatsApp e você recebe o código de rastreio assim que o pedido é postado.', 1),
  ('Como faço para comprar?',
   'É simples: escolha o manto, adicione ao carrinho e clique em "Fechar pedido no WhatsApp". A conversa já abre com os itens e o total preenchidos. A gente confirma estoque, forma de pagamento e endereço por lá.', 2),
  ('As camisas são de qualidade?',
   'Sim. Trabalhamos com versões torcedor e jogador em tecido dry, costura reforçada e escudo aplicado. Se algo chegar diferente do combinado, a gente resolve.', 3),
  ('Posso trocar se o tamanho não servir?',
   'Pode. Você tem 7 dias corridos após receber para pedir a troca, com a peça sem uso e com etiqueta. Chame no WhatsApp que a gente organiza o envio.', 4),
  ('Quais as formas de pagamento?',
   '{pagamentos}. No PIX a confirmação é na hora e o pedido entra na fila de envio do mesmo dia.', 5)
) as seed(pergunta, resposta, ordem)
where not exists (select 1 from public.faqs);

-- ---------------------------------------------------------------------
-- 4. DEPOIMENTOS
-- ---------------------------------------------------------------------
create table if not exists public.depoimentos (
  id      uuid primary key default gen_random_uuid(),
  nome    text    not null,
  cidade  text    not null default '',
  texto   text    not null,
  ativo   boolean not null default true,
  ordem   integer not null default 0
);

insert into public.depoimentos (nome, cidade, texto, ordem)
select * from (values
  ('Joseane',    'Jaboatão dos Guararapes PE', 'Passando pra dizer que já recebi a camisa, chegou rapidinho e é linda. Obrigada pelo atendimento!', 1),
  ('Elyellton',  'Campina Grande PB',          'Qualidade muito acima do que eu esperava pelo preço. Já virei cliente.', 2),
  ('Luma Sofia', 'Campina Grande PB',          'Comprei o kit do meu time e veio tudo certinho, com rastreio desde o primeiro dia.', 3),
  ('Andrei Lima','Serra Branca PB',            'Atendimento no zap é rápido demais, tirei todas as dúvidas antes de fechar.', 4),
  ('Charles',    'João Pessoa PB',             'Manto retrô impecável, costura e tecido muito bons. Recomendo.', 5)
) as seed(nome, cidade, texto, ordem)
where not exists (select 1 from public.depoimentos);

-- ---------------------------------------------------------------------
-- 5. GARANTIAS (a faixa de selos abaixo dos depoimentos)
-- ---------------------------------------------------------------------
create table if not exists public.garantias (
  id      uuid primary key default gen_random_uuid(),
  texto   text    not null,
  icone   text    not null default 'star',
  ativo   boolean not null default true,
  ordem   integer not null default 0
);

comment on column public.garantias.icone is
  'card, box, search, bolt, chat, lock ou star.';

insert into public.garantias (texto, icone, ordem)
select * from (values
  ('PIX ou cartão',               'card',   1),
  ('Enviamos pro Brasil todo',    'box',    2),
  ('Código de rastreio no envio', 'search', 3),
  ('Envio rápido',                'bolt',   4),
  ('Atendimento no WhatsApp',     'chat',   5),
  ('Compra segura',               'lock',   6),
  ('Qualidade garantida',         'star',   7)
) as seed(texto, icone, ordem)
where not exists (select 1 from public.garantias);

-- ---------------------------------------------------------------------
-- 6. SEGURANÇA (RLS): o site só lê, o vendedor logado escreve
-- ---------------------------------------------------------------------
alter table public.categories  enable row level security;
alter table public.site_texts  enable row level security;
alter table public.faqs        enable row level security;
alter table public.depoimentos enable row level security;
alter table public.garantias   enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['categories','site_texts','faqs','depoimentos','garantias'] loop
    execute format('drop policy if exists %I on public.%I', t || '_leitura_publica', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_total', t);

    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_leitura_publica', t
    );
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_admin_total', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 7. Índices de ordenação
-- ---------------------------------------------------------------------
create index if not exists categories_ordem_idx  on public.categories  (ordem);
create index if not exists faqs_ordem_idx        on public.faqs        (ordem);
create index if not exists depoimentos_ordem_idx on public.depoimentos (ordem);
create index if not exists garantias_ordem_idx   on public.garantias   (ordem);
