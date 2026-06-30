import { NextResponse } from "next/server"

// Dados iniciais padrão (Caso o servidor reinicie)
let dadosJogo = {
  adversario: "PALMEIRAS",
  logoUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png",
  data: "2026-07-15T21:45:00"
}

export async function GET() {
  return NextResponse.json(dadosJogo)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.adversario || !body.logoUrl || !body.data) {
      return NextResponse.json({ ok: false, error: "Campos incompletos." }, { status: 400 })
    }
    
    dadosJogo = {
      adversario: body.adversario.toUpperCase(),
      logoUrl: body.logoUrl,
      data: body.data
    }
    
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
