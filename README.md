# VEXA — Digital Experience Studio

Site institucional e portfólio da **VEXA**, estúdio independente de criação e
desenvolvimento digital fundado por **Juan Oliveira**.

> Ideias que viram interface.

---

## Stack

| Camada       | Tecnologia                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)  |
| Linguagem    | TypeScript (modo estrito)           |
| Estilo       | Tailwind CSS v4                     |
| Animação     | Framer Motion                       |
| Ícones       | Lucide                              |
| Tipografia   | Space Grotesk · Inter · JetBrains Mono |
| Hospedagem   | Vercel                              |

---

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos:

```bash
npm run build      # build de produção
npm start          # servidor de produção
npm run typecheck  # checagem de tipos
```

---

## Estrutura

```
app/                     Rotas (App Router)
  page.tsx               Home
  projetos/              Lista de projetos
  projetos/[slug]/       Página individual de cada case
  servicos/              Serviços
  sobre/                 Sobre a VEXA e o fundador
  contato/               Contato e solicitação de projeto
  sitemap.ts             Sitemap automático
  robots.ts              robots.txt
  manifest.ts            Web app manifest
  globals.css            Design system (tokens + utilitários)

components/
  brand/                 Logotipo, monograma e animação de entrada
  layout/                Cabeçalho, rodapé, cursor, cabeçalho de página
  motion/                Revelação na rolagem e revelação por linha
  ui/                    Botões, rótulos, marquee, lista de serviços
  home/                  Seções da página inicial
  projects/              Mockups de celular e de navegador
  contact/               Formulário de briefing

content/                 ⬅ TODO O TEXTO DO SITE MORA AQUI
lib/                     Utilitários (links de WhatsApp, classes)
public/images/           Fotografias, monograma e telas dos projetos
```

---

## Onde editar o conteúdo

Você não precisa mexer em componente nenhum para atualizar o site.
Todo o texto está em `content/`:

| Arquivo               | O que controla                                               |
| --------------------- | ------------------------------------------------------------ |
| `content/site.ts`     | Domínio, WhatsApp, Instagrams, menu, slogan, descrição        |
| `content/projects.ts` | Os três cases: textos, funcionalidades, galeria, paleta       |
| `content/services.ts` | Os nove serviços e as etapas do processo                      |
| `content/founder.ts`  | Textos sobre a VEXA e sobre Juan Oliveira                     |

### ⚠️ Antes de publicar

Em `content/site.ts`, troque `url` pelo domínio final:

```ts
url: "https://vexa.studio",   // ← ajuste aqui
```

Esse valor alimenta canonical, Open Graph, sitemap e robots.

---

## Campos deixados em aberto, de propósito

Este site **não afirma nada que não foi confirmado**. Não há formação
acadêmica, certificações, anos de experiência, nomes de clientes nem métricas
de resultado inventados em lugar nenhum.

Os pontos abaixo estão prontos para receber informação quando você quiser:

**`content/founder.ts` → `biography.paragraphs`**
Está vazio. Enquanto estiver vazio, a seção "A história" simplesmente não
aparece no site. Basta adicionar parágrafos no array para ela surgir em
`/sobre`.

**`content/projects.ts` → `pending`**
Cada projeto tem uma lista de perguntas em aberto. Elas **não aparecem no
site** — são notas para você. Hoje estão assim:

- **Refúgio** — status (em testes ou aberto), plataformas, stack
- **Jotah 26** — o que o painel `/admin` mostra; se há montagem de times
- **Resenha FC Mantos** — meio de pagamento, gestão de estoque e envio

Me passe qualquer um desses e eu transformo em conteúdo no case.

### De onde veio o conteúdo dos projetos

Tudo que está descrito como funcionalidade foi observado navegando nos
projetos no ar. Nada foi suposto.

| Projeto            | Endereço                                |
| ------------------ | --------------------------------------- |
| Refúgio            | `refugio-seven-phi.vercel.app`          |
| Jotah 26           | `jotah-26.vercel.app`                   |
| Resenha FC Mantos  | `resenha-fc-mantos.vercel.app`          |

As telas em `public/images/projetos/` são capturas desses endereços a 390×844
com densidade 3×, mais duas telas internas do app enviadas por você (as que
exigem login).

---

## Fotografias

