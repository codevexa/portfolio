# Espetinho Bar do Martins — site oficial

Site com cardápio digital, carrinho, finalização de pedido pelo WhatsApp e painel administrativo para o
Espetinho Bar do Martins (Porto Alegre, RS).

## O que está pronto

| Página | Endereço |
| --- | --- |
| Início (destaques, cachurrascos 30 cm, diferenciais, sobre nós, horário e localização) | `/` (`/#sobre`) |
| Cardápio completo, com busca, filtro por categoria e “só disponíveis” | `/cardapio` (`?categoria=…&busca=…`) |
| Detalhes do produto | `/cardapio/[produto]` |
| Carrinho | `/carrinho` |
| Finalização do pedido (WhatsApp) | `/finalizar` |
| Contato e localização | `/contato` |
| Login do administrador | `/admin/login` |
| Painel: visão geral e pendências, produtos, categorias, configurações e prévia | `/admin…` |
| Produto indisponível ou não encontrado, página não encontrada, erro amigável | automáticas |
| SEO: títulos, descrições, Open Graph (WhatsApp/Instagram), `sitemap.xml`, `robots.txt`, dados estruturados de restaurante | automáticos |

**Como o pedido funciona:** o cliente monta o carrinho, informa nome, telefone, entrega ou retirada (conforme
habilitado no painel) e endereço, se for entrega. O site abre o WhatsApp do estabelecimento com a mensagem pronta.
**Nada é enviado automaticamente:** o cliente precisa tocar em “enviar” no WhatsApp, e o site avisa que o pedido
só vale após a confirmação do estabelecimento. Não há pagamento online nem registro de pedidos no banco. Essa
escolha é proposital: não há integração de pedidos configurada, e o site não simula uma.

**Preços:** existe uma única fonte, a tabela `product_variants` no Supabase. O carrinho guarda só referências
(produto + variação) e sempre recalcula o preço a partir do cardápio atual. Item que sai do cardápio ou fica
indisponível sai do total.

**Taxa de entrega:** só é somada quando cadastrada no painel. Sem taxa cadastrada, o pedido mostra
“taxa a confirmar com o estabelecimento” e o total fica identificado como “sem taxa de entrega”.

## Tecnologia

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4, ícones Lucide, fontes Oswald e Inter
- Supabase: Postgres com RLS, Auth (login do admin) e Storage (fotos)
- Validação no servidor com Zod
- Testes: Vitest (lógica de carrinho/WhatsApp/horários), PGlite (migrations e RLS) e Playwright (ponta a ponta)
- Preparado para a Vercel

## Rodar localmente

Requisitos: Node 20+ e pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

**Sem o Supabase configurado**, o site funciona em modo somente leitura com o cardápio inicial
(`lib/menu/seed-data.ts`) e o painel mostra “Painel ainda não conectado”.

### Com Supabase local (opcional; precisa de Docker)

```bash
npx supabase start -x studio,imgproxy,edge-runtime,logflare,vector,supavisor,realtime,mailpit,postgres-meta
npx supabase status       # mostra a API URL e a ANON KEY locais
cp .env.example .env.local   # preencha com os valores locais
pnpm dev
```

## Publicar (o que precisa ser feito)

### 1. Supabase

1. Crie um projeto em <https://supabase.com> (sugestão de região: São Paulo, `sa-east-1`).
2. Aplique o banco, de uma destas formas:
   - **SQL Editor:** abra `supabase/aplicar_no_sql_editor.sql`, cole todo o conteúdo e execute uma vez; ou
   - **CLI:** `npx supabase link --project-ref SEU_PROJETO` e depois `npx supabase db push`.

   Isso cria as tabelas, as políticas de segurança, o bucket `menu-images` e carrega o cardápio com os preços.
3. Em **Authentication → Sign In / Providers**, desative **“Allow new users to sign up”**. Os administradores
   são criados manualmente. Mantenha o login por e-mail ligado.
