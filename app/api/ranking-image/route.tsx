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
  { nome: "Outro", pontos: 95 },
]

function limitarNome(nome: string, max = 14) {
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
          height: "1200px",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(180deg, #021b17 0%, #032722 45%, #062f29 100%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
          padding: "56px",
        }}
      >
        {/* grid de fundo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "42px 42px",
            opacity: 0.22,
          }}
        />

        {/* glow */}
        <div
          style={{
            position: "absolute",
            width: "700px",
            height: "700px",
            borderRadius: "999px",
            background: "rgba(255, 215, 0, 0.08)",
            filter: "blur(90px)",
            top: "-120px",
            right: "-120px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "520px",
            height: "520px",
            borderRadius: "999px",
            background: "rgba(34, 197, 94, 0.08)",
            filter: "blur(90px)",
            bottom: "-120px",
            left: "-120px",
          }}
        />

        {/* topo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 2,
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "28px",
              fontWeight: 800,
              color: "#f4d03f",
              marginBottom: "18px",
            }}
          >
            📊 Classificação geral
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "72px",
              fontWeight: 900,
              lineHeight: 1,
              marginBottom: "18px",
            }}
          >
            Ranking do Bolão da Seleção
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "30px",
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.82)",
              maxWidth: "980px",
            }}
          >
            Top 10 torcedores com mais pontos no bolão. Cada acerto soma pontos
            e atualiza a classificação geral da torcida brasileira.
          </div>
        </div>

        {/* card principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 2,
            background: "rgba(3, 36, 32, 0.85)",
            border: "2px solid rgba(178, 155, 52, 0.32)",
            borderRadius: "34px",
            padding: "34px 34px 30px 34px",
            boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
            flex: 1,
          }}
        >
          {/* cabeçalho do card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "42px",
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
                fontSize: "24px",
                fontWeight: 800,
                padding: "10px 20px",
                borderRadius: "999px",
                background: "rgba(34, 197, 94, 0.16)",
                border: "1px solid rgba(34, 197, 94, 0.34)",
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
              gap: "16px",
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
                    minHeight: "66px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "18px",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      width: "88px",
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "26px",
                      fontWeight: 900,
                      color: "#f4d03f",
                    }}
                  >
                    {medalha}
                  </div>

                  <div
                    style={{
                      width: "190px",
                      display: "flex",
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
                      height: "38px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "999px",
                      overflow: "hidden",
                      marginLeft: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: `${porcentagem}%`,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: porcentagem > 22 ? "center" : "flex-end",
                        paddingRight: porcentagem > 22 ? "0px" : "12px",
                        borderRadius: "999px",
                        background:
                          "linear-gradient(90deg, #d4af37 0%, #f4d03f 100%)",
                        color: "#103b2e",
                        fontSize: "24px",
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
              marginTop: "26px",
              fontSize: "22px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            <div style={{ display: "flex" }}>
              🇧🇷 Gols Brasil | Bolão da Seleção
            </div>

            <div style={{ display: "flex", color: "#f4d03f", fontWeight: 800 }}>
              Atualização em tempo real
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
                  }
