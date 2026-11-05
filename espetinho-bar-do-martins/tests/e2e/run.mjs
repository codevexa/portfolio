/**
 * Teste ponta a ponta no navegador (Playwright).
 *
 * Uso:
 *   BASE_URL=http://localhost:3000 node tests/e2e/run.mjs
 * Com o Supabase local (supabase start) e usuários de teste, também testa o painel:
 *   E2E_ADMIN_EMAIL=... E2E_ADMIN_PASSWORD=... E2E_USER_EMAIL=... E2E_USER_PASSWORD=... \
 *   SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_ANON_KEY=... node tests/e2e/run.mjs
 *
 * O teste do painel altera dados e desfaz as alterações no final. Não rode contra o banco de produção.
 */
import assert from "node:assert/strict"
import { mkdirSync } from "node:fs"
import { createRequire } from "node:module"
import { join } from "node:path"

const require = createRequire(import.meta.url)
const { chromium } = require("playwright")

const BASE = process.env.BASE_URL ?? "http://localhost:3000"
const SHOTS = join(process.cwd(), "tests", "e2e", "screenshots")
mkdirSync(SHOTS, { recursive: true })

const results = []
async function step(name, fn) {
  try {
    await fn()
    results.push(["ok", name])
    console.log(`  ✓ ${name}`)
  } catch (error) {
    results.push(["falhou", name, error])
    console.log(`  ✗ ${name}\n    ${String(error?.message ?? error).split("\n").slice(0, 6).join("\n    ")}`)
  }
}

const browser = await chromium.launch()
const pageErrors = []

async function newPage(viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport, locale: "pt-BR" })
  const page = await context.newPage()
  page.on("pageerror", (e) => pageErrors.push(`${page.url()}: ${e.message}`))
  // Captura a URL que seria aberta no WhatsApp sem sair do site.
  await page.addInitScript(() => {
    window.__opened = []
    window.open = (url) => {
      window.__opened.push(String(url))
      return { opener: null }
    }
  })
  return page
}

// Espera a página ficar interativa (React hidratado) antes de clicar.
async function go(p, path) {
  const res = await p.goto(BASE + path, { waitUntil: "load" })
  await p.waitForTimeout(400)
  return res
}

const brl = (s) => s.replace(/ /g, " ")

console.log(`\nSite público — ${BASE}`)
const page = await newPage()

await step("início: título, chamadas e botões", async () => {
  await go(page, "/")
  assert.match(await page.title(), /Espetinho Bar do Martins/)
  await page.getByRole("heading", { level: 1, name: /O sabor da brasa que conquista!/ }).waitFor()
  await page.getByText("Espetinhos, carnes e cachurrascos preparados para deixar tua fome com vontade de mais.").waitFor()
  const wa = await page.locator('a[href^="https://wa.me/5551994261019"]').count()
  assert.ok(wa >= 2, "links de WhatsApp com o número oficial")
  await page.getByRole("link", { name: /Ver cardápio/ }).first().click()
  await page.waitForURL("**/cardapio")
  await page.goBack()
  await page.getByRole("link", { name: /Fazer meu pedido/ }).click()
  await page.waitForURL("**/cardapio")
  await page.screenshot({ path: join(SHOTS, "cardapio-mobile.png"), fullPage: false })
})

await step("dados estruturados de restaurante sem avaliações inventadas", async () => {
  await go(page, "/")
  const json = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent())
  assert.equal(json["@type"], "Restaurant")
  assert.equal(json.telephone, "+5551994261019")
  assert.equal(json.address.addressLocality, "Porto Alegre")
  assert.equal(json.aggregateRating, undefined)
  assert.equal(json.review, undefined)
})

await step("cardápio: filtro por categoria e busca", async () => {
  await go(page, "/cardapio")
  await page.getByRole("button", { name: "Cachurrascos", exact: true }).click()
  await page.waitForURL(/categoria=cachurrascos/)
  const titles = await page.locator("article h3").allTextContents()
  assert.deepEqual(titles.map((t) => t.trim()).sort(), ["Cachurrasco 30 cm", "Cachurrasco de contrafilé com geleia de pimenta"].sort())
  await page.getByRole("button", { name: "Todos", exact: true }).click()
  await page.getByLabel("Buscar no cardápio").fill("coalho")
  const found = await page.locator("article h3").allTextContents()
  assert.deepEqual(found.map((t) => t.trim()), ["Espetinho de Coalho"])
  await page.getByLabel("Buscar no cardápio").fill("nao-existe-xyz")
  await page.getByText("Nada encontrado").waitFor()
})

