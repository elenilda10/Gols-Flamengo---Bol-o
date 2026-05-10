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
    console.error("RANKING_API_URL não configurada")
    return []
  }

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      console.error("Erro HTTP ranking_api:", res.status)
      return []
    }

    const data = (await res.json()) as RankingApiResponse

    if (!data.ok || !Array.isArray(data.ranking)) {
      console.error("Resposta inválida da API:", data)
      return []
    }

    return data.ranking
  } catch (error) {
    console.error("Erro ao buscar ranking:", error)
    return []
  }
}

export default async function Home() {
  const ranking = await getRanking()

  const totalJogadores = ranking.length
  const pontosSomados = ranking.reduce((sum, item) => sum + Number(item.pontos || 0), 0)
  const acertosRegistrados = ranking.reduce((sum, item) => sum + Number(item.total || 0), 0)
  const lider = ranking[0]?.nome || ranking[0]?.name || "—"

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <section className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-4xl font-bold">Flamengo Gols</h1>
          <p className="text-zinc-400 mt-2">Ranking geral do bolão</p>
        </header>

        <div className="grid gap-4">
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="text-4xl mb-4">👥</div>
            <strong className="text-4xl">{totalJogadores}</strong>
            <p className="text-zinc-400 mt-2">Jogadores</p>
          </div>

          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="text-4xl mb-4">🏆</div>
            <strong className="text-4xl">{pontosSomados}</strong>
            <p className="text-zinc-400 mt-2">Pontos somados</p>
          </div>

          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="text-4xl mb-4">🎯</div>
            <strong className="text-4xl">{acertosRegistrados}</strong>
            <p className="text-zinc-400 mt-2">Acertos registrados</p>
          </div>
        </div>

        <section className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
          <h2 className="text-3xl font-bold">Classificação</h2>
          <p className="text-zinc-400 mt-2">Líder atual: {lider}</p>

          <div className="inline-flex items-center gap-2 rounded-full bg-red-950 text-red-300 px-4 py-2 mt-5 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Ao vivo
          </div>

          <div className="mt-6 space-y-3">
            {ranking.length === 0 ? (
              <div className="border border-dashed border-zinc-700 rounded-3xl p-8 text-center">
                <strong className="text-xl">Nenhum ranking disponível</strong>
                <p className="text-zinc-400 mt-3">
                  A API respondeu, mas não retornou jogadores.
                </p>
              </div>
            ) : (
              ranking.map((player, index) => (
                <a
                  key={player.id}
                  href={`/user/${player.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-900 border border-zinc-800 p-4 no-underline text-white"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-red-400">
                      #{index + 1}
                    </span>
                    <div>
                      <strong className="text-lg">
                        {player.nome || player.name || "Torcedor"}
                      </strong>
                      <p className="text-zinc-400 text-sm">
                        {player.total || 0} acerto(s)
                      </p>
                    </div>
                  </div>

                  <strong className="text-2xl">{player.pontos || 0}</strong>
                </a>
              ))
            )}
          </div>
        </section>

        <footer className="text-center text-zinc-500">
          Feito para a Nação Rubro-Negra ⚫🔴
        </footer>
      </section>
    </main>
  )
}
