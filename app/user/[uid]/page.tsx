type RankingItem = {
  id: string
  uid?: string
  nome: string
  name?: string
  pontos: number
  total: number
  acertos: string[]
}

type RankingApiResponse = {
  ok: boolean
  ranking: RankingItem[]
}

async function getRanking(): Promise<RankingItem[]> {
  const apiUrl = process.env.RANKING_API_URL

  if (!apiUrl) {
    return []
  }

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      return []
    }

    const data = (await res.json()) as RankingApiResponse
    return Array.isArray(data.ranking) ? data.ranking : []
  } catch {
    return []
  }
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  const ranking = await getRanking()

  const player = ranking.find((item) => {
    return item.id === uid || item.uid === uid
  })

  if (!player) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-8">
        <section className="max-w-3xl mx-auto">
          <a href="/" className="text-red-400 font-bold">
            ← Voltar
          </a>

          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 mt-8 text-center">
            <h1 className="text-3xl font-bold">Jogador não encontrado</h1>
            <p className="text-zinc-400 mt-3">
              Esse usuário não está no ranking atual.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <section className="max-w-3xl mx-auto space-y-6">
        <a href="/" className="text-red-400 font-bold">
          ← Voltar
        </a>

        <header className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
          <h1 className="text-3xl font-bold">
            {player.nome || player.name || "Torcedor"}
          </h1>
          <p className="text-zinc-400 mt-2">ID: {player.id}</p>
        </header>

        <div className="grid gap-4">
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="text-4xl mb-4">🏆</div>
            <strong className="text-4xl">{player.pontos || 0}</strong>
            <p className="text-zinc-400 mt-2">Pontos</p>
          </div>

          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="text-4xl mb-4">🎯</div>
            <strong className="text-4xl">{player.total || 0}</strong>
            <p className="text-zinc-400 mt-2">Acertos</p>
          </div>
        </div>

        <section className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
          <h2 className="text-2xl font-bold">Acertos registrados</h2>

          <div className="mt-5 space-y-3">
            {player.acertos.length === 0 ? (
              <p className="text-zinc-400">Nenhum acerto registrado.</p>
            ) : (
              player.acertos.map((acerto, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4"
                >
                  ⚽ {acerto}
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
