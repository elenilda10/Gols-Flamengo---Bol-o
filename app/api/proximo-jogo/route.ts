import { NextResponse } from "next/server"
import { createClient } from "@vercel/kv" // 🚀 Mudamos para a conexão manual blindada

// Procura e conecta no banco usando qualquer variação de nome que a Vercel tenha gerado
const kv = createClient({
  url: process.env.KV_REST_API_URL || process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.KV_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ""
})

const dadosPadrao = {
  timeCasa: "FLAMENGO",
  logoCasaUrl: "https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png",
  timeFora: "PALMEIRAS",
  logoForaUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png",
  data: "2026-07-15T21:45:00",
  campeonato: "Campeonato Brasileiro",
  rodada: "14ª",
  transmissao: "Globo, Premiere",
  proximos: []
}

export async function GET() {
  try {
    const dadosSalvos = await kv.get("dados_config_bolao")
    return NextResponse.json(dadosSalvos || dadosPadrao)
  } catch {
    return NextResponse.json(dadosPadrao)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const senhaInformada = body.senha
    const SENHA_MESTRE = process.env.ADMIN_PASSWORD

    if (!SENHA_MESTRE || !senhaInformada || senhaInformada !== SENHA_MESTRE) {
      return NextResponse.json({ ok: false, error: "Acesso negado. Credencial mestre inválida!" }, { status: 401 })
    }

    if (body.validarAcesso) {
      return NextResponse.json({ ok: true, autorizado: true })
    }

    if (!body.timeCasa || !body.timeFora || !body.data) {
      return NextResponse.json({ ok: false, error: "Campos obrigatórios ausentes." }, { status: 400 })
    }
    
    const novosDados = {
      timeCasa: body.timeCasa.toUpperCase().trim(),
      logoCasaUrl: body.logoCasaUrl.trim(),
      timeFora: body.timeFora.toUpperCase().trim(),
      logoForaUrl: body.logoForaUrl.trim(),
      data: body.data,
      campeonato: body.campeonato?.trim() || "A definir",
      rodada: body.rodada?.trim() || "",
      transmissao: body.transmissao?.trim() || "A definir",
      proximos: Array.isArray(body.proximos) ? body.proximos : []
    }
    
    await kv.set("dados_config_bolao", novosDados)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
