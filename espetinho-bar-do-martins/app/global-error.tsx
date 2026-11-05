"use client"

import "./globals.css"

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="section-title text-4xl">Algo saiu do ponto</h1>
        <p className="text-fumaca">O site teve um problema inesperado. Tente novamente.</p>
        <button type="button" className="btn btn-primary" onClick={() => retry()}>
          Tentar novamente
        </button>
      </body>
    </html>
  )
}