await step("variações do cachurrasco refletem o preço correto", async () => {
  await go(page, "/cardapio/cachurrasco-30-cm")
  await page.getByText("Todos os cachurrascos são recheados com tomate, alface, batata palha e maionese verde da casa.").first().waitFor()
  const purchase = page.locator("article").first()
  const expected = {
    "Pão Tradicional": { "1 espetinho": "R$ 26,90", "2 espetinhos": "R$ 39,90", "3 espetinhos": "R$ 55,90" },
    "Pão Parmesão": { "1 espetinho": "R$ 29,90", "2 espetinhos": "R$ 41,90", "3 espetinhos": "R$ 57,90" },
  }
  for (const [bread, sizes] of Object.entries(expected)) {
    await purchase.getByRole("radio", { name: bread }).click()
    for (const [size, price] of Object.entries(sizes)) {
      await purchase.getByRole("radio", { name: new RegExp(`^${size}`) }).click()
      const label = brl(await purchase.getByRole("button", { name: /Adicionar ao pedido/ }).textContent())
      assert.ok(label.includes(price), `${bread} ${size}: esperado ${price}, botão mostra "${label}"`)
    }
  }
})

await step("adiciona itens com variação, quantidade e observação", async () => {
  const purchase = page.locator("article").first()
  await purchase.getByRole("radio", { name: "Pão Parmesão" }).click()
  await purchase.getByRole("radio", { name: /^3 espetinhos/ }).click()
  await purchase.getByRole("button", { name: "Adicionar observação" }).click()
  await purchase.getByLabel(/Observação para a cozinha/).fill("sem tomate")
  await purchase.getByRole("button", { name: /Adicionar ao pedido/ }).click()
  await page.getByRole("status").filter({ hasText: "adicionado ao pedido" }).waitFor()

  await go(page, "/cardapio/espetinho-de-gado")
  // O primeiro <article> é o produto; os cards de "relacionados" vêm depois.
  const box = page.locator("article").first()
  await box.getByRole("button", { name: "Aumentar quantidade" }).click()
  await box.getByRole("button", { name: /Adicionar ao pedido · R\$ 31,80/ }).click()
  // Barra inferior do carrinho no celular
  const bar = page.getByRole("link", { name: /Ver pedido · 3 itens/ })
  await bar.waitFor()
  assert.ok(brl(await bar.textContent()).includes("R$ 89,70"))
})

await step("carrinho: subtotal, quantidade, observação e remoção", async () => {
  await go(page, "/carrinho")
  const summary = page.getByRole("complementary", { name: "Resumo do pedido" })
  assert.ok(brl(await summary.textContent()).includes("R$ 89,70"))
  await page.getByText("Obs.: sem tomate").waitFor()
  await page.getByText("Pão Parmesão 30 cm · 3 espetinhos").waitFor()
  await page.getByRole("group", { name: "Quantidade de Espetinho de Gado" }).getByRole("button", { name: "Aumentar quantidade" }).click()
  assert.ok(brl(await summary.textContent()).includes("R$ 105,60"), "57,90 + 3 × 15,90")
  await page.getByRole("group", { name: "Quantidade de Espetinho de Gado" }).getByRole("button", { name: "Diminuir quantidade" }).click()
  // adiciona e remove um item extra
  await go(page, "/cardapio/pao-de-alho")
  await page.locator("article").first().getByRole("button", { name: /Adicionar ao pedido/ }).click()
  await go(page, "/carrinho")
  await page.getByRole("button", { name: "Remover Pão de Alho" }).click()
  assert.ok(brl(await summary.textContent()).includes("R$ 89,70"))
  await page.screenshot({ path: join(SHOTS, "carrinho-mobile.png"), fullPage: true })
})

