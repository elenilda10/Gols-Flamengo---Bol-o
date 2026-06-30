import { NextResponse } from "next/server"

// 🏟️ ESTRUTURA COMPLETA UNIFICADA NA MEMÓRIA DO SERVIDOR
let dadosConfigBolao = {
  timeCasa: "FLAMENGO",
  logoCasaUrl: "https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png",
  timeFora: "PALMEIRAS",
  logoForaUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png",
  data: "2026-07-15T21:45:00",
  campeonato: "Campeonato Brasileiro",
  rodada: "14ª",
  transmissao: "Globo, Premiere",
  proximos: [
    { 
      timeCasa: "FLAMENGO", 
      logoCasaUrl: "https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png", 
      timeFora: "FLUMINENSE", 
      logoForaUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/fluminense_60x60.png", 
      data: "2026-07-19T16:00:00", 
      campeonato: "Campeonato Brasileiro", 
      rodada: "15ª", 
      transmissao: "Globo, Premiere" 
    }
  ]
}

export async function GET() {
  return NextResponse.json(dadosConfigBolao)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 🔑 CORREÇÃO DA SENHA: LEITURA EXCLUSIVA E COMPARAÇÃO VIA VARIÁVEL DE AMBIENTE
    const senhaInformada = body.senha
    const SENHA_MESTRE = process.env.ADMIN_PASSWORD

    // 🔒 BARREIRA DE SEGURANÇA: Bloqueia se a senha do ambiente não estiver configurada ou estiver errada
    if (!SENHA_MESTRE || !senhaInformada || senhaInformada !== SENHA_MESTRE) {
      return NextResponse.json({ ok: false, error: "Acesso negado. Credencial mestre inválida!" }, { status: 401 })
    }

    // Validação estrita dos campos essenciais do confronto ativo
    if (!body.timeCasa || !body.timeFora || !body.data) {
      return NextResponse.json({ ok: false, error: "Campos obrigatórios do jogo principal ausentes." }, { status: 400 })
    }
    
    // Sincroniza e grava o payload completo vindo do controlador responsivo
    dadosConfigBolao = {
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
    
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
