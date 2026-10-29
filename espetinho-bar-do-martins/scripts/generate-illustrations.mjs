/**
 * Gera as ilustrações provisórias do cardápio em public/img/menu.
 * São desenhos, não fotos: substitua pelas fotos reais dos pratos pelo painel administrativo.
 * Uso: node scripts/generate-illustrations.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const OUT = join(process.cwd(), "public", "img", "menu")
mkdirSync(OUT, { recursive: true })

const W = 800
const H = 600

const defs = `
<defs>
  <radialGradient id="bg" cx="50%" cy="85%" r="90%">
    <stop offset="0" stop-color="#4a1d08"/>
    <stop offset="0.45" stop-color="#1c0d06"/>
    <stop offset="1" stop-color="#0a0604"/>
  </radialGradient>
  <radialGradient id="ember" cx="50%" cy="100%" r="60%">
    <stop offset="0" stop-color="#ff7a1a" stop-opacity="0.85"/>
    <stop offset="0.4" stop-color="#d9480f" stop-opacity="0.35"/>
    <stop offset="1" stop-color="#d9480f" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c79a63"/><stop offset="1" stop-color="#8a6136"/>
  </linearGradient>
  <linearGradient id="board" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7a4b26"/><stop offset="1" stop-color="#4e2d14"/>
  </linearGradient>
  <linearGradient id="beef" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9a4a26"/><stop offset="0.6" stop-color="#6e2c14"/><stop offset="1" stop-color="#3f170a"/>
  </linearGradient>
  <linearGradient id="chicken" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e9b36a"/><stop offset="0.6" stop-color="#c47f35"/><stop offset="1" stop-color="#8a521d"/>
  </linearGradient>
  <linearGradient id="heart" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8c2f2a"/><stop offset="1" stop-color="#4a1210"/>
  </linearGradient>
  <linearGradient id="sausage" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c94a35"/><stop offset="1" stop-color="#7d2216"/>
  </linearGradient>
  <linearGradient id="cheese" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fbe9b7"/><stop offset="1" stop-color="#e2bf72"/>
  </linearGradient>
  <linearGradient id="bread" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f0b860"/><stop offset="0.7" stop-color="#c47a2c"/><stop offset="1" stop-color="#8f4f16"/>
  </linearGradient>
  <linearGradient id="fries" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffd66b"/><stop offset="1" stop-color="#e09a2a"/>
  </linearGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="14"/>
  </filter>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
    <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity="0.55"/>
  </filter>
</defs>`

function scene(content, { grill = true, smoke = true } = {}) {
  const bars = grill
    ? Array.from({ length: 11 }, (_, i) => `<rect x="${-20 + i * 80}" y="455" width="14" height="160" rx="3" fill="#1b1310" opacity="0.9" transform="skewX(-12)"/>`).join("")
    : ""
  const sparks = Array.from({ length: 18 }, (_, i) => {
    const x = (i * 137) % W
    const y = 380 + ((i * 53) % 200)
    const r = 1.2 + (i % 3) * 0.8
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffb347" opacity="${0.35 + (i % 4) * 0.15}"/>`
  }).join("")
  const smokeLayer = smoke
    ? `<g opacity="0.07" filter="url(#soft)"><ellipse cx="260" cy="150" rx="180" ry="60" fill="#fff"/><ellipse cx="560" cy="110" rx="160" ry="50" fill="#fff"/></g>`
    : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#ember)"/>
${smokeLayer}
<g>${bars}</g>
<rect y="540" width="${W}" height="60" fill="#ff6a00" opacity="0.18" filter="url(#soft)"/>
${sparks}
${content}
</svg>`
}

/* --- Peças de espetinho --------------------------------------------------- */
const marks = (x, y, w, h) =>
  [0.25, 0.55, 0.85]
    .map((f) => `<path d="M${x + w * f - 18} ${y + 6} L${x + w * f + 4} ${y + h - 6}" stroke="#1d0b04" stroke-width="7" stroke-linecap="round" opacity="0.55"/>`)
    .join("")

