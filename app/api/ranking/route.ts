import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface RankingItem {
  id: string
  uid: string
  nome: string
  pontos: number | string
  total?: number | string
  acertos?: any[]
  photo_url?: string
  posicao?: number
  [key: string]: any
}

export async function GET() {
  const apiUrl = process.env.RANKING_API_URL

  if (!apiUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "RANKING_API_URL não configurada na Vercel",
        ranking: [],
      },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(apiUrl, {
      cache: "no-store",
    })

    const text = await response.text()

    let data: { ok?: boolean; ranking?: RankingItem[]; [key: string]: any }

    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "A API não retornou JSON válido",
          status: response.status,
          preview: text.slice(0, 300),
          ranking: [],
        },
        { status: 502 }
      )
    }

    // 🏆 CORREÇÃO DO DESBALANCEAMENTO: Ordenação Numérica Decrescente
    if (data && Array.isArray(data.ranking)) {
      data.ranking.sort((a, b) => {
        const pontosA = Number(a.pontos) || 0
        const pontosB = Number(b.pontos) || 0

        // 1º Critério: Pontos (maior primeiro)
        if (pontosB !== pontosA) {
          return pontosB - pontosA
        }

        // 2º Critério: Total de Acertos (desempate)
        const acertosA = Number(a.total) || (Array.isArray(a.acertos) ? a.acertos.length : 0)
        const acertosB = Number(b.total) || (Array.isArray(b.acertos) ? b.acertos.length : 0)

        return acertosB - acertosA
      })

      // Atribui a posição numérica perfeita (#1, #2, #3...)
      data.ranking = data.ranking.map((item, index) => ({
        ...item,
        posicao: index + 1,
      }))
    }

    return NextResponse.json(data, {
      status: response.ok ? 200 : response.status,
      headers: {
        "Cache-Control": "no-store, private",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Falha ao buscar ranking",
        ranking: [],
      },
      { status: 500 }
    )
  }
}
