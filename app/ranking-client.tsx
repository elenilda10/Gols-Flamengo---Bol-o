"use client"

import { useEffect, useMemo, useState } from "react"

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

function getMedal(index: number) {
  if (index === 0) return "🥇"
  if (index === 1) return "🥈"
  if (index === 2) return "🥉"
  return `#${index + 1}`
}

function Avatar({
  player,
  size = 42,
}: {
  player: RankingItem
  size?: number
}) {
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
          border: "1px solid rgba(255,255,255,.14)",
          background: "#18181b",
          flexShrink: 0,
          boxShadow:
            size >= 50
              ? "0 12px 30px rgba(239,68,68,.25)"
              : "none",
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
        border: "1px solid rgba(255,255,255,.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: size >= 50 ? 18 : 13,
        flexShrink: 0,
        boxShadow:
          size >= 50
            ? "0 12px 30px rgba(239,68,68,.25)"
            : "none",
      }}
    >
      {getInitials(name)}
    </div>
  )
}

export default function RankingClient() {
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

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
      } catch {
        setError("Não foi possível carregar o ranking.")
        setRanking([])
      } finally {
        setLoading(false)
      }
    }

    loadRanking()
  }, [])

  const filteredRanking = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return ranking

    return ranking.filter((player) => {
      return getName(player).toLowerCase().includes(term)
    })
  }, [ranking, search])

  const topThree = ranking.slice(0, 3)

  const totalJogadores = ranking.length

  const pontosSomados = ranking.reduce(
    (sum, item) => sum + Number(item.pontos || 0),
    0
  )

  const acertosRegistrados = ranking.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  )

  const lider = ranking[0] ? getName(ranking[0]) : "—"

  return (
    <>
      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>👥</span>
          <strong style={styles.statNumber}>{totalJogadores}</strong>
          <span style={styles.statLabel}>Jogadores</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statIcon}>🏆</span>
          <strong style={styles.statNumber}>{pontosSomados}</strong>
          <span style={styles.statLabel}>Pontos</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statIcon}>🎯</span>
          <strong style={styles.statNumber}>{acertosRegistrados}</strong>
          <span style={styles.statLabel}>Acertos</span>
        </div>
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Classificação</h2>
            <p style={styles.leader}>Líder atual: {lider}</p>
          </div>

          <span style={styles.liveBadge}>● Ao vivo</span>
        </div>

        {topThree.length > 0 && (
          <div style={styles.podium}>
            {topThree.map((player, index) => {
              const name = getName(player)

              return (
                <a
                  key={player.id}
                  href={`/user/${player.id}`}
                  style={{
                    ...styles.podiumCard,
                    ...(index === 0 ? styles.podiumFirst : {}),
                  }}
                >
                  <span style={styles.medal}>{getMedal(index)}</span>

                  <Avatar player={player} size={58} />

                  <strong style={styles.podiumName}>{name}</strong>

                  <span style={styles.podiumPoints}>
                    {player.pontos || 0} pts
                  </span>
                </a>
              )
            })}
          </div>
        )}

        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔎</span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar jogador..."
            style={styles.searchInput}
          />
        </div>

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
          ) : filteredRanking.length === 0 ? (
            <div style={styles.empty}>
              <strong>Nenhum jogador encontrado</strong>
              <p>Tente buscar por outro nome.</p>
            </div>
          ) : (
            filteredRanking.map((player) => {
              const realIndex = ranking.findIndex(
                (item) => item.id === player.id
              )

              const name = getName(player)

              return (
                <a
                  key={player.id}
                  href={`/user/${player.id}`}
                  style={styles.playerRow}
                >
                  <div style={styles.playerLeft}>
                    <span style={styles.position}>{getMedal(realIndex)}</span>

                    <Avatar player={player} size={46} />

                    <div style={styles.playerInfo}>
                      <strong style={styles.playerName}>{name}</strong>

                      <p style={styles.playerMeta}>
                        {player.total || 0} acerto(s)
                      </p>
                    </div>
                  </div>

                  <div style={styles.scoreBox}>
                    <strong>{player.pontos || 0}</strong>
                    <span>pts</span>
                  </div>
                </a>
              )
            })
          )}
        </div>
      </section>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    background: "linear-gradient(180deg, #1b1b20, #111114)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 22,
    padding: "16px 12px",
    minHeight: 116,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 18px 40px rgba(0,0,0,.25)",
  },
  statIcon: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 32,
    lineHeight: 1,
    fontWeight: 900,
  },
  statLabel: {
    color: "#a1a1aa",
    fontSize: 13,
    fontWeight: 700,
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 32,
    fontWeight: 950,
    letterSpacing: "-.04em",
  },
  leader: {
    color: "#a1a1aa",
    fontSize: 16,
    margin: "6px 0 0",
  },
  liveBadge: {
    background: "rgba(127,29,29,.55)",
    color: "#fecaca",
    border: "1px solid rgba(248,113,113,.35)",
    borderRadius: 999,
    padding: "9px 13px",
    fontWeight: 900,
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  podium: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: 10,
    marginBottom: 16,
  },
  podiumCard: {
    background: "#17171b",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 22,
    padding: 14,
    minHeight: 158,
    textDecoration: "none",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 8,
    overflow: "hidden",
  },
  podiumFirst: {
    background:
      "linear-gradient(180deg, rgba(127,29,29,.72), rgba(24,24,27,.95))",
    border: "1px solid rgba(248,113,113,.35)",
  },
  medal: {
    fontSize: 25,
    fontWeight: 900,
  },
  podiumName: {
    fontSize: 14,
    lineHeight: 1.15,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  podiumPoints: {
    color: "#fca5a5",
    fontWeight: 900,
    fontSize: 13,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#0b0b0d",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 18,
    padding: "0 14px",
    marginBottom: 14,
  },
  searchIcon: {
    opacity: 0.75,
  },
  searchInput: {
    width: "100%",
    background: "transparent",
    border: 0,
    outline: 0,
    color: "#fff",
    padding: "15px 0",
    fontSize: 16,
  },
  list: {
    display: "grid",
    gap: 10,
  },
  playerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    background: "rgba(24,24,27,.9)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 20,
    padding: 13,
    color: "#fff",
    textDecoration: "none",
  },
  playerLeft: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 11,
  },
  position: {
    width: 38,
    color: "#fca5a5",
    fontWeight: 950,
    fontSize: 16,
    flexShrink: 0,
  },
  playerInfo: {
    minWidth: 0,
  },
  playerName: {
    display: "block",
    fontSize: 16,
    maxWidth: 170,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  playerMeta: {
    margin: "3px 0 0",
    color: "#a1a1aa",
    fontSize: 13,
  },
  scoreBox: {
    minWidth: 58,
    background: "#0b0b0d",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 16,
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    lineHeight: 1,
    flexShrink: 0,
  },
  empty: {
    border: "1px dashed rgba(255,255,255,.18)",
    borderRadius: 22,
    padding: 26,
    textAlign: "center",
    color: "#d4d4d8",
  },
}
