import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

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

    let data

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
