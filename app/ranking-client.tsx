"use client"

import type React from "react"
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
  error?: string
  status?: number
  preview?: string
}

const RANKING_API_URL =
  "https://lucky-bar-5077.futvert.workers.dev/api/ranking_api"

function getPlayerId(player: RankingItem) {
  return String(player.id || player.uid || "")
}

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
  const [failed, setFailed] = useState(false)

  if (player.photo_file_id && !failed) {
    return (
      <img
        src={`/api/avatar?file_id=${encodeURIComponent(player.photo_file_id)}`}
        alt=""
        draggable={false}
        onContextMenu={(event) => event.preventDefault()}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid var(--border-color)",
          background: "var(--bg-input)",
          flexShrink: 0,
          userSelect: "none",
          WebkitUserSelect: "none",
          pointerEvents: "none",
          boxShadow: size >= 50 ? "0 8px 24px rgba(204,20,20,0.15)" : "none",
        }}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--crf-red), #7f1d1d)",
        border: "1px solid rgba(255,255,255,.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 900,
        fontSize: size >= 50 ? 18 : 13,
        flexShrink: 0,
        boxShadow: size >= 50 ? "0 8px 24px rgba(204,20,20,0.15)" : "none",
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
  
  // 📱 Estados para o Menu Lateral e Filtros Dinâmicos
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filterType, setFilterType] = useState<"todos" | "top10">("todos")

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

  // 🏆 ORDENAÇÃO NUMÉRICA RIGOROSA (Pontos Decrescentes -> Desempate por Acertos)
  const sortedRanking = useMemo(() => {
    return [...ranking].sort((a, b) => {
      const pontosA = Number(a.pontos) || 0
      const pontosB = Number(b.pontos) || 0

      if (pontosB !== pontosA) {
        return pontosB - pontosA
      }

      const acertosA = Number(a.total) || (Array.isArray(a.acertos) ? a.acertos.length : 0)
      const acertosB = Number(b.total) || (Array.isArray(b.acertos) ? b.acertos.length : 0)

      return acertosB - acertosA
    })
  }, [ranking])

  // Processa a busca e os filtros baseados na lista ordenada
  const filteredRanking = useMemo(() => {
    let result = [...sortedRanking]

    if (filterType === "top10") {
      result = result.slice(0, 10)
    }

    const term = search.trim().toLowerCase()
    if (!term) return result

    return result.filter((player) => {
      return getName(player).toLowerCase().includes(term)
    })
  }, [sortedRanking, search, filterType])

  const topThree = sortedRanking.slice(0, 3)
  const totalJogadores = sortedRanking.length
  const pontosSomados = sortedRanking.reduce((sum, item) => sum + Number(item.pontos || 0), 0)
  const acertosRegistrados = sortedRanking.reduce((sum, item) => sum + Number(item.total || 0), 0)
  const lider = sortedRanking[0] ? getName(sortedRanking[0]) : "—"

  return (
    <>
      {/* 🍔 BOTÃO GATILHO DO MENU LATERAL FLUTUANTE */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "var(--crf-red)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "52px",
          height: "52px",
          fontSize: "22px",
          boxShadow: "0 4px 16px rgba(204,20,20,0.3)",
          cursor: "pointer",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        ☰
      </button>

      {/* 🚪 ESTRUTURA DO MENU LATERAL DESLIZANTE */}
      {isSidebarOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, transition: "0.3s" }} onClick={() => setIsSidebarOpen(false)}>
          <div 
            style={{ width: "280px", height: "100%", backgroundColor: "var(--bg-card)", padding: "24px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "4px 0 24px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
              <strong style={{ color: "var(--text-main)", fontSize: "16px" }}>Navegação</strong>
              <button onClick={() => setIsSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="/" style={{ color: "var(--text-main)", textDecoration: "none", padding: "12px", background: "var(--bg-input)", borderRadius: "10px", fontSize: "14px", fontWeight: 600 }}>🏠 Tela Inicial</a>
              <a href="https://t.me/flamengogolsbot" target="_blank" rel="noreferrer" style={{ color: "var(--text-main)", textDecoration: "none", padding: "12px", borderRadius: "10px", fontSize: "14px" }}>🤖 Bot do Telegram</a>
              <a href="https://t.me/flamengo77" target="_blank" rel="noreferrer" style={{ color: "var(--text-main)", textDecoration: "none", padding: "12px", borderRadius: "10px", fontSize: "14px" }}>📢 Canal Oficial</a>
              <a href="/admin" style={{ color: "var(--crf-gold)", textDecoration: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: 700 }}>🛠️ Painel Admin</a>
            </nav>
          </div>
        </div>
      )}

      {/* GRID DE STATS DUAL-THEME */}
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

      {/* PAINEL DA CLASSIFICAÇÃO */}
      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitleArea}>
            <h2 style={styles.sectionTitle}>Classificação</h2>
            <p style={styles.leader}>Líder atual: <span style={{color: "var(--crf-red)", fontWeight: 700}}>{lider}</span></p>
          </div>
          <span style={styles.liveBadge}>● Ao vivo</span>
        </div>

        {/* PODIUM INTEGRADO AO DESIGN DINÂMICO */}
        {topThree.length > 0 && (
          <div style={styles.podium}>
            {topThree.map((player, index) => {
              const name = getName(player)
              const playerId = getPlayerId(player)

              return (
                <a
                  key={playerId}
                  href={`/user/${playerId}`}
                  style={{
                    ...styles.podiumCard,
                    ...(index === 0 ? styles.podiumFirst : {}),
                  }}
                >
                  <span style={styles.medal}>{getMedal(index)}</span>
                  <Avatar player={player} size={52} />
                  <strong style={styles.podiumName}>{name}</strong>
                  <span style={{...styles.podiumPoints, color: index === 0 ? "var(--crf-red)" : "var(--text-muted)"}}>
                    {player.pontos || 0} pts
                  </span>
                </a>
              )
            })}
          </div>
        )}

        {/* 🎛️ FILTROS RÁPIDOS DE EXIBIÇÃO */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          <button 
            onClick={() => setFilterType("todos")}
            style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: filterType === "todos" ? "var(--crf-red)" : "var(--bg-input)", color: filterType === "todos" ? "#fff" : "var(--text-muted)", transition: "0.2s" }}
          >
            📋 Todos
          </button>
          <button 
            onClick={() => setFilterType("top10")}
            style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: filterType === "top10" ? "var(--crf-red)" : "var(--bg-input)", color: filterType === "top10" ? "#fff" : "var(--text-muted)", transition: "0.2s" }}
          >
            🔥 Top 10
          </button>
        </div>

        {/* BARRA DE BUSCA ADAPTÁVEL */}
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔎</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar jogador..."
            style={styles.searchInput}
          />
        </div>

        {/* LISTAGEM PRINCIPAL */}
        <div style={styles.list}>
          {loading ? (
            <div style={styles.empty}><strong>Carregando ranking...</strong></div>
          ) : error ? (
            <div style={styles.empty}><strong>Erro ao carregar ranking</strong><p>{error}</p></div>
          ) : filteredRanking.length === 0 ? (
            <div style={styles.empty}><strong>Nenhum jogador encontrado</strong><p>Tente buscar por outro nome.</p></div>
          ) : (
            filteredRanking.map((player) => {
              const playerId = getPlayerId(player)
              const realIndex = sortedRanking.findIndex((item) => getPlayerId(item) === playerId)
              const name = getName(player)

              return (
                <a key={playerId} href={`/user/${playerId}`} style={styles.playerRow}>
                  <div style={styles.playerLeft}>
                    <span style={styles.position}>{getMedal(realIndex)}</span>
                    <Avatar player={player} size={42} />
                    <div style={styles.playerInfo}>
                      <strong style={styles.playerName}>{name}</strong>
                      <p style={styles.playerMeta}>{player.total || 0} acerto(s)</p>
                    </div>
                  </div>

                  <div style={styles.scoreBox}>
                    <strong style={styles.scoreNumber}>{player.pontos || 0}</strong>
                    <span style={styles.scoreText}>pts</span>
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
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginBottom: 16,
    width: "100%",
    boxSizing: "border-box",
  },
  statCard: {
    minWidth: 0,
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 20,
    padding: "14px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    boxShadow: "var(--shadow-card)",
    boxSizing: "border-box",
  },
  statIcon: { fontSize: 20 },
  statNumber: { fontSize: 24, fontWeight: 900, color: "var(--text-main)" },
  statLabel: { color: "var(--text-muted)", fontSize: 11, fontWeight: 700 },
  panel: {
    width: "100%",
    boxSizing: "border-box",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 24,
    padding: 16,
    boxShadow: "var(--shadow-card)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
    width: "100%",
  },
  panelTitleArea: { minWidth: 0, flex: 1 },
  sectionTitle: { margin: 0, fontSize: 22, fontWeight: 900, color: "var(--text-main)" },
  leader: { color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" },
  liveBadge: {
    background: "rgba(204,20,20,0.1)",
    color: "var(--crf-red)",
    borderRadius: 8,
    padding: "6px 10px",
    fontWeight: 800,
    fontSize: 11,
    textTransform: "uppercase",
    border: "1px solid rgba(204,20,20,0.15)"
  },
  podium: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
    marginBottom: 14,
    width: "100%",
  },
  podiumCard: {
    minWidth: 0,
    background: "var(--bg-input)",
    border: "1px solid var(--border-color)",
    borderRadius: 16,
    padding: "12px 8px",
    textDecoration: "none",
    color: "var(--text-main)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  podiumFirst: {
    border: "1px solid var(--crf-red)",
    boxShadow: "0 4px 14px rgba(204,20,20,0.08)"
  },
  medal: { fontSize: 20, fontWeight: 900 },
  podiumName: { fontSize: 12, fontWeight: 700, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  podiumPoints: { fontWeight: 800, fontSize: 11 },
  searchBox: {
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "var(--bg-input)",
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    padding: "0 12px",
    marginBottom: 12,
  },
  searchIcon: { opacity: 0.5 },
  searchInput: {
    width: "100%",
    background: "transparent",
    border: 0,
    outline: 0,
    color: "var(--text-main)",
    padding: "12px 0",
    fontSize: 14,
  },
  list: { display: "grid", gap: 8, width: "100%" },
  playerRow: {
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 16,
    padding: 10,
    color: "var(--text-main)",
    textDecoration: "none",
  },
  playerLeft: { minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: 10 },
  position: { width: 28, minWidth: 28, color: "var(--text-muted)", fontWeight: 800, fontSize: 13, textAlign: "center" },
  playerInfo: { minWidth: 0, flex: 1 },
  playerName: { display: "block", fontSize: 14, fontWeight: 700, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  playerMeta: { margin: "2px 0 0", color: "var(--text-muted)", fontSize: 11 },
  scoreBox: {
    width: 48,
    minWidth: 48,
    background: "var(--bg-input)",
    border: "1px solid var(--border-color)",
    borderRadius: 10,
    padding: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    lineHeight: 1,
  },
  scoreNumber: { fontSize: 16, fontWeight: 900, color: "var(--text-main)" },
  scoreText: { fontSize: 10, color: "var(--text-muted)", marginTop: "2px" },
  empty: { border: "1px dashed var(--border-color)", borderRadius: 16, padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 },
}