const pieces = {
  beef: (x, y) => `<g filter="url(#shadow)"><rect x="${x}" y="${y}" width="86" height="78" rx="22" fill="url(#beef)"/>${marks(x, y, 86, 78)}<rect x="${x + 10}" y="${y + 6}" width="50" height="10" rx="5" fill="#c46a3e" opacity="0.5"/></g>`,
  chicken: (x, y) => `<g filter="url(#shadow)"><rect x="${x}" y="${y + 2}" width="84" height="74" rx="26" fill="url(#chicken)"/>${marks(x, y + 2, 84, 74)}<rect x="${x + 12}" y="${y + 8}" width="46" height="10" rx="5" fill="#ffd9a0" opacity="0.5"/></g>`,
  heart: (x, y) => `<g filter="url(#shadow)"><ellipse cx="${x + 42}" cy="${y + 40}" rx="40" ry="36" fill="url(#heart)"/><path d="M${x + 18} ${y + 22} q24 -14 48 0" stroke="#d9715f" stroke-width="5" fill="none" opacity="0.45"/>${marks(x, y + 4, 84, 72)}</g>`,
  sausage: (x, y) => `<g filter="url(#shadow)"><ellipse cx="${x + 42}" cy="${y + 40}" rx="22" ry="40" fill="url(#sausage)"/><ellipse cx="${x + 42}" cy="${y + 40}" rx="15" ry="32" fill="#d86a52"/><circle cx="${x + 38}" cy="${y + 26}" r="4" fill="#f4c2a8"/><circle cx="${x + 47}" cy="${y + 44}" r="3.5" fill="#f4c2a8"/><circle cx="${x + 39}" cy="${y + 58}" r="3" fill="#f4c2a8"/></g>`,
  cheese: (x, y) => `<g filter="url(#shadow)"><rect x="${x}" y="${y + 4}" width="88" height="70" rx="12" fill="url(#cheese)"/>${[0.3, 0.6, 0.9].map((f) => `<path d="M${x + 88 * f - 16} ${y + 10} L${x + 88 * f + 2} ${y + 68}" stroke="#a8621c" stroke-width="8" stroke-linecap="round" opacity="0.6"/>`).join("")}</g>`,
  garlicBread: (x, y) => `<g filter="url(#shadow)"><rect x="${x}" y="${y}" width="90" height="80" rx="30" fill="url(#bread)"/><path d="M${x + 14} ${y + 22} q30 -16 62 0" stroke="#fff6dc" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="${x + 30}" cy="${y + 18}" r="3" fill="#6f9b3c"/><circle cx="${x + 56}" cy="${y + 14}" r="3" fill="#6f9b3c"/></g>`,
}

function skewer(kinds, { y = 250, extra = "" } = {}) {
  const startX = 140
  const gap = 104
  const items = kinds.map((k, i) => pieces[k](startX + i * gap, y - 40)).join("")
  return scene(`
<g transform="translate(400 300) scale(1.3) rotate(-8) translate(-400 -300)">
  <rect x="60" y="${y - 4}" width="700" height="12" rx="6" fill="url(#wood)"/>
  <path d="M760 ${y - 4} l26 10 l-26 2 z" fill="#b48650"/>
  <rect x="40" y="${y - 10}" width="40" height="24" rx="8" fill="#5b3a1d"/>
  ${items}
  ${extra}
</g>`)
}

const greenMayo = (y) =>
  `<path d="M150 ${y - 40} q40 -26 80 0 t80 0 t80 0 t80 0 t80 0" stroke="#9bc75a" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.95"/>
   <path d="M160 ${y - 44} q40 -26 80 0 t80 0 t80 0 t80 0 t80 0" stroke="#d6f0a6" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/>`

const potatoStraws = (y) =>
  Array.from({ length: 34 }, (_, i) => {
    const x = 150 + ((i * 47) % 480)
    const yy = y - 70 + ((i * 29) % 40)
    const a = (i * 37) % 180
    return `<rect x="${x}" y="${yy}" width="26" height="5" rx="2.5" fill="#ffd24d" transform="rotate(${a} ${x + 13} ${yy + 2})"/>`
  }).join("")