As imagens do fundador e os retratos editoriais estão em `public/images/`,
convertidos para WebP sem qualquer alteração de aparência — nenhum retoque,
nenhuma edição de rosto.

| Arquivo                | Uso                                       |
| ---------------------- | ----------------------------------------- |
| `portrait-wide.webp`   | Fundo do hero (desktop) e faixa em /sobre |
| `portrait-tall.webp`   | Fundo do hero (mobile)                    |
| `founder-01.webp`      | Destaque do fundador na home e em /sobre  |
| `founder-02.webp`      | Faixa fotográfica em /sobre               |
| `vexa-mark-white.png`  | Monograma VX (versão para fundo escuro)   |
| `vexa-mark-dark.png`   | Monograma VX (versão para fundo claro)    |
| `og.jpg`               | Imagem de compartilhamento (1200×630)     |

Para trocar uma foto, substitua o arquivo mantendo o mesmo nome.

### Telas dos projetos

Em `public/images/projetos/`. Para acrescentar novas telas a um case, salve o
arquivo nessa pasta e adicione uma entrada no array `gallery` do projeto em
`content/projects.ts`:

```ts
{
  src: "/images/projetos/minha-tela.webp",
  alt: "Descrição do que aparece na tela.",
  frame: "phone",        // "phone" ou "browser"
  caption: "Legenda opcional.",
}
```

---

## Design system

Os tokens vivem em `app/globals.css`, dentro de `@theme`:

| Token              | Valor     | Uso                       |
| ------------------ | --------- | ------------------------- |
| `--color-ink`      | `#07070a` | Preto profundo, fundo     |
| `--color-surface`  | `#0b0c0f` | Superfície elevada        |
| `--color-graphite` | `#121419` | Grafite                   |
| `--color-line`     | `#1e2127` | Fios de 1px               |
| `--color-bone`     | `#f4f5f3` | Texto principal           |
| `--color-muted`    | `#8a8f98` | Texto secundário          |
| `--color-dim`      | `#787d88` | Texto terciário           |
| `--color-lime`     | `#c9ff3c` | Verde-limão neon, destaque|

Todas as cores de texto passam no contraste mínimo WCAG AA sobre o preto:
`bone` 18,4:1 · `lime` 17,1:1 · `muted` 6,2:1 · `dim` 4,9:1.

---

## Acessibilidade e performance

- Navegação completa por teclado, com link "pular para o conteúdo"
- Foco visível em verde-limão sobre preto
- Todas as animações desligam com `prefers-reduced-motion`
- Cursor personalizado só em dispositivos com mouse de precisão
- Menu mobile com `aria-expanded`, `aria-controls` e fechamento por `Esc`
- Acordeão de serviços com painéis associados por `aria-controls`
- Imagens servidas em AVIF/WebP pelo `next/image`
- Todas as páginas geradas estaticamente

---

## SEO

Já configurado: metadados por página, Open Graph e Twitter Card com imagem,
canonical, `sitemap.xml`, `robots.txt`, favicon, ícone para iOS, web manifest e
dados estruturados JSON-LD (`ProfessionalService` no site e `Person` em
`/sobre`).

---

## Segurança

Cabeçalhos definidos em `next.config.mjs`: `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` e
`Strict-Transport-Security`. O HTTPS é fornecido pela hospedagem.

---

## Formulário de contato

Este site **não tem backend** e **não armazena dados**. O formulário de
`/contato` monta a solicitação como mensagem e abre a conversa no WhatsApp
do estúdio — nada é enviado para servidor nenhum. Isso está dito ao usuário na
própria página.

Se um dia você quiser receber as solicitações por e-mail ou guardá-las em
banco, o ponto de alteração é `lib/whatsapp.ts` junto com
`components/contact/ProjectBriefForm.tsx`.

---

## Publicação na Vercel

O projeto é um app Next.js padrão, sem variáveis de ambiente obrigatórias.

1. Importe o repositório na Vercel
2. Framework: **Next.js** (detectado automaticamente)
3. Build: `npm run build` · Output: padrão
4. Deploy

Depois de apontar o domínio, atualize `url` em `content/site.ts` e publique de
novo para que canonical, sitemap e Open Graph apontem para o endereço certo.

---

© VEXA — Todos os direitos reservados.
**VEXA by Juan Oliveira**
