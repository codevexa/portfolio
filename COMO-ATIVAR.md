# Como ligar as novidades (carrinho, categorias e textos)

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