const farofa = (y) =>
  Array.from({ length: 70 }, (_, i) => {
    const x = 150 + ((i * 59) % 500)
    const yy = y - 75 + ((i * 31) % 50)
    return `<circle cx="${x}" cy="${yy}" r="${2 + (i % 3)}" fill="${i % 2 ? "#e2bd74" : "#c99a4c"}"/>`
  }).join("")

/* --- Sanduíche ----------------------------------------------------------- */
function sandwich({ filling }) {
  return scene(`
<g filter="url(#shadow)">
  <ellipse cx="400" cy="470" rx="350" ry="26" fill="#000" opacity="0.45"/>
  <path d="M70 380 q0 -40 50 -44 h560 q50 4 50 44 q0 50 -60 56 h-540 q-60 -6 -60 -56z" fill="url(#bread)"/>
  ${filling}
  <g transform="translate(0 -46)"><path d="M80 300 q-10 -110 150 -120 h340 q160 10 150 120 q-4 26 -40 30 h-520 q-76 -4 -80 -30z" fill="url(#bread)"/></g>
  <path d="M150 174 q120 -40 250 -30" stroke="#ffe0a3" stroke-width="10" stroke-linecap="round" opacity="0.45" fill="none"/>
  ${Array.from({ length: 16 }, (_, i) => `<ellipse cx="${170 + i * 30}" cy="${169 + ((i * 17) % 40)}" rx="5" ry="2.5" fill="#fff3d0" opacity="0.8" transform="rotate(${(i * 40) % 180} ${170 + i * 30} ${169 + ((i * 17) % 40)})"/>`).join("")}
</g>`)
}

const lettuce = `<path d="M90 336 q30 -26 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 v20 h-600z" fill="#7cb342"/>`
const tomatoes = [130, 250, 370, 490, 610].map((x) => `<ellipse cx="${x + 30}" cy="330" rx="48" ry="12" fill="#d63a2a"/><ellipse cx="${x + 30}" cy="328" rx="34" ry="7" fill="#f26b55"/>`).join("")
const meatChunks = [110, 205, 300, 395, 490, 585].map((x) => `<rect x="${x}" y="292" width="92" height="44" rx="16" fill="url(#beef)"/>${marks(x, 292, 92, 44)}`).join("")
const steakSlices = [100, 175, 250, 325, 400, 475, 550, 625].map((x) => `<path d="M${x} 330 q35 -50 80 -36 l-10 40 z" fill="url(#beef)"/><path d="M${x + 12} 318 q28 -30 56 -24" stroke="#e08a76" stroke-width="5" fill="none" opacity="0.6"/>`).join("")
const sandwichStraws = Array.from({ length: 26 }, (_, i) => {
  const x = 110 + ((i * 43) % 560)
  const y = 300 + ((i * 13) % 26)
  return `<rect x="${x}" y="${y}" width="24" height="5" rx="2.5" fill="#ffd24d" transform="rotate(${(i * 41) % 180} ${x + 12} ${y + 2})"/>`
}).join("")
const sandwichMayo = `<path d="M100 300 q50 -20 100 0 t100 0 t100 0 t100 0 t100 0 t100 0" stroke="#9bc75a" stroke-width="12" fill="none" stroke-linecap="round"/>`
const pepperJelly = `<path d="M110 296 q50 -24 100 0 t100 0 t100 0 t100 0 t100 0 t100 0" stroke="#c4161c" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M118 292 q50 -24 100 0 t100 0" stroke="#ff6b5f" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>${[180, 340, 520].map((x) => `<circle cx="${x}" cy="306" r="4" fill="#ffd166"/>`).join("")}`

