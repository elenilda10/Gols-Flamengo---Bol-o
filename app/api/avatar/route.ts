import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getContentType(filePath: string) {
  const path = filePath.toLowerCase()

  if (path.endsWith(".png")) return "image/png"import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

type RankingItem = {
  id?: string
  uid?: string
  nome?: string
  name?: string
  photo_file_id?: string
}

type RankingResponse = {
  ok?: boolean
  ranking?: RankingItem[]
  data?: RankingItem[] | { ranking?: RankingItem[] }
}

function getContentType(filePath: string) {
  const path = filePath.toLowerCase()

  if (path.endsWith(".png")) return "image/png"
  if (path.endsWith(".webp")) return "image/webp"
  if (path.endsWith(".gif")) return "image/gif"
  if (path.endsWith(".jpg")) return "image/jpeg"
  if (path.endsWith(".jpeg")) return "image/jpeg"

  return "image/jpeg"
}

function getUserId(item: RankingItem) {
  return String(item.id || item.uid || "")
}

function getUserName(item?: RankingItem | null) {
  return item?.nome || item?.name || "Torcedor"
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "F"
  )
}

function fallbackSvg(name: string) {
  const initials = getInitials(name)

  return `
<svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#e50914"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" rx="120" fill="url(#g)"/>
  <circle cx="120" cy="120" r="106" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="4"/>
  <text x="120" y="136" text-anchor="middle" font-size="70" font-weight="900" font-family="Arial, Helvetica, sans-serif" fill="#ffffff">${initials}</text>
</svg>`
}

async function getRanking(): Promise<RankingItem[]> {
  const apiUrl = process.env.RANKING_API_URL

  if (!apiUrl) return []

  try {
    const response = await fetch(apiUrl, {
      cache: "no-store",
    })

    if (!response.ok) return []

    const data: RankingResponse | RankingItem[] = await response.json()

    if (Array.isArray(data)) return data
    if (Array.isArray(data.ranking)) return data.ranking
    if (Array.isArray(data.data)) return data.data

    if (
      data.data &&
      !Array.isArray(data.data) &&
      Array.isArray(data.data.ranking)
    ) {
      return data.data.ranking
    }

    return []
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const uid = request.nextUrl.searchParams.get("uid")
  const directFileId = request.nextUrl.searchParams.get("file_id")

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        error: "TELEGRAM_BOT_TOKEN não configurado na Vercel",
      },
      { status: 500 }
    )
  }

  let fileId = directFileId || ""
  let name = "Torcedor"

  if (!fileId && uid) {
    const ranking = await getRanking()
    const player = ranking.find((item) => getUserId(item) === String(uid))

    fileId = player?.photo_file_id || ""
    name = getUserName(player)
  }

  if (!fileId) {
    return new NextResponse(fallbackSvg(name), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    })
  }

  try {
    const getFileUrl =
      "https://api.telegram.org/bot" +
      token +
      "/getFile?file_id=" +
      encodeURIComponent(fileId)

    const fileResponse = await fetch(getFileUrl, {
      cache: "no-store",
    })

    const fileData = await fileResponse.json()

    if (!fileData.ok || !fileData.result?.file_path) {
      return new NextResponse(fallbackSvg(name), {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "private, no-store, max-age=0",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      })
    }

    const filePath = fileData.result.file_path
    const contentType = getContentType(filePath)

    const downloadUrl =
      "https://api.telegram.org/file/bot" + token + "/" + filePath

    const imageResponse = await fetch(downloadUrl, {
      cache: "no-store",
    })

    if (!imageResponse.ok) {
      return new NextResponse(fallbackSvg(name), {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "private, no-store, max-age=0",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      })
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline; filename=avatar.jpg",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    })
  } catch (error) {
    return new NextResponse(fallbackSvg(name), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    })
  }
}
  if (path.endsWith(".webp")) return "image/webp"
  if (path.endsWith(".gif")) return "image/gif"
  if (path.endsWith(".jpg")) return "image/jpeg"
  if (path.endsWith(".jpeg")) return "image/jpeg"

  return "image/jpeg"
}

export async function GET(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const fileId = request.nextUrl.searchParams.get("file_id")

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        error: "TELEGRAM_BOT_TOKEN não configurado na Vercel",
      },
      { status: 500 }
    )
  }

  if (!fileId) {
    return NextResponse.json(
      {
        ok: false,
        error: "file_id obrigatório",
      },
      { status: 400 }
    )
  }

  try {
    const getFileUrl =
      "https://api.telegram.org/bot" +
      token +
      "/getFile?file_id=" +
      encodeURIComponent(fileId)

    const fileResponse = await fetch(getFileUrl, {
      cache: "no-store",
    })

    const fileData = await fileResponse.json()

    if (!fileData.ok || !fileData.result?.file_path) {
      return NextResponse.json(
        {
          ok: false,
          error: "Telegram não retornou file_path",
          telegram: fileData,
        },
        { status: 502 }
      )
    }

    const filePath = fileData.result.file_path
    const contentType = getContentType(filePath)

    const downloadUrl =
      "https://api.telegram.org/file/bot" + token + "/" + filePath

    const imageResponse = await fetch(downloadUrl, {
      cache: "no-store",
    })

    if (!imageResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Erro ao baixar imagem do Telegram",
          status: imageResponse.status,
        },
        { status: 502 }
      )
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline; filename=avatar.jpg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