await step("finalização: valida campos e monta a mensagem do WhatsApp", async () => {
  await page.getByRole("link", { name: "Finalizar pedido" }).click()
  await page.waitForURL("**/finalizar")
  await page.getByRole("button", { name: /Finalizar pedido pelo WhatsApp/ }).click()
  await page.getByText("Informe seu nome.").waitFor()
  await page.getByText(/Informe um telefone com DDD/).waitFor()
  let opened = await page.evaluate(() => window.__opened)
  assert.equal(opened.length, 0, "não abre o WhatsApp com dados inválidos")

  await page.getByLabel("Nome").fill("Cliente Teste")
  await page.getByLabel("Telefone / WhatsApp").fill("51 98888-7777")
  const options = await page.getByRole("radio").allTextContents()
  if (options.some((o) => o.includes("Entrega"))) {
    await page.getByRole("radio", { name: /Entrega/ }).click()
    await page.getByLabel("Endereço de entrega").fill("Rua Exemplo, 100 — Bairro Teste")
  } else {
    await page.getByRole("radio", { name: /Retirada/ }).click()
  }
  await page.getByLabel(/Observações gerais/).fill("Pagamento no local")
  await page.screenshot({ path: join(SHOTS, "finalizar-mobile.png"), fullPage: true })
  await page.getByRole("button", { name: /Finalizar pedido pelo WhatsApp/ }).click()
  await page.getByRole("heading", { name: "Mensagem pronta no WhatsApp" }).waitFor()
  await page.getByText("Seu pedido ainda não foi enviado.").waitFor()
  opened = await page.evaluate(() => window.__opened)
  assert.equal(opened.length, 1)
  const url = new URL(opened[0])
  assert.equal(url.origin + url.pathname, "https://wa.me/5551994261019")
  const msg = url.searchParams.get("text")
  for (const line of [
    "*PEDIDO — ESPETINHO BAR DO MARTINS*",
    "Nome do cliente: Cliente Teste",
    "Telefone: (51) 98888-7777",
    "• 1 × Cachurrasco 30 cm",
    "Variação: Pão Parmesão 30 cm · 3 espetinhos",
    "Observações: sem tomate",
    "Preço unitário: R$ 57,90",
    "• 2 × Espetinho de Gado",
    "Subtotal: R$ 31,80",
    "Subtotal: R$ 89,70",
    "Observações gerais: Pagamento no local",
  ]) {
    assert.ok(brl(msg).includes(line), `mensagem deveria conter "${line}"\n---\n${msg}`)
  }
  console.log("\n    Mensagem gerada:\n    " + msg.split("\n").join("\n    ") + "\n")
  await page.getByRole("button", { name: "Já enviei, esvaziar carrinho" }).click()
  await page.getByText("Seu pedido está vazio").waitFor()
})

await step("produto inexistente mostra página amigável", async () => {
  const res = await go(page, "/cardapio/produto-que-nao-existe")
  assert.equal(res.status(), 404)
  await page.getByRole("heading", { name: "Produto indisponível ou não encontrado" }).waitFor()
  const res2 = await go(page, "/pagina-inexistente")
  assert.equal(res2.status(), 404)
  await page.getByRole("heading", { name: "Página não encontrada" }).waitFor()
})

await step("SEO: sitemap, robots e metadados de compartilhamento", async () => {
  const sitemap = await (await fetch(BASE + "/sitemap.xml")).text()
  assert.ok(sitemap.includes("/cardapio/cachurrasco-30-cm"))
  const robots = await (await fetch(BASE + "/robots.txt")).text()
  assert.ok(robots.includes("Disallow: /admin"))
  await go(page, "/")
  assert.ok(await page.locator('meta[property="og:image"]').count())
  assert.equal(await page.locator('meta[property="og:locale"]').getAttribute("content"), "pt_BR")
  const og = await fetch(BASE + "/opengraph-image")
  assert.equal(og.headers.get("content-type"), "image/png")
})

await step("sem rolagem horizontal no celular", async () => {
  for (const path of ["/", "/cardapio", "/cardapio/cachurrasco-30-cm", "/contato", "/carrinho"]) {
    await go(page, path)
    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    assert.ok(sw <= 390, `${path} tem ${sw}px de largura`)
  }
})

await step("área administrativa exige login", async () => {
  const p = await newPage()
  await go(p, "/admin/produtos")
  const url = p.url()
  const isLogin = url.endsWith("/admin/login")
  const notConfigured = await p.getByText("Painel ainda não conectado").count()
  assert.ok(isLogin || notConfigured, `esperado login ou aviso de configuração, veio ${url}`)
  await p.context().close()
})