/* --- Pratos -------------------------------------------------------------- */
const plateBoard = (inner) =>
  scene(
    `<g filter="url(#shadow)"><rect x="90" y="190" width="620" height="300" rx="40" fill="url(#board)"/><rect x="110" y="208" width="580" height="264" rx="30" fill="none" stroke="#9a6a3c" stroke-width="3" opacity="0.5"/><rect x="700" y="310" width="70" height="40" rx="18" fill="url(#board)"/>${inner}</g>`,
    { grill: false },
  )

const fryStick = (x, y, h, a) => `<rect x="${x}" y="${y}" width="22" height="${h}" rx="5" fill="url(#fries)" transform="rotate(${a} ${x + 11} ${y + h})"/>`

const files = {
  "espetinho-gado": skewer(["beef", "beef", "beef", "beef", "beef"]),
  "espetinho-frango": skewer(["chicken", "chicken", "chicken", "chicken", "chicken"]),
  "espetinho-misto": skewer(["beef", "chicken", "sausage", "beef", "chicken"]),
  "espetinho-coracao": skewer(["heart", "heart", "heart", "heart", "heart", "heart"].slice(0, 5)),
  "espetinho-calabresa": skewer(["sausage", "sausage", "sausage", "sausage", "sausage"]),
  "espetinho-coalho": skewer(["cheese", "cheese", "cheese", "cheese", "cheese"]),
  "pao-de-alho": skewer(["garlicBread", "garlicBread", "garlicBread", "garlicBread", "garlicBread"]),
  "espetinho-especial-batata": skewer(["beef", "beef", "beef", "beef", "beef"], { extra: greenMayo(250) + potatoStraws(250) }),
  "espetinho-especial-farofa": skewer(["beef", "beef", "beef", "beef", "beef"], { extra: greenMayo(250) + farofa(250) }),
  cachurrasco: sandwich({ filling: lettuce + tomatoes + meatChunks + sandwichStraws + sandwichMayo }),
  "cachurrasco-contrafile": sandwich({ filling: lettuce + tomatoes + steakSlices + sandwichStraws + pepperJelly }),
  batatas: scene(`
<g filter="url(#shadow)">
  <ellipse cx="400" cy="500" rx="230" ry="30" fill="#000" opacity="0.5"/>
  ${Array.from({ length: 26 }, (_, i) => fryStick(230 + ((i * 53) % 320), 150 + ((i * 37) % 90), 200, -24 + ((i * 19) % 48))).join("")}
  <path d="M190 330 h420 l-40 170 h-340 z" fill="#b3261e"/>
  <path d="M190 330 h420 l-6 26 h-408 z" fill="#d6332a"/>
  <path d="M250 380 h300" stroke="#ffd166" stroke-width="6" stroke-dasharray="18 14" opacity="0.8"/>
</g>`),
  medalhao: plateBoard(
    [
      [270, 330],
      [450, 320],
      [360, 410],
    ]
      .map(
        ([cx, cy]) =>
          `<ellipse cx="${cx}" cy="${cy + 14}" rx="96" ry="40" fill="#2a0f06"/><ellipse cx="${cx}" cy="${cy}" rx="96" ry="44" fill="url(#beef)"/><ellipse cx="${cx}" cy="${cy}" rx="96" ry="44" fill="none" stroke="#f3e2c7" stroke-width="7" opacity="0.65"/>${[-40, 0, 40].map((d) => `<path d="M${cx + d - 26} ${cy - 30} L${cx + d + 18} ${cy + 30}" stroke="#1d0b04" stroke-width="8" stroke-linecap="round" opacity="0.6"/>`).join("")}`,
      )
      .join("") + `<circle cx="560" cy="420" r="9" fill="#e9e1d1"/><circle cx="580" cy="405" r="6" fill="#e9e1d1"/><circle cx="540" cy="400" r="5" fill="#e9e1d1"/>`,
  ),
  "assado-tiras": plateBoard(
    Array.from({ length: 9 }, (_, i) => {
      const x = 150 + i * 56
      const y = 250 + ((i * 23) % 60)
      return `<rect x="${x}" y="${y}" width="44" height="170" rx="16" fill="url(#beef)" transform="rotate(${-14 + ((i * 11) % 28)} ${x + 22} ${y + 85})"/><path d="M${x + 6} ${y + 30} h32 M${x + 6} ${y + 80} h32 M${x + 6} ${y + 130} h32" stroke="#1d0b04" stroke-width="6" opacity="0.5" transform="rotate(${-14 + ((i * 11) % 28)} ${x + 22} ${y + 85})"/>`
    }).join(""),
  ),
  picado: plateBoard(
    // espetinhos
    [0, 1, 2]
      .map(
        (i) =>
          `<g transform="translate(0 ${i * 52})"><rect x="140" y="250" width="300" height="8" rx="4" fill="url(#wood)"/>${[150, 215, 280, 345].map((x, j) => `<rect x="${x}" y="226" width="56" height="54" rx="16" fill="${j % 2 ? "url(#chicken)" : "url(#beef)"}"/>`).join("")}</g>`,
      )
      .join("") +
      // batata frita
      Array.from({ length: 14 }, (_, i) => `<rect x="${480 + ((i * 29) % 160)}" y="${250 + ((i * 17) % 80)}" width="16" height="90" rx="4" fill="url(#fries)" transform="rotate(${-40 + ((i * 23) % 80)} ${490 + ((i * 29) % 160)} ${300 + ((i * 17) % 80)})"/>`).join("") +
      // pão de alho, picles e ovos de codorna
      `<rect x="160" y="400" width="120" height="50" rx="20" fill="url(#bread)"/><path d="M172 414 q48 -12 96 0" stroke="#fff6dc" stroke-width="8" stroke-linecap="round" fill="none"/>` +
      [330, 380, 430].map((x) => `<ellipse cx="${x}" cy="430" rx="22" ry="14" fill="#7fa83c"/><ellipse cx="${x}" cy="430" rx="14" ry="8" fill="#a9cf63"/>`).join("") +
      [520, 565, 610].map((x) => `<ellipse cx="${x}" cy="430" rx="20" ry="16" fill="#f6efe2"/><circle cx="${x}" cy="430" r="8" fill="#f2b632"/>`).join(""),
  ),
}

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(OUT, `${name}.svg`), svg.replace(/\n\s*/g, "\n").trim() + "\n")
}

