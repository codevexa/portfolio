import { ErrorView } from "@/components/site/error-view"

export default function NotFound() {
  return <ErrorView title="Página não encontrada" message="O endereço que você abriu não existe ou mudou de lugar." />
}
