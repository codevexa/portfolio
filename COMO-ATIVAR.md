# Como ligar as novidades

Duas coisas precisam da sua mão — nenhuma delas é código.

## 1. Criar as tabelas novas no Supabase (2 minutos)

1. Abra o Supabase do projeto → menu **SQL Editor** → **New query**.
2. Copie **todo** o conteúdo do arquivo `supabase/02-categorias-e-textos.sql`
   deste projeto e cole lá.
3. Clique em **Run**.

Pode rodar de novo sem medo: o arquivo é todo `if not exists` / `on conflict`,
então não duplica nem apaga nada.

O que ele cria:

| Tabela        | Para quê                                                        |
| ------------- | --------------------------------------------------------------- |
| `categories`  | As categorias que você vende (nome, cor do card, ordem, no ar)   |
| `site_texts`  | Todo texto fixo que o cliente lê                                 |
| `faqs`        | As perguntas frequentes                                          |
| `depoimentos` | Os relatos da faixa "Feedback"                                   |
| `garantias`   | A faixa de selos ("PIX ou cartão", "Envio rápido"…)              |

Segurança: o site só **lê** essas tabelas; escrever exige estar logado como
admin (as políticas usam a mesma `public.is_admin()` que já protege produtos,
times e banners).

**Antes de rodar o SQL o site continua no ar normalmente** — ele usa os textos
e as categorias originais, que estão no código. As telas novas do painel ficam
só para leitura e mostram um aviso amarelo explicando isso.

## 2. Publicar na Vercel

A publicação está travada nesta sessão: a Vercel responde
`403 — You don't have permission to create a Production Deployment for this
project`, e o projeto `resenha-fc-mantos` não aparece mais na conta que esta
sessão alcança (`vercel list_projects` só devolve `v0-sistema-de-entregas-ossala`).

Para destravar, reconecte/autorize a Vercel para esta sessão em
**claude.ai → Configurações → Conectores**, com acesso ao projeto
`resenha-fc-mantos`. Aí eu publico na hora.

---

## O que mudou no painel

- **Categorias** (menu novo): criar, renomear, reordenar, trocar as cores do
  card da home, tirar do ar e escolher quais aparecem em "Compre por Categoria".
  Excluir uma categoria que tem produtos só a desativa — nenhum produto fica
  órfão.
- **Textos** (menu novo), com 4 abas:
  - *Textos do site* — tudo que o cliente lê, em blocos (topo, home, produto,
    carrinho, listas, rodapé, sobre, página 404). Cada bloco salva sozinho.
    Campo vazio volta ao texto original. Use `{loja}` e `{pagamentos}` para
    puxar o nome da loja e as formas de pagamento das Configurações.
  - *Perguntas frequentes*
  - *Depoimentos*
  - *Garantias* (com escolha de ícone)
- **Carrinho** na loja: botão "Adicionar ao carrinho" na página do produto,
  selo com a contagem no topo, página `/carrinho` com quantidades, subtotal e
  "Fechar pedido no WhatsApp" já com todos os itens e o total escritos.


---

# Pagamento online com a InfinitePay

Conta recebedora: **Charles Tavares**, InfiniteTag **$resenhafc** (conta
lojista CPF). Já conferi que ela existe e está com o checkout integrado
habilitado — o `/payment_check` respondeu HTTP 200 para esse handle.

O código está pronto. Faltam **três coisas que só você pode fazer**.

## 1. Rodar o SQL dos pedidos

Supabase → SQL Editor → cole `supabase/03-pedidos-e-pagamentos.sql` → Run.

Cria `orders`, `order_items`, `payments`, `payment_events`, a função
`confirmar_pagamento()`, os índices, as políticas de RLS e a coluna de
frete em `settings`.

## 2. Criar a API Key da InfinitePay

Conta Web ou App → Configurações do Checkout → criar uma API Key.
Ela começa com `inchk_` e **aparece uma vez só**.

