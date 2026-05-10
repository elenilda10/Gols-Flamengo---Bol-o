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
  photo_file_id?: string
}

type RankingApiResponse = {
  ok: boolean
  ranking: RankingItem[]
}

const RANKING_API_URL =
  "https://prod-api.telebothost.com/ownlang/webhook/22351677?command=ranking_api&sig=623c115af27121ecc3f10058d0e06d6122e703c692f002fc24795db6af325a9b"

function getName(player: RankingItem) {
  return player.nome || player.name || "Torcedor"
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return initials || "?"
}

function Avatar({ player, size = 92 }: { player: RankingItem; size?: number }) {
  const name = getName(player)

  if (player.photo_file_id) {
    return (
      <img
        src={`/api/avatar?file_id=${encodeURIComponent(player.photo_file_id)}`}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid rgba(248,113,113,.45)",
          background: "#18181b",
          boxShadow: "0 18px 45px rgba(239,68,68,.25)",
        }}
        onError={(event) => {
          event.currentTarget.style.display = "none"
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ef4444, #7f1d1d)",
        border: "2px solid rgba(248,113,113,.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 950,
        fontSize: 30,
        boxShadow: "0 18px 45px rgba(239,68,68,.25)",
      }}
    >
      {getInitials(name)}
    </div>
  )
}

export default function UserProfileClient({ uid }: { uid: string }) {
  const [player, setPlayer] = useState<RankingItem | null>(null)
  const [rankingPosition, setRankingPosition] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(RANKING_API_URL, {
          cache: "no-store",
        })

        const data = (await res.json()) as RankingApiResponse

        if (!Array.isArray(data.ranking)) {
          setError("A API não retornou o ranking corretamente.")
          return
        }

        const index = data.ranking.findIndex((item) => {
          return String(item.id) === String(uid) || String(item.uid) === String(uid)
        })

        if (index === -1) {
          setPlayer(null)
          setRankingPosition(null)
          return
        }

        setPlayer(data.ranking[index])
        setRankingPosition(index + 1)
      } catch {
        setError("Não foi possível carregar os dados do jogador.")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [uid])

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <a href="/" style={styles.back}>
            ← Voltar
          </a>

          <div style={styles.emptyCard}>
            <strong>Carregando jogador...</strong>
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <a href="/" style={styles.back}>
            ← Voltar
          </a>

          <div style={styles.emptyCard}>
            <strong>Erro ao carregar jogador</strong>
            <p>{error}</p>
          </div>
        </section>
      </main>
    )
  }

  if (!player) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <a href="/" style={styles.back}>
            ← Voltar
          </a>

          <div style={styles.emptyCard}>
            <h1 style={styles.notFoundTitle}>Jogador não encontrado</h1>
            <p style={styles.notFoundText}>
              Esse usuário não está no ranking atual.
            </p>
          </div>
        </section>
      </main>
    )
  }

  const name = getName(player)

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <a href="/" style={styles.back}>
          ← Voltar ao ranking
        </a>

        <header style={styles.hero}>
          <Avatar player={player} />

          <div style={styles.heroText}>
            <span style={styles.badge}>
              #{rankingPosition || "-"} no ranking
            </span>

            <h1 style={styles.title}>{name}</h1>

            <p style={styles.subtitle}>
              Histórico de acertos no bolão Flamengo Gols.
            </p>
          </div>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🏆</span>
            <strong style={styles.statNumber}>{player.pontos || 0}</strong>
            <span style={styles.statLabel}>Pontos</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>🎯</span>
            <strong style={styles.statNumber}>{player.total || 0}</strong>
            <span style={styles.statLabel}>Acertos</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>🔥</span>
            <strong style={styles.statNumber}>#{rankingPosition || "-"}</strong>
            <span style={styles.statLabel}>Posição</span>
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Acertos registrados</h2>
              <p style={styles.sectionSubtitle}>
                Todos os jogos que esse jogador acertou.
              </p>
            </div>
          </div>

          <div style={styles.list}>
            {player.acertos.length === 0 ? (
              <div style={styles.emptyHits}>
                <strong>Nenhum acerto registrado</strong>
                <p>Esse jogador ainda não tem acertos salvos.</p>
              </div>
            ) : (
              player.acertos.map((acerto, index) => (
                <div key={index} style={styles.hitCard}>
                  <div style={styles.hitNumber}>{index + 1}</div>

                  <div style={styles.hitInfo}>
                    <strong>⚽ Acerto confirmado</strong>
                    <p>{acerto}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(185,28,28,.42), transparent 34%), radial-gradient(circle at bottom right, rgba(127,29,29,.25), transparent 30%), #030303",
    color: "#fff",
    padding: "24px 16px 38px",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: 760,
    margin: "0 auto",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    color: "#fecaca",
    textDecoration: "none",
    fontWeight: 900,
    marginBottom: 22,
    fontSize: 16,
  },
  hero: {
    background:
      "linear-gradient(180deg, rgba(24,24,27,.92), rgba(9,9,11,.96))",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 32,
    padding: 22,
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow: "0 24px 70px rgba(0,0,0,.38)",
    marginBottom: 18,
  },
  heroText: {
    minWidth: 0,
  },
  badge: {
    display: "inline-flex",
    background: "rgba(127,29,29,.55)",
    color: "#fecaca",
    border: "1px solid rgba(248,113,113,.35)",
    borderRadius: 999,
    padding: "7px 11px",
    fontWeight: 900,
    fontSize: 13,
    marginBottom: 10,
  },
  title: {
    margin: 0,
    fontSize: 34,
    lineHeight: 1,
    letterSpacing: "-.045em",
    fontWeight: 950,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  subtitle: {
    margin: "9px 0 0",
    color: "#a1a1aa",
    fontSize: 15,
    lineHeight: 1.4,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    background: "linear-gradient(180deg, #1b1b20, #111114)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 22,
    padding: "16px 12px",
    minHeight: 112,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 18px 40px rgba(0,0,0,.25)",
  },
  statIcon: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
  },
  statLabel: {
    color: "#a1a1aa",
    fontSize: 13,
    fontWeight: 800,
  },
  panel: {
    background:
      "linear-gradient(180deg, rgba(15,15,18,.96), rgba(5,5,6,.96))",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 30,
    padding: 18,
    boxShadow: "0 24px 70px rgba(0,0,0,.42)",
  },
  panelHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 950,
    letterSpacing: "-.04em",
  },
  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#a1a1aa",
    fontSize: 15,
  },
  list: {
    display: "grid",
    gap: 10,
  },
  hitCard: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    background: "rgba(24,24,27,.9)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 20,
    padding: 14,
  },
  hitNumber: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ef4444, #7f1d1d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 950,
    flexShrink: 0,
  },
  hitInfo: {
    minWidth: 0,
  },
  hitInfoStrong: {
    fontSize: 16,
  },
  hitInfoP: {
    color: "#d4d4d8",
  },
  emptyHits: {
    border: "1px dashed rgba(255,255,255,.18)",
    borderRadius: 22,
    padding: 26,
    textAlign: "center",
    color: "#d4d4d8",
  },
  emptyCard: {
    background:
      "linear-gradient(180deg, rgba(24,24,27,.92), rgba(9,9,11,.96))",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 30,
    padding: 28,
    minHeight: 180,
  },
  notFoundTitle: {
    fontSize: 36,
    lineHeight: 1,
    margin: 0,
    fontWeight: 950,
  },
  notFoundText: {
    color: "#d4d4d8",
    fontSize: 18,
  },
            }
