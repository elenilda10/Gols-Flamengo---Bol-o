import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getContentType(filePath: string) {
  const path = filePath.toLowerCase()

  if (path.endsWith(".png")) return "image/png"
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