A chave que você já tinha compartilhado antes **não deve ser reutilizada**:
uma chave que circulou fora do cofre tem de ser considerada queimada.
Crie uma nova e, se quiser, exclua a antiga (excluir não tem volta e
derruba qualquer integração que a use).

## 3. Cadastrar as duas variáveis secretas na Vercel

Vercel → Settings → Environment Variables → Production:

| Variável | Onde pegar |
| --- | --- |
| `INFINITEPAY_API_KEY` | a chave `inchk_` do passo 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |

Nunca cole essas duas no chat nem em arquivo do projeto.

Estas já foram cadastradas por mim, por não serem segredo:
`INFINITEPAY_HANDLE`, `NEXT_PUBLIC_APP_URL`, `SUPABASE_URL`.

## Como fica o fluxo

1. Carrinho → **Ir para o pagamento** → `/checkout`
2. O cliente preenche nome, e-mail e WhatsApp e confirma
3. O servidor remonta o pedido **lendo o preço do banco**, grava em
   `orders` e pede o link à InfinitePay
4. O cliente paga na página da InfinitePay (PIX ou cartão)
5. Volta para `/pedido/<id>` no seu site
6. O webhook `/api/webhooks/infinitepay` recebe o aviso, **confere no
   `/payment_check`** e só então aprova o pedido e baixa o estoque

## O que está protegido

- Nenhum preço vindo do navegador é usado. O total sai sempre do banco.
- O aviso do webhook não aprova nada sozinho: a InfinitePay não assina os
  webhooks, então cada aviso é reconferido na API oficial.
- Aviso repetido não processa duas vezes (índice único em
  `payment_events.event_key` e em `payments.transaction_nsu`).
- Se o valor cobrado não bater com o do pedido, a função do banco recusa.
- Nenhum dado de cartão passa ou fica no site.
- `orders`, `payments` e os demais não são legíveis por anônimo: a RLS não
  dá nenhuma política para `anon`.

## Frete

Configurável em **/admin/config → Frete (R$)**. Começa em 0 (grátis).
Ele entra no total antes do pagamento — sem isso não dá para cobrar online.

---

# Descontos e cupons

## Desconto geral da loja

**/admin/config → Desconto geral da loja (%)**

Um número só, que vale para o catálogo inteiro. Com 10, uma camisa de
R$ 159,90 aparece como R$ 159,90 riscado e **R$ 143,91**, com selo −10%.
Deixe 0 para desligar.

O desconto por produto (o antigo campo "preço de") não existe mais: o SQL
`06-descontos-e-cupons.sql` apagou todos e o desconto passou a ser um só.

O preço que você cadastra continua sendo o cheio — o painel mostra ele, a
loja mostra o já descontado.

## Cupons

**/admin/cupons**

| Campo | Para quê |
| --- | --- |
| Código | o que o cliente digita, ex.: `RESENHA10` |
| Tipo | porcentagem (%) ou valor fixo (R$) |
| Pedido mínimo | abaixo disso o cupom não vale |
| Limite de usos | vazio = sem limite |
| Vale até | vazio = não vence |
| Valendo | desmarque para suspender sem apagar |

O cliente digita no checkout, no resumo da direita. O desconto entra
sobre o valor dos produtos, **depois** do desconto geral.

Exemplo: camisa R$ 159,90 → R$ 143,91 com os 10% → cupom de 10% →
R$ 129,52 + frete.

## O que está protegido

- Preço, desconto geral e valor do cupom saem sempre do banco. O checkout
  manda apenas o código digitado.
- O cupom é conferido e contado dentro de uma função do banco, com a linha
  travada: dois pedidos ao mesmo tempo não furam o limite de usos.
- Cupom inexistente, vencido, suspenso, esgotado ou abaixo do mínimo é
  recusado com a explicação certa, e o pedido não é aberto.
