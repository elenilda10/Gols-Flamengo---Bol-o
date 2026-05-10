import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

type RankingItem = {
  id: string
  uid?: string
  nome: string
  name?: string
  pontos: number
  total: number
  acertos: string[]
}

export async function GET() {
  const apiUrl = process.env.RANKING_API_URL

  if (!apiUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "RANKING_API_URL não configurada",
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

    let data: any
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
        { status: 500 }
      )
    }

    const ranking: RankingItem[] = Array.isArray(data.ranking)
      ? data.ranking
      : []

    return NextResponse.json({
      ok: true,
      source_ok: data.ok === true,
      total: ranking.length,
      ranking,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        ranking: [],
      },
      { status: 500 }
    )
  }
}
