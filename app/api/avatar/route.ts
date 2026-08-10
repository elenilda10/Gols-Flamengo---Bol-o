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

// Auxiliar para baixar do Telegram forçando a exibição inline
async function fetchTelegramImage(url: string) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  })

  if (!res.ok) return null

  const buffer = await res.arrayBuffer()
  const contentType = res.headers.get("content-type") || "image/jpeg"

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline; filename=avatar.jpg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  })
}

export async function GET(request: NextRequest) {
  const token = process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_BOT_TOKEN

  const uid = request.nextUrl.searchParams.get("uid")
  const directFileId = request.nextUrl.searchParams.get("file_id")

  let fileId = directFileId || ""
  let photoUrl = ""
  let name = "Torcedor"

  // 1. Busca dados no ranking se tiver UID fornecido
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

  // 2. Se a URL salva no KV existir, tenta servir o buffer embutido (inline)
  if (photoUrl && photoUrl.startsWith("http") && !photoUrl.includes("dicebear")) {
    const responseImage = await fetchTelegramImage(photoUrl)
    if (responseImage) return responseImage
  }

  // 3. Se não houver FileId ou Token do Bot, devolve o SVG de iniciais
  if (!fileId || !token) {
    return svgResponse(name)
  }

  // 4. Fluxo via Telegram Bot API (Renovando file_id)
  try {
    const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`
    const fileResponse = await fetch(getFileUrl, { cache: "no-store" })

    if (!fileResponse.ok) return svgResponse(name)

    const fileData = await fileResponse.json()
    if (!fileData.ok || !fileData.result?.file_path) return svgResponse(name)

    const filePath = fileData.result.file_path
    const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`

    const responseImage = await fetchTelegramImage(downloadUrl)
    if (responseImage) return responseImage

    return svgResponse(name)
  } catch {
    return svgResponse(name)
  }
}
