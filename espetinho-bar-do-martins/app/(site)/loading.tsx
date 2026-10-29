export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12" aria-busy="true" aria-label="Carregando">
      <div className="mb-8 h-12 w-64 animate-pulse rounded-xl bg-madeira" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card-surface h-96 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