4. Em **Authentication → Users → Add user**, crie o usuário do proprietário (e-mail e senha forte).
5. No **SQL Editor**, transforme esse usuário em administrador:

   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'email-do-proprietario@exemplo.com';
   ```

   Para remover um administrador: `delete from public.admins where email = '...';`
6. Em **Authentication → URL Configuration**, coloque o domínio do site em *Site URL*.

### 2. Vercel

1. Importe o repositório na Vercel. Como o projeto está na pasta `espetinho-bar-do-martins/`, defina
   **Root Directory = `espetinho-bar-do-martins`**.
2. Variáveis de ambiente (Production e Preview):

   | Variável | Valor |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → chave `anon` / publishable |
   | `NEXT_PUBLIC_SITE_URL` | domínio final, ex.: `https://www.espetinhobardomartins.com.br` |

   A chave `anon` é pública por natureza. A proteção das gravações está nas políticas RLS do banco e nas
   verificações de administrador no servidor. A chave `service_role` **não** é usada nem deve ser colocada no site.
3. Conecte o domínio e, depois de publicar, cadastre o site no Google Search Console e envie
   `https://SEU-DOMINIO/sitemap.xml`.

### 3. Pendências de conteúdo (painel → Visão geral lista todas)

- **Endereço:** está vazio de propósito, porque há fontes públicas divergentes. Confirme com o estabelecimento,
  preencha em *Configurações → Endereço* e marque “Endereço confirmado”. Só então o endereço, o mapa e o botão
  “Como chegar” aparecem.
- **Entrega:** vem desligada; só “Retirada” aparece no pedido. Ligue em *Configurações* se o estabelecimento
  entrega, e cadastre a taxa se ela for fixa.
- **Redes sociais:** cadastre os links de Instagram/Facebook. Os ícones só aparecem depois disso.
- **Fotos:** os produtos usam ilustrações provisórias, marcadas no site como “Imagem ilustrativa”. Envie as
  fotos reais em *Produtos → Editar → Foto*.
- **Espetinhos especiais:** o tipo de carne não foi informado. Complete a descrição em *Produtos*.
- **Horário:** cadastrado como referência (segunda a sábado, 17h à meia-noite; domingo fechado). Confirme.

## Segurança

- O painel é protegido em três camadas: o `proxy.ts` redireciona quem não está logado; cada página e cada ação
  do servidor confere no Supabase se o usuário é administrador; e o banco confere de novo pela RLS.
- O público só **lê** categorias e produtos ativos e as configurações. Nenhuma tabela aceita gravação de
  visitantes ou de usuários que não estejam na tabela `admins`, e ninguém se promove a admin pela API.
- Uploads: somente administradores; JPG, PNG, WebP ou AVIF de até 5 MB (validado no servidor e no bucket).
- Restrições no banco (preço não negativo, WhatsApp só com dígitos, slugs válidos…) valem mesmo para admins.

## Testes

```bash
pnpm test            # lógica (carrinho, mensagem, horários) + banco (migrations, cardápio e RLS em PGlite)
pnpm typecheck
pnpm build

# Ponta a ponta no navegador (com o site rodando):
BASE_URL=http://localhost:3000 pnpm test:e2e
```

Com o Supabase local e usuários de teste, o mesmo comando também testa o painel e a segurança da API
(variáveis no início de `tests/e2e/run.mjs`). **Esse teste altera dados e depois desfaz; nunca rode contra produção.**

## Manutenção

- **Cardápio inicial:** `lib/menu/seed-data.ts` gera a migration `20261029000200_seed_cardapio.sql` e o arquivo
  único `supabase/aplicar_no_sql_editor.sql` (`pnpm seed:sql`). Depois que o banco está no ar, os preços
  mudam **pelo painel**, não pelo código.
- **Ilustrações provisórias:** `node scripts/generate-illustrations.mjs`.
- As páginas públicas ficam em cache e são atualizadas na hora quando o painel salva algo (e a cada 5 minutos).