/* --- Imagem principal (hero) -------------------------------------------- */
const heroSkewer = (y, kinds, rot) =>
  `<g transform="rotate(${rot} 800 ${y})"><rect x="180" y="${y - 4}" width="1260" height="12" rx="6" fill="url(#wood)"/>${kinds
    .map((k, i) => pieces[k](260 + i * 112, y - 40))
    .join("")}</g>`
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">${defs}
<rect width="1600" height="1000" fill="url(#bg)"/>
<ellipse cx="800" cy="1000" rx="900" ry="420" fill="url(#ember)"/>
<g opacity="0.08" filter="url(#soft)"><ellipse cx="500" cy="220" rx="320" ry="90" fill="#fff"/><ellipse cx="1150" cy="160" rx="300" ry="80" fill="#fff"/></g>
${Array.from({ length: 21 }, (_, i) => `<rect x="${-40 + i * 84}" y="760" width="16" height="260" rx="4" fill="#1b1310" transform="skewX(-14)"/>`).join("")}
${heroSkewer(520, ["beef", "beef", "chicken", "beef", "sausage", "beef", "chicken", "beef", "beef", "cheese"], -6)}
${heroSkewer(690, ["chicken", "chicken", "beef", "chicken", "heart", "chicken", "beef", "chicken", "chicken", "beef"], 4)}
${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 173) % 1600}" cy="${600 + ((i * 71) % 380)}" r="${1.5 + (i % 3)}" fill="#ffb347" opacity="${0.3 + (i % 5) * 0.12}"/>`).join("")}
</svg>`
writeFileSync(join(process.cwd(), "public", "img", "hero-brasa.svg"), hero.replace(/\n\s*/g, "\n").trim() + "\n")

console.log(`Ilustrações geradas: ${Object.keys(files).length + 1}`)
