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
      />
    )
  }

  return <div className="profile-avatar">{getInitials(name)}</div>
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
      <main className="page">
        <a href="/" className="back-link">
          ← Voltar
        </a>

        <section className="loading-card">
          <div>
            <h1>Carregando jogador...</h1>
            <p>Buscando os dados do perfil.</p>
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <a href="/" className="back-link">
          ← Voltar
        </a>

        <section className="error-card">
          <div>
            <h1>Erro ao carregar jogador</h1>
            <p>{error}</p>
          </div>
        </section>
      </main>
    )
  }

  if (!player) {
    return (
      <main className="page">
        <a href="/" className="back-link">
          ← Voltar
        </a>

        <section className="error-card">
          <div>
            <h1>Jogador não encontrado</h1>
            <p>Esse usuário não está no ranking atual.</p>
          </div>
        </section>
      </main>
    )
  }

  const name = getName(player)
  const acertos = Array.isArray(player.acertos) ? player.acertos : []

  return (
    <main className="page">
      <a href="/" className="back-link">
        ← Voltar ao ranking
      </a>

      <section className="profile-card">
        <div className="profile-main profile-main-featured">
          <div className="profile-rank-area">
            <span className="profile-tag profile-tag-featured">
              👑 #{rankingPosition || "-"} no ranking
            </span>

            <Avatar player={player} />
          </div>

          <div className="profile-text-area">
            <h1>{name}</h1>

            <p className="profile-subtitle">
              Histórico de acertos no bolão Flamengo Gols.
            </p>
          </div>
        </div>
      </section>

      <section className="profile-stats">
        <div className="profile-stat">
          <span>🏆</span>
          <strong>{player.pontos || 0}</strong>
          <span>Pontos</span>
        </div>

        <div className="profile-stat">
          <span>🎯</span>
          <strong>{player.total || 0}</strong>
          <span>Acertos</span>
        </div>

        <div className="profile-stat">
          <span>🔥</span>
          <strong>#{rankingPosition || "-"}</strong>
          <span>Posição</span>
        </div>
      </section>

      <section className="history-section">
        <div className="section-header">
          <div>
            <h2>Acertos registrados</h2>
            <p>Todos os jogos que esse jogador acertou.</p>
          </div>

          <span className="live-pill">Perfil</span>
        </div>

        {acertos.length === 0 ? (
          <div className="empty-card">
            <h3>Nenhum acerto registrado</h3>
            <p>Esse jogador ainda não tem acertos salvos.</p>
          </div>
        ) : (
          <div className="history-list">
            {acertos.map((acerto, index) => (
              <div key={`${acerto}-${index}`} className="history-item">
                <div className="history-item-number">{index + 1}</div>

                <div className="history-item-content">
                  <strong>⚽ Acerto confirmado</strong>
                  <span>{acerto}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