/* ---------------------------------------------------------------- Painel */
const { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_USER_EMAIL, E2E_USER_PASSWORD, SUPABASE_URL, SUPABASE_ANON_KEY } = process.env

if (E2E_ADMIN_EMAIL && E2E_ADMIN_PASSWORD) {
  console.log("\nPainel administrativo")
  const admin = await newPage({ width: 390, height: 844 })

  const login = async (p, email, password) => {
    await go(p, "/admin/login")
    await p.getByLabel("E-mail").fill(email)
    await p.getByLabel("Senha").fill(password)
    await p.getByRole("button", { name: "Entrar" }).click()
  }

  if (E2E_USER_EMAIL) {
    await step("usuário que não é administrador não entra no painel", async () => {
      const p = await newPage()
      await login(p, E2E_USER_EMAIL, E2E_USER_PASSWORD)
      await p.getByText("Este usuário não tem acesso ao painel.").waitFor()
      await go(p, "/admin")
      await p.waitForURL("**/admin/login")
      await p.context().close()
    })
  }

  await step("senha errada mostra erro e mantém o e-mail digitado", async () => {
    await login(admin, E2E_ADMIN_EMAIL, "senha-errada")
    await admin.getByText("E-mail ou senha incorretos.").waitFor()
    assert.equal(await admin.getByLabel("E-mail").inputValue(), E2E_ADMIN_EMAIL)
  })

  await step("admin entra e vê pendências reais", async () => {
    await login(admin, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD)
    await admin.waitForURL(/\/admin$/)
    await admin.getByRole("heading", { name: "Visão geral" }).waitFor()
    await admin.getByText(/Confirme o endereço/).waitFor()
    await admin.screenshot({ path: join(SHOTS, "admin-inicio-mobile.png"), fullPage: true })
  })

  const editProduct = async (name) => {
    await go(admin, "/admin/produtos")
    await admin.locator("li", { has: admin.getByRole("heading", { name, exact: true }) }).getByRole("link", { name: "Editar" }).click()
    await admin.getByRole("heading", { name: "Editar produto" }).waitFor()
  }

  await step("altera preço pelo painel e o site público atualiza", async () => {
    await editProduct("Espetinho de Gado")
    await admin.getByLabel("Preço (R$)").fill("16,90")
    await admin.getByRole("button", { name: "Salvar produto" }).click()
    await admin.getByText("Produto salvo.").waitFor()
    const pub = await (await fetch(BASE + "/cardapio/espetinho-de-gado")).text()
    assert.ok(brl(pub).includes("R$ 16,90"), "preço novo no site público")
    await admin.getByLabel("Preço (R$)").fill("15,90")
    await admin.getByRole("button", { name: "Salvar produto" }).click()
    await admin.getByText("Produto salvo.").waitFor()
    const back = await (await fetch(BASE + "/cardapio/espetinho-de-gado")).text()
    assert.ok(brl(back).includes("R$ 15,90"))
  })

  await step("validação no servidor: preço inválido não é salvo e o texto digitado permanece", async () => {
    await editProduct("Espetinho de Coalho")
    await admin.getByLabel("Preço (R$)").fill("doze")
    await admin.getByRole("button", { name: "Salvar produto" }).click()
    await admin.getByText("Confira os campos destacados.").waitFor()
    await admin.getByText("Preço inválido. Use o formato 15,90.").waitFor()
    assert.equal(await admin.getByLabel("Preço (R$)").inputValue(), "doze")
  })

  await step("marca produto como indisponível e volta", async () => {
    await go(admin, "/admin/produtos")
    const row = admin.locator("li", { has: admin.getByRole("heading", { name: "Espetinho de Coalho", exact: true }) })
    await row.getByText("Disponível", { exact: true }).click()
    await admin.waitForTimeout(800)
    let html = await (await fetch(BASE + "/cardapio/espetinho-de-coalho")).text()
    assert.ok(html.includes("Indisponível no momento"))
    await row.getByText("Disponível", { exact: true }).click()
    await admin.waitForTimeout(800)
    html = await (await fetch(BASE + "/cardapio/espetinho-de-coalho")).text()
    assert.ok(!html.includes("Indisponível no momento"))
  })

  await step("envia foto do produto para o Storage", async () => {
    const shot = await browser.newPage({ viewport: { width: 400, height: 300 } })
    await shot.setContent('<div style="width:400px;height:300px;background:linear-gradient(#8a3b20,#3f170a)"></div>')
    const png = await shot.screenshot({ type: "png" })
    await shot.close()
    await editProduct("Medalhão de picanha")
    await admin.locator('input[name="image"]').setInputFiles({ name: "picanha.png", mimeType: "image/png", buffer: png })
    await admin.getByLabel(/Descrição da foto/).fill("Medalhões de picanha")
    await admin.getByRole("button", { name: "Salvar produto" }).click()
    await admin.getByText("Produto salvo.").waitFor()
    const html = await (await fetch(BASE + "/cardapio/medalhao-de-picanha")).text()
    const m = html.match(/storage\/v1\/object\/public\/menu-images\/(produtos\/[a-f0-9-]+\.png)/)
    assert.ok(m, "imagem do Storage na página pública")
    const img = await fetch(`${SUPABASE_URL ?? "http://127.0.0.1:54321"}/storage/v1/object/public/menu-images/${m[1]}`)
    assert.equal(img.status, 200)
    // Rejeita arquivo que não é imagem
    await admin.locator('input[name="image"]').setInputFiles({ name: "x.txt", mimeType: "text/plain", buffer: Buffer.from("oi") })
    await admin.getByRole("button", { name: "Salvar produto" }).click()
    await admin.getByText(/Formato de imagem não aceito/).first().waitFor()
  })

  await step("configurações: ativa entrega com taxa e o checkout calcula", async () => {
    await go(admin, "/admin/configuracoes")
    await admin.getByText("Entrega", { exact: true }).click()
    await admin.getByLabel("Taxa de entrega (R$)").fill("7,00")
    await admin.getByLabel("Texto do aviso (faixa no topo do site)").fill("Aviso de teste automatizado")
    await admin.getByText("Mostrar aviso no site").click()
    await admin.getByRole("button", { name: "Salvar configurações" }).click()
    await admin.getByText("Configurações salvas.").waitFor()

    const p = await newPage()
    await go(p, "/cardapio/pao-de-alho")
    await p.getByText("Aviso de teste automatizado").waitFor()
    await p.locator("article").first().getByRole("button", { name: /Adicionar ao pedido/ }).click()
    await go(p, "/finalizar")
    await p.getByRole("radio", { name: /Entrega/ }).click()
    await p.getByText("Taxa de entrega: R$ 7,00").first().waitFor()
    const summary = brl(await p.getByRole("complementary", { name: "Resumo do pedido" }).textContent())
    assert.ok(summary.includes("R$ 14,00"), "7,00 + 7,00")
    await p.context().close()

    // desfaz
    await go(admin, "/admin/configuracoes")
    await admin.getByText("Entrega", { exact: true }).click()
    await admin.getByLabel("Taxa de entrega (R$)").fill("")
    await admin.getByText("Mostrar aviso no site").click()
    await admin.getByLabel("Texto do aviso (faixa no topo do site)").fill("")
    await admin.getByRole("button", { name: "Salvar configurações" }).click()
    await admin.getByText("Configurações salvas.").waitFor()
  })

  await step("cria categoria e produto com variações, depois exclui", async () => {
    await go(admin, "/admin/categorias")
    const form = admin.locator("section", { has: admin.getByRole("heading", { name: "Nova categoria" }) })
    await form.getByLabel("Nome").fill("Categoria Teste")
    await form.getByRole("button", { name: "Criar categoria" }).click()
    await form.getByText("Categoria criada.").waitFor()

    await go(admin, "/admin/produtos/novo")
    await admin.getByLabel("Nome", { exact: true }).fill("Produto Teste E2E")
    await admin.getByLabel("Categoria").selectOption({ label: "Categoria Teste" })
    await admin.getByLabel("Título da escolha").fill("Tamanho")
    await admin.getByLabel("Opção", { exact: true }).fill("Pequeno")
    await admin.getByLabel("Preço (R$)").fill("10,00")
    await admin.getByRole("button", { name: "Adicionar opção" }).click()
    await admin.getByLabel("Opção", { exact: true }).nth(1).fill("Grande")
    await admin.getByLabel("Preço (R$)").nth(1).fill("20,50")
    await admin.getByRole("button", { name: "Salvar produto" }).click()
    await admin.getByText("Produto criado.").waitFor()

    const p = await newPage()
    await go(p, "/cardapio/produto-teste-e2e")
    await p.getByRole("radio", { name: /Grande/ }).click()
    assert.ok(brl(await p.locator("article").first().getByRole("button", { name: /Adicionar ao pedido/ }).textContent()).includes("R$ 20,50"))
    await p.context().close()

    await go(admin, "/admin/produtos")
    const row = admin.locator("li", { has: admin.getByRole("heading", { name: "Produto Teste E2E" }) })
    await row.getByRole("button", { name: "Excluir" }).click()
    await row.getByRole("button", { name: "Sim, excluir" }).click()
    await row.waitFor({ state: "detached" })

    await go(admin, "/admin/categorias")
    const cat = admin.locator("li", { has: admin.getByRole("heading", { name: "Categoria Teste" }) })
    await cat.getByRole("button", { name: "Excluir" }).click()
    await cat.getByRole("button", { name: "Sim, excluir" }).click()
    await cat.waitFor({ state: "detached" })
    const res = await fetch(BASE + "/cardapio/produto-teste-e2e")
    assert.equal(res.status, 404)
  })

  await step("reordena produtos dentro da categoria", async () => {
    await go(admin, "/admin/produtos")
    const section = admin.locator("section", { has: admin.getByRole("heading", { name: /^Espetinhos$/ }) })
    const items = section.locator(":scope > ul > li")
    const before = await section.locator("h3").allTextContents()
    await items.nth(1).getByRole("button", { name: "Mover para cima" }).click()
    await admin.waitForTimeout(800)
    const after = await section.locator("h3").allTextContents()
    assert.deepEqual(after.slice(0, 2), [before[1], before[0]])
    await items.nth(1).getByRole("button", { name: "Mover para cima" }).click()
    await admin.waitForTimeout(800)
    assert.deepEqual((await section.locator("h3").allTextContents()).slice(0, 2), before.slice(0, 2))
  })

  await step("sair encerra a sessão", async () => {
    await admin.getByRole("button", { name: "Sair" }).click()
    await admin.waitForURL("**/admin/login")
    await go(admin, "/admin/configuracoes")
    await admin.waitForURL("**/admin/login")
  })

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    await step("API direta do banco: visitante e cliente não alteram preços", async () => {
      const rest = (path, init = {}, token = SUPABASE_ANON_KEY) =>
        fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
          ...init,
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "return=representation", ...init.headers },
        })
      const anon = await rest("product_variants?price_cents=eq.1590", { method: "PATCH", body: JSON.stringify({ price_cents: 1 }) })
      assert.ok(anon.status === 401 || anon.status === 403 || (await anon.json()).length === 0, `visitante: ${anon.status}`)

      const auth = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email: E2E_USER_EMAIL, password: E2E_USER_PASSWORD }),
      }).then((r) => r.json())
      const user = await rest("product_variants?price_cents=eq.1590", { method: "PATCH", body: JSON.stringify({ price_cents: 1 }) }, auth.access_token)
      assert.deepEqual(await user.json(), [], "cliente logado não altera nada")
      const promote = await rest("admins", { method: "POST", body: JSON.stringify({ user_id: auth.user.id }) }, auth.access_token)
      assert.ok(promote.status >= 400, "cliente não se promove a admin")
      const rpc = await rest("rpc/admin_save_product", { method: "POST", body: JSON.stringify({ p: {} }) }, auth.access_token)
      assert.ok(rpc.status >= 400, "cliente não usa a função de salvar produto")
      const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/menu-images/produtos/invasor.png`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${auth.access_token}`, "Content-Type": "image/png" },
        body: Buffer.from("x"),
      })
      assert.ok(upload.status >= 400, `cliente não envia imagens (status ${upload.status})`)
      const signup = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email: "novo@teste.local", password: "SenhaQualquer123" }),
      })
      assert.ok(signup.status >= 400, "cadastro público desativado")
    })
  }
  await admin.context().close()
}

await step("nenhum erro de JavaScript nas páginas", async () => {
  assert.deepEqual(pageErrors, [])
})

await browser.close()
const failed = results.filter((r) => r[0] !== "ok")
console.log(`\n${results.length - failed.length}/${results.length} verificações passaram.`)
process.exit(failed.length ? 1 : 0)
