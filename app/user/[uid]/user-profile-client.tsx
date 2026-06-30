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
  "https://lucky-bar-5077.futvert.workers.dev/api/ranking_api"

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

function Avatar({ player }: { player: RankingItem }) {
  const name = getName(player)
  const [failed, setFailed] = useState(false)

  if (player.photo_file_id && !failed) {
    return (
      <img
        className="profile-photo"
        src={`/api/avatar?file_id=${encodeURIComponent(player.photo_file_id)}`}
        alt={name}
        draggable={false}
        onContextMenu={(event) => event.preventDefault()}
        onError={() => setFailed(true)}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "20px",
          objectFit: "cover",
          border: "2px solid var(--crf-red)",
          boxShadow: "0 8px 16px rgba(204, 20, 20, 0.15)"
        }}
      />
    )
  }

  return (
    <div 
      className="profile-avatar"
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, var(--crf-red), #800a0a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontWeight: "700",
        fontSize: "24px",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)"
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

        if (!data || !Array.isArray(data.ranking)) {
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

  // Estilos inline de apoio para estruturação rápida e responsiva
  const pageStyles: React.CSSProperties = {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "20px 16px 40px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  }

  const cardStyles: React.CSSProperties = {
    background: "var(--bg-card)",
    borderRadius: "24px",
    padding: "20px",
    border: "1px solid var(--border-color)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
  }

  if (loading) {
    return (
      <main style={pageStyles}>
        <div style={{ ...cardStyles, textAlign: "center", padding: "40px 20px" }}>
          <h1 style={{ fontSize: "18px", margin: "0 0 8px 0", color: "var(--text-main)" }}>Carregando jogador...</h1>
          <p style={{ fontSize: "13px", margin: 0, color: "var(--text-muted)" }}>Buscando os dados do perfil.</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main style={pageStyles}>
        <a href="/" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>
          ← Voltar
        </a>
        <div style={{ ...cardStyles, borderLeft: "4px solid var(--crf-red)", padding: "24px 20px" }}>
          <h1 style={{ fontSize: "18px", margin: "0 0 8px 0", color: "var(--text-main)" }}>Erro ao carregar jogador</h1>
          <p style={{ fontSize: "13px", margin: 0, color: "var(--text-muted)" }}>{error}</p>
        </div>
      </main>
    )
  }

  if (!player) {
    return (
      <main style={pageStyles}>
        <a href="/" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>
          ← Voltar
        </a>
        <div style={{ ...cardStyles, borderLeft: "4px solid var(--crf-red)" }}>
          <h1 style={{ fontSize: "18px", margin: "0 0 8px 0", color: "var(--text-main)" }}>Jogador não encontrado</h1>
          <p style={{ fontSize: "13px", margin: 0, color: "var(--text-muted)" }}>Esse usuário não está no ranking atual.</p>
        </div>
      </main>
    )
  }

  const name = getName(player)
  const acertos = Array.isArray(player.acertos) ? player.acertos : []
  const isTop3 = rankingPosition && rankingPosition <= 3

  return (
    <main style={pageStyles}>
      <a href="/" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
        ← Voltar ao ranking geral
      </a>

      {/* CARD PRINCIPAL DO PERFIL */}
      <section style={cardStyles}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ position: "relative" }}>
            <Avatar player={player} />
            {isTop3 && (
              <div style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                fontSize: "22px",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
              }}>
                {rankingPosition === 1 ? "🥇" : rankingPosition === 2 ? "🥈" : "🥉"}
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: "inline-block",
              background: isTop3 ? "rgba(197, 160, 89, 0.15)" : "rgba(204, 20, 20, 0.15)",
              color: isTop3 ? "var(--crf-gold)" : "var(--crf-red)",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "8px",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              border: `1px solid ${isTop3 ? "rgba(197, 160, 89, 0.2)" : "rgba(204, 20, 20, 0.2)"}`
            }}>
              👑 #{rankingPosition || "-"} no ranking
            </span>
            <h1 style={{
              fontSize: "20px",
              fontWeight: 800,
              margin: 0,
              color: "var(--text-main)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>{name}</h1>
            <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Membro do grupo VIP Flamengo Gols.
            </p>
          </div>
        </div>
      </section>

      {/* GRID DE ESTATÍSTICAS PREMIUM */}
      <section style={{ display: "flex", gap: "12px" }}>
        <div style={{ ...cardStyles, flex: 1, padding: "16px 12px", textAlign: "center", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "18px" }}>🏆</span>
          <strong style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>{player.pontos || 0}</strong>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>Pontos</span>
        </div>

        <div style={{ ...cardStyles, flex: 1, padding: "16px 12px", textAlign: "center", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "18px" }}>🎯</span>
          <strong style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>{player.total || 0}</strong>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>Acertos</span>
        </div>

        <div style={{ ...cardStyles, flex: 1, padding: "16px 12px", textAlign: "center", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "18px" }}>🔥</span>
          <strong style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>#{rankingPosition || "-"}</strong>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>Posição</span>
        </div>
      </section>

      {/* HISTÓRICO DE ACERTOS */}
      <section style={cardStyles}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>Acertos Registrados</h2>
            <p style={{ fontSize: "11px", margin: "2px 0 0 0", color: "var(--text-muted)" }}>Placares exatos cravados pelo torcedor.</p>
          </div>
          <span className="pulse-badge" style={{
            background: "rgba(204, 20, 20, 0.1)",
            color: "var(--crf-red)",
            fontSize: "10px",
            fontWeight: 700,
            padding: "4px 8px",
            borderRadius: "6px",
            textTransform: "uppercase",
            border: "1px solid rgba(204, 20, 20, 0.2)"
          }}>
            ATIVO
          </span>
        </div>

        {acertos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "8px", opacity: 0.5 }}>⚽</span>
            <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px 0", color: "var(--text-main)" }}>Nenhum acerto ainda</h3>
            <p style={{ fontSize: "12px", margin: 0 }}>Os placares convertidos aparecerão listados aqui.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {acertos.map((acerto, index) => (
              <div 
                key={`${acerto}-${index}`} 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: "var(--bg-input)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.02)"
                }}
              >
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)"
                }}>
                  {index + 1}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "var(--crf-red)", fontSize: "11px" }}>⚽</span>
                    <strong style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>Placar Cravado</strong>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {acerto}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
