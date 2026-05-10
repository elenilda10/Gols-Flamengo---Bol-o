import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const fileId = request.nextUrl.searchParams.get("file_id")

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN não configurado" },
      { status: 500 }
    )
  }

  if (!fileId) {
    return NextResponse.json(
      { ok: false, error: "file_id obrigatório" },
      { status: 400 }
    )
  }

  try {
    const fileRes = await fetch(
      `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`,
      { cache: "no-store" }
    )

    const fileData = await fileRes.json()

    if (!fileData.ok || !fileData.result?.file_path) {
      return NextResponse.json(
        { ok: false, error: "Arquivo não encontrado" },
        { status: 404 }
      )
    }

    const imageRes = await fetch(
      `https://api.telegram.org/file/bot${token}/${fileData.result.file_path}`,
      { cache: "no-store" }
    )

    if (!imageRes.ok) {
      return NextResponse.json(
        { ok: false, error: "Erro ao baixar imagem" },
        { status: 502 }
      )
    }

    const contentType =
      imageRes.headers.get("content-type") || "image/jpeg"

    const buffer = await imageRes.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}
