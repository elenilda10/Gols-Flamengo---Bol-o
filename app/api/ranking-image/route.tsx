import { ImageResponse } from "next/og"

export const runtime = "edge"

type RankingItem = {
  nome: string
  pontos: number
}

const ranking: RankingItem[] = [
  { nome: "1514417...", pontos: 3995 },
  { nome: "Tartaru...", pontos: 1167 },
  { nome: "B9", pontos: 328 },
  { nome: "Reginal...", pontos: 220 },
  { nome: "kau", pontos: 188 },
  { nome: "Eduardo", pontos: 160 },
  { nome: "Masa", pontos: 153 },
  { nome: "Kaiquex", pontos: 138 },
  { nome: "Dimitri", pontos: 110 },
  { nome: "Glauber", pontos: 100 },
]

function limitarNome(nome: string, max = 16) {
  if (!nome) return "Torcedor"
  if (nome.length <= max) return nome
  return nome.slice(0, max - 3) + "..."
}

export async function GET() {
  const top10 = [...ranking]
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 10)

  const maxPontos = Math.max(...top10.map((item) => item.pontos), 1)

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
          background:
            "linear-gradient(180deg, #021814 0%, #03261f 45%, #071d33 100%)",
        }}
      >
        {/* grid de fundo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            opacity: 0.28,
          }}
        />

        {/* brilhos */}
        <div
          style={{
            position: "absolute",
            width: "620px",
            height: "620px",
            right: "-160px",
            top: "-160px",
            borderRadius: "999px",
            background: "rgba(244, 208, 63, 0.12)",
            filter: "blur(90px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            left: "-170px",
            bottom: "-170px",
            borderRadius: "999px",
            background: "rgba(34, 197, 94, 0.12)",
            filter: "blur(90px)",
          }}
        />

        {/* conteúdo */}
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
          {/* topo */}
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
                color: "#f4d03f",
                marginBottom: "22px",
              }}
            >
              📊 Classificação geral
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
              Ranking do Bolão da Seleção
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
              Top 10 torcedores com mais pontos no bolão. Cada acerto soma
              pontos e atualiza a classificação geral da torcida brasileira.
            </div>
          </div>

          {/* card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              width: "100%",
              padding: "44px 42px 42px 42px",
              borderRadius: "34px",
              background: "rgba(3, 35, 30, 0.86)",
              border: "2px solid rgba(244, 208, 63, 0.26)",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* cabeçalho do card */}
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
                🏆 Top 10 do ranking
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 22px",
                  borderRadius: "999px",
                  fontSize: "23px",
                  fontWeight: 800,
                  background: "rgba(34, 197, 94, 0.18)",
                  border: "1px solid rgba(34, 197, 94, 0.42)",
                  color: "#dfffe8",
                }}
              >
                ● Ao vivo
              </div>
            </div>

            {/* lista */}
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
                  Math.round((item.pontos / maxPontos) * 100)
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
                    key={item.nome + index}
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
                        color: "#f4d03f",
                      }}
                    >
                      {medalha}
                    </div>

                    <div
                      style={{
                        width: "200px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "28px",
                        fontWeight: 800,
                        color: "#ffffff",
                      }}
                    >
                      {limitarNome(item.nome)}
                    </div>

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
                            "linear-gradient(90deg, #d4af37 0%, #f4d03f 100%)",
                          color: "#103b2e",
                          fontSize: "25px",
                          fontWeight: 900,
                        }}
                      >
                        {item.pontos}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* rodapé */}
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
                🇧🇷 Gols Brasil | Bolão da Seleção
              </div>

              <div
                style={{
                  display: "flex",
                  color: "#f4d03f",
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
