import { ImageResponse } from "next/og"

export const alt = "Espetinho Bar do Martins — O sabor da brasa que conquista!"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** Imagem de compartilhamento (WhatsApp, Instagram, Facebook). */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px 80px",
          background: "radial-gradient(120% 90% at 50% 120%, #b8440c 0%, #3a1708 45%, #0c0806 80%)",
          color: "#f6ecdb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 10, color: "#e8590c", textTransform: "uppercase" }}>Porto Alegre · RS</div>
        <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1, marginTop: 18, color: "#f2b134", textTransform: "uppercase" }}>
          Espetinho Bar do Martins
        </div>
        <div style={{ fontSize: 46, marginTop: 28, fontWeight: 700 }}>O sabor da brasa que conquista!</div>
        <div style={{ fontSize: 30, marginTop: 18, color: "#c2b29b" }}>Espetinhos · Carnes na brasa · Cachurrascos de 30 cm</div>
        <div style={{ display: "flex", marginTop: 40 }}>
          <div style={{ background: "#c8102e", color: "white", fontSize: 30, fontWeight: 700, padding: "14px 30px", borderRadius: 999 }}>
            Peça pelo WhatsApp
          </div>
        </div>
      </div>
    ),
    size,
  )
}
