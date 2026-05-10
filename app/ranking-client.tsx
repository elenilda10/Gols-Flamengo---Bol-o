"use client"

import { useEffect, useState } from "react"

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

const RANKING_API_URL =
  "https://prod-api.telebothost.com/ownlang/webhook/22351677?command=ranking_api&sig=623c115af27121ecc3f10058d0e06d6122e703c692f002fc24795db6af325a9b"

export default function RankingClient() {
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadRanking() {
      try {
        const res = await fetch(RANKING_API_URL, {
          cache: "no-store",
        })

        const data = (await res.json()) as RankingApiResponse

        if (!Array.isArray(data.ranking)) {
          setError("A API não retornou uma lista de jogadores.")
          setRanking([])
          return
        }

        setRanking(data.ranking)
      } catch (err) {
        setError("Não foi possível carregar o ranking.")
        setRanking([])
      } finally {
        setLoading(false)
      }
    }

    loadRanking()
  }, [])

  const totalJogadores = ranking.length
  const pontosSomados = ranking.reduce(
    (sum, item) => sum + Number(item.pontos || 0),
    0
  )
  const acertosRegistrados = ranking.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  )
  const lider = ranking[0]?.nome || ranking[0]?.name || "—"

  return (
    <>
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.icon}>👥</div>
          <strong style={styles.number}>{totalJogadores}</strong>
          <p style={styles.label}>Jogadores</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>🏆</div>
          <strong style={styles.number}>{pontosSomados}</strong>
          <p style={styles.label}>Pontos somados</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>🎯</div>
          <strong style={styles.number}>{acertosRegistrados}</strong>
          <p style={styles.label}>Acertos registrados</p>
        </div>
      </div>

      <section style={styles.rankingCard}>
        <h2 style={styles.sectionTitle}>Classificação</h2>
        <p style={styles.leader}>Líder atual: {lider}</p>

        <div style={styles.liveBadge}>● Ao vivo</div>

        <div style={styles.list}>
          {loading ? (
            <div style={styles.empty}>
              <strong>Carregando ranking...</strong>
            </div>
          ) : error ? (
            <div style={styles.empty}>
              <strong>Erro ao carregar ranking</strong>
              <p>{error}</p>
            </div>
          ) : ranking.length === 0 ? (
            <div style={styles.empty}>
              <strong>Nenhum ranking disponível</strong>
              <p>A API respondeu, mas não retornou jogadores.</p>
            </div>
          ) : (
            ranking.map((player, index) => (
              <a
                key={player.id}
                href={`/user/${player.id}`}
                style={styles.player}
              >
                <div style={styles.playerLeft}>
                  <span style={styles.position}>#{index + 1}</span>
                  <div>
                    <strong style={styles.playerName}>
                      {player.nome || player.name || "Torcedor"}
                    </strong>
                    <p style={styles.playerMeta}>
                      {player.total || 0} acerto(s)
                    </p>
                  </div>
                </div>

                <strong style={styles.points}>{player.pontos || 0}</strong>
              </a>
            ))
          )}
        </div>
      </section>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gap: 16,
    marginBottom: 28,
  },
  card: {
    background: "rgba(24,24,27,.92)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 28,
    padding: 24,
  },
  icon: {
    fontSize: 34,
    marginBottom: 14,
  },
  number: {
    fontSize: 38,
    fontWeight: 900,
    display: "block",
  },
  label: {
    margin: "8px 0 0",
    color: "#a1a1aa",
    fontSize: 20,
  },
  rankingCard: {
    background: "rgba(9,9,11,.94)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 30,
    padding: 24,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
  },
  leader: {
    color: "#a1a1aa",
    fontSize: 20,
    marginTop: 8,
  },
  liveBadge: {
    display: "inline-block",
    marginTop: 18,
    background: "rgba(127,29,29,.45)",
    color: "#fca5a5",
    border: "1px solid rgba(239,68,68,.35)",
    borderRadius: 999,
    padding: "10px 16px",
    fontWeight: 800,
  },
  list: {
    marginTop: 22,
    display: "grid",
    gap: 12,
  },
  player: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    background: "#18181b",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 20,
    padding: 16,
    textDecoration: "none",
    color: "#fff",
  },
  playerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  position: {
    color: "#f87171",
    fontWeight: 900,
    fontSize: 22,
  },
  playerName: {
    fontSize: 18,
  },
  playerMeta: {
    margin: "4px 0 0",
    color: "#a1a1aa",
  },
  points: {
    fontSize: 28,
  },
  empty: {
    border: "1px dashed rgba(255,255,255,.2)",
    borderRadius: 24,
    padding: 28,
    textAlign: "center",
    color: "#d4d4d8",
  },
}
