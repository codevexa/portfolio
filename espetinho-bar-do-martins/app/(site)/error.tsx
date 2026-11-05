"use client"

import { useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { ErrorView } from "@/components/site/error-view"

export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <ErrorView
      title="Algo saiu do ponto"
      message="Não conseguimos carregar esta página agora. Tente de novo em instantes — seu carrinho continua salvo neste aparelho."
      action={
        <button type="button" className="btn btn-primary" onClick={() => retry()}>
          <RefreshCw className="h-5 w-5" /> Tentar novamente
        </button>
      }
    />
  )
}
