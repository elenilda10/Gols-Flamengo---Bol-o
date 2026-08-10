import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

type RankingItem = {
  id?: string
  uid?: string
  nome?: string
  name?: string
  photo_file_id?: string
  photo_url?: string
}

type RankingResponse = {
  ok?: boolean
  ranking?: RankingItem[]
  data?: RankingItem[] | { ranking?: RankingItem[] }
}

function getUserId(item: RankingItem) {
  return String(item.id || item.uid || "")
}

function getUserName(item?: RankingItem | null) {
  return item?.nome || item?.name || "Torcedor"
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "F"
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

  <text
    x="120"
    y="136"
    text-anchor="middle"
    font-size="70"
    font-weight="900"
    font-family="Arial, Helvetica, sans-serif"
    fill="#ffffff"
  >
    ${initials}
  </text>
</svg>`
}

function svgResponse(name: string) {
  return new NextResponse(fallbackSvg(name), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  })
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
  // Suporta tanto TELEGRAM_TOKEN quanto TELEGRAM_BOT_TOKEN na Vercel
  const token = process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_BOT_TOKEN

  const uid = request.nextUrl.searchParams.get("uid")
  const directFileId = request.nextUrl.searchParams.get("file_id")

  let fileId = directFileId || ""
  let photoUrl = ""
  let name = "Torcedor"

  // 1. Busca no ranking se tiver UID fornecido
  if (uid) {
    const ranking = await getRanking()

    const player = ranking.find((item) => {
      return getUserId(item) === String(uid)
    })

    if (player) {
      fileId = player.photo_file_id || fileId
      photoUrl = player.photo_url || ""
      name = getUserName(player)
    }
  }

  // 2. Se a URL do KV for válida e não expirada, faz o teste HEAD e redireciona
  if (photoUrl && photoUrl.startsWith("http") && !photoUrl.includes("dicebear")) {
    try {
      const checkRes = await fetch(photoUrl, { method: "HEAD", cache: "no-store" })
      if (checkRes.ok) {
        return NextResponse.redirect(photoUrl, {
          status: 302,
          headers: {
            "Cache-Control": "public, max-age=3600",
          },
        })
      }
    } catch {
      // Se der erro ou link expirado, ignora e segue para renovar o file_id abaixo
    }
  }

  // 3. Se não houver FileId ou Token do Bot, devolve o SVG com as iniciais do torcedor
  if (!fileId || !token) {
    return svgResponse(name)
  }

  // 4. Fluxo de renovação usando o file_id via Telegram Bot API
  try {
    const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`

    const fileResponse = await fetch(getFileUrl, { cache: "no-store" })

    if (!fileResponse.ok) {
      return svgResponse(name)
    }

    const fileData = await fileResponse.json()

    if (!fileData.ok || !fileData.result?.file_path) {
      return svgResponse(name)
    }

    const filePath = fileData.result.file_path
    const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`

    // Redireciona para a URL renovada e válida do arquivo no Telegram
    return NextResponse.redirect(downloadUrl, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch {
    return svgResponse(name)
  }
}
