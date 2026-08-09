import { ImageResponse } from "next/og"

export const runtime = "edge"

type RankingItem = {
  id?: string
  uid?: string
  nome?: string
  name?: string
  pontos?: number
}

type RankingResponse = {
  ok?: boolean
  ranking?: RankingItem[]
  data?: RankingItem[] | { ranking?: RankingItem[] }
}

function limitarNome(nome: string, max = 16) {
  if (!nome) return "Torcedor"
  if (nome.length <= max) return nome
  return nome.slice(0, max - 3) + "..."
}

async function getRankingDinamico(): Promise<RankingItem[]> {
  const apiUrl = process.env.RANKING_API_URL

  if (!apiUrl) return []

  try {
    const response = await fetch(apiUrl, { cache: "no-store" })
    if (!response.ok) return []

    const data: RankingResponse | RankingItem[] = await response.json()

    let lista: RankingItem[] = []
    if (Array.isArray(data)) lista = data
    else if (Array.isArray(data.ranking)) lista = data.ranking
    else if (Array.isArray(data.data)) lista = data.data
    else if (data.data && !Array.isArray(data.data) && Array.isArray(data.data.ranking)) {
      lista = data.data.ranking
    }

    return lista.map((item) => ({
      nome: item.nome || item.name || "Torcedor",
      pontos: Number(item.pontos) || 0,
    }))
  } catch {
    return []
  }
}

export async function GET() {
  const dadosApi = await getRankingDinamico()

  // Se a API falhar ou estiver vazia, exibe dados padrão de fallback
  const ranking = dadosApi.length > 0 ? dadosApi : [
    { nome: "Torcedor 1", pontos: 10 },
    { nome: "Torcedor 2", pontos: 5 },
  ]

  const top10 = [...ranking]
    .sort((a, b) => (b.pontos || 0) - (a.pontos || 0))
    .slice(0, 10)

  const maxPontos = Math.max(...top10.map((item) => item.pontos || 0), 1)

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "1350px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          padding: "70px 64px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          background: "linear-gradient(180deg, #09090b 0%, #170505 45%, #000000 100%)",
        }}
      >
        {/* Grid de fundo sutil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            opacity: 0.3,
          }}
        />

        {/* Brilho Vermelho Mengão (Canto Superior Direito) */}
        <div
          style={{
            position: "absolute",
            width: "650px",
            height: "650px",
            right: "-160px",
            top: "-160px",
            borderRadius: "999px",
            background: "rgba(220, 38, 38, 0.18)",
            filter: "blur(100px)",
          }}
        />

        {/* Brilho Escuro (Canto Inferior Esquerdo) */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            left: "-170px",
            bottom: "-170px",
            borderRadius: "999px",
            background: "rgba(185, 28, 28, 0.12)",
            filter: "blur(90px)",
          }}
        />

        {/* Conteúdo Principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Topo do Banner */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "44px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "30px",
                fontWeight: 900,
                color: "#ef4444",
                marginBottom: "22px",
              }}
            >
              📊 Classificação Geral
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "62px",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-2px",
                marginBottom: "22px",
              }}
            >
              Ranking do Bolão do Mengão ❤️🖤
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "28px",
                lineHeight: 1.42,
                color: "rgba(255,255,255,0.78)",
                maxWidth: "1000px",
              }}
            >
              Top 10 torcedores com mais pontos no bolão oficial. Cada acerto de placar soma pontos na tabela rubro-negra!
            </div>
          </div>

          {/* Card Central do Ranking */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              width: "100%",
              padding: "44px 42px 42px 42px",
              borderRadius: "34px",
              background: "rgba(24, 24, 27, 0.88)",
              border: "2px solid rgba(239, 68, 68, 0.3)",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Cabeçalho do Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "34px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "44px",
                  fontWeight: 900,
                  color: "#ffffff",
                }}
              >
                🏆 Top 10 Rubro-Negro
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 22px",
                  borderRadius: "999px",
                  fontSize: "23px",
                  fontWeight: 800,
                  background: "rgba(220, 38, 38, 0.18)",
                  border: "1px solid rgba(220, 38, 38, 0.42)",
                  color: "#fca5a5",
                }}
              >
                ● Ao vivo
              </div>
            </div>

            {/* Lista dos 10 Melhores */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
              }}
            >
              {top10.map((item, index) => {
                const porcentagem = Math.max(
                  12,
                  Math.round(((item.pontos || 0) / maxPontos) * 100)
                )

                const medalha =
                  index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`

                return (
                  <div
                    key={(item.nome || "") + index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      minHeight: "78px",
                      padding: "14px 18px",
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.035)",
                      border: "1px solid rgba(255,255,255,0.055)",
                    }}
                  >
                    <div
                      style={{
                        width: "82px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: index < 3 ? "27px" : "28px",
                        fontWeight: 900,
                        color: index === 0 ? "#f4d03f" : index === 1 ? "#e2e8f0" : index === 2 ? "#b45309" : "#ef4444",
                      }}
                    >
                      {medalha}
                    </div>

                    <div
                      style={{
                        width: "220px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "28px",
                        fontWeight: 800,
                        color: "#ffffff",
                      }}
                    >
                      {limitarNome(item.nome || "Torcedor")}
                    </div>

                    {/* Barra de Progresso com Gradient Vermelho Mengão */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        height: "46px",
                        marginLeft: "18px",
                        borderRadius: "999px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: `${porcentagem}%`,
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            porcentagem > 22 ? "center" : "flex-end",
                          paddingRight: porcentagem > 22 ? "0px" : "14px",
                          borderRadius: "999px",
                          background:
                            "linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)",
                          color: "#ffffff",
                          fontSize: "25px",
                          fontWeight: 900,
                        }}
                      >
                        {item.pontos} pts
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Rodapé */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "36px",
                paddingTop: "28px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                fontSize: "24px",
                color: "rgba(255,255,255,0.72)",
              }}
            >
              <div style={{ display: "flex" }}>
                🔴⚫ @FlamengoGolsBot | Canal @Flamengo77
              </div>

              <div
                style={{
                  display: "flex",
                  color: "#ef4444",
                  fontWeight: 900,
                }}
              >
                Atualização em tempo real
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1350,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
