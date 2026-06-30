import { NextResponse } from "next/server"
import { createClient } from "@vercel/kv"

// 🚀 Força a rota a ser 100% dinâmica e desativa o cache do Next.js/Vercel no build
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Conecta no banco usando qualquer variação de nome que a Vercel tenha gerado
const kv = createClient({
  url: process.env.KV_REST_API_URL || process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.KV_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ""
})

// Configuração de headers para impedir que o navegador salve o estado antigo localmente
const cacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

export async function GET() {
  try {
    const dadosSalvos = await kv.get("dados_config_bolao")
    
    // Se não houver dados salvos no banco, retorna null em vez de dados mocados antigos.
    // Isso ativa o estado de carregamento/aviso no frontend sem dar a piscada ("flicker").
    if (!dadosSalvos) {
      return NextResponse.json(null, { headers: cacheHeaders })
    }

    return NextResponse.json(dadosSalvos, { headers: cacheHeaders })
  } catch {
    // Em caso de erro na conexão com o banco, também retorna null por segurança
    return NextResponse.json(null, { headers: cacheHeaders })
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
