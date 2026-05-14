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

export async function GET() {
  const max = Math.max(...ranking.map((item) => item.pontos), 1)

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "675px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #050509 0%, #090821 100%)",
          color: "#ffffff",
          fontFamily: "Arial",
          position: "relative",
          padding: "54px 70px",
          overflow: "hidden",
        }}
      >
        {/* fundo neon */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "170px",
            background:
              "linear-gradient(180deg, transparent, rgba(153, 35, 255, 0.18))",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "0px",
            right: "0px",
            bottom: "45px",
            height: "2px",
            background: "rgba(190, 35, 255, 0.55)",
          }}
        />

        <div
          style={{
            fontSize: "34px",
            fontWeight: 900,
            letterSpacing: "1.5px",
            textAlign: "center",
            marginBottom: "34px",
          }}
        >
          CLASSIFICAÇÃO DE PONTUAÇÕES
        </div>

        <div
          style={{
            display: "flex",
            position: "relative",
            width: "100%",
            height: "500px",
            border: "3px solid rgba(110, 125, 255, 0.75)",
            borderRadius: "38px",
            background: "#171d43",
            padding: "42px 52px",
            boxShadow: "0 0 28px rgba(91, 111, 255, 0.45)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-52px",
              top: "-68px",
              fontSize: "92px",
            }}
          >
            🏆
          </div>

          <div
            style={{
              position: "absolute",
              right: "-50px",
              top: "-58px",
              fontSize: "94px",
              transform: "rotate(14deg)",
            }}
          >
            🎮
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
            }}
          >
            {ranking.map((item) => {
              const width = Math.max(14, Math.round((item.pontos / max) * 100))

              return (
                <div
                  key={item.nome}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "38px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "150px",
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#f4f5ff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {item.nome}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: `${width}%`,
                        height: "38px",
                        borderRadius: "11px",
                        background:
                          "linear-gradient(90deg, #5268b8 0%, #6768ee 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: width > 18 ? "center" : "flex-end",
                        paddingRight: width <= 18 ? "10px" : "0px",
                        color: "#ffffff",
                        fontSize: "20px",
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
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 675,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
