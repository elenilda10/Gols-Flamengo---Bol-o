"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import RankingClient from "./ranking-client"

type JogoFuturo = {
  timeCasa: string
  logoCasaUrl: string
  timeFora: string
  logoForaUrl: string
  data: string
  campeonato: string
  rodada: string
  transmissao: string
}

export default function Home() {
  // 🔄 ESTADO DE CARREGAMENTO INICIAL (ANTI-FLICKER)
  const [carregando, setCarregando] = useState(true)

  // 🏟️ CONFIGURAÇÃO DE MANDO DE CAMPO DINÂMICO
  const [timeCasa, setTimeCasa] = useState("")
  const [logoCasaUrl, setLogoCasaUrl] = useState("")
  const [timeFora, setTimeFora] = useState("")
  const [logoForaUrl, setLogoForaUrl] = useState("")
  
  const [dataJogoStr, setDataJogoStr] = useState("")
  const [campeonato, setCampeonato] = useState("")
  const [rodada, setRodada] = useState("")
  const [transmissao, setTransmissao] = useState("")
  
  // 🗓️ AGENDA DE JOGOS FUTUROS
  const [proximosJogos, setProximosJogos] = useState<JogoFuturo[]>([])
  const [modalAberto, setModalAberto] = useState(false)

  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  const [jogoIniciado, setJogoIniciado] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Inicializa o tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.body.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.body.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDarkMode(false)
    } else {
      document.body.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDarkMode(true)
    }
  }

  // Busca dados dinâmicos direto do banco KV
  useEffect(() => {
    fetch("/api/proximo-jogo")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.timeCasa) setTimeCasa(data.timeCasa)
          if (data.logoCasaUrl) setLogoCasaUrl(data.logoCasaUrl)
          if (data.timeFora) setTimeFora(data.timeFora)
          if (data.logoForaUrl) setLogoForaUrl(data.logoForaUrl)
          if (data.data) setDataJogoStr(data.data)
          if (data.campeonato) setCampeonato(data.campeonato)
          if (data.rodada) setRodada(data.rodada)
          if (data.transmissao) setTransmissao(data.transmissao)
          
          if (data.proximos && Array.isArray(data.proximos)) {
            setProximosJogos(data.proximos)
          } else {
            setProximosJogos([
              { timeCasa: "FLAMENGO", logoCasaUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_brazil.svg", timeFora: "FLUMINENSE", logoForaUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/fluminense_60x60.png", data: "2026-07-19T16:00:00", campeonato: "Campeonato Brasileiro", rodada: "15ª", transmissao: "Globo, Premiere" },
              { timeCasa: "BOTAFOGO", logoCasaUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/botafogo_60x60.png", timeFora: "FLAMENGO", logoForaUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_brazil.svg", data: "2026-07-22T21:30:00", campeonato: "Copa do Brasil", rodada: "Oitavas", transmissao: "Prime Video" }
            ])
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  // Cronômetro do jogo atual
  useEffect(() => {
    if (!dataJogoStr) return
    const dataAlvo = new Date(dataJogoStr)
    
    const timer = setInterval(() => {
      const agora = new Date().getTime()
      const diferenca = dataAlvo.getTime() - agora

      if (diferenca <= 0) {
        clearInterval(timer)
        setJogoIniciado(true)
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
      } else {
        setJogoIniciado(false)
        setTimeLeft({
          dias: Math.floor(diferenca / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((diferenca % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [dataJogoStr])

  const formatarDataBr = (dataStr: string) => {
    if (!dataStr) return ""
    const d = new Date(dataStr)
    const dia = String(d.getDate()).padStart(2, "0")
    const mes = String(d.getMonth() + 1).padStart(2, "0")
    const hora = String(d.getHours()).padStart(2, "0")
    const min = String(d.getMinutes()).padStart(2, "0")
    return `${dia}/${mes} às ${hora}h${min}`
  }

  // ⏳ TELA DE CARREGAMENTO LIMPA (SÓ SVG GIRATÓRIO)
  if (carregando) {
    return (
      <main className="site-shell" style={{ maxWidth: "500px", padding: "20px 12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <svg width="50" height="50" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="var(--crf-red, #cc1414)">
          <g fill="none" fillRule="evenodd" strokeWidth="4">
            <circle cx="22" cy="22" r="20" strokeOpacity=".1" stroke="var(--text-muted, #888)" />
            <path d="M22 2C33.046 2 42 10.954 42 22">
              <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="0.8s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>
        <p style={{ marginTop: "16px", fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "1px" }}>
          CARREGANDO BOLÃO...
        </p>
      </main>
    )
  }

  return (
    <main className="site-shell" style={{ maxWidth: "500px", padding: "20px 12px max(90px, env(safe-area-inset-bottom)) 12px", position: "relative" }}>
      
      {/* 🔴 CABEÇALHO LIMPADO (Sem botão flutuante de tema) */}
      <header className="ranking-section" style={{ textAlign: "center", padding: "24px 16px", marginBottom: "4px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 950, margin: 0, letterSpacing: "-0.04em", color: "var(--text-main)" }}>
          FLAMENGO GOLS
        </h1>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0 0", fontWeight: 700 }}>
          O BOLÃO ABERTO OFICIAL DA NAÇÃO
        </p>
      </header>

      {/* ⚔️ SCOREBOARD CARD */}
      <section className="ranking-section" style={{ padding: "18px 16px" }}>
        <div className="section-header" style={{ marginBottom: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--crf-red)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              🏆 {campeonato} {rodada ? `• ${rodada} rodada` : ""}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
              📅 {formatarDataBr(dataJogoStr)}
            </span>
          </div>
          <span className="pulse-badge live-pill" style={{ background: jogoIniciado ? "rgba(204,20,20,0.08)" : "rgba(46,125,50,0.08)", color: jogoIniciado ? "var(--crf-red)" : "#2e7d32", padding: "4px 10px", fontSize: "11px", fontWeight: 800, borderRadius: "6px", border: "none" }}>
            {jogoIniciado ? "Em Andamento" : "Aberto"}
          </span>
        </div>

        {/* Times Confronto */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "10px 0 14px 0" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <img src={logoCasaUrl || "https://s.sde.globo.com/media/organizations/default_60x60.png"} alt={timeCasa} style={{ width: "52px", height: "52px", objectFit: "contain", marginBottom: "6px" }} onError={(e) => { (e.target as HTMLImageElement).src = "https://s.sde.globo.com/media/organizations/default_60x60.png" }} />
            <strong style={{ fontSize: "13px", display: "block", color: "var(--text-main)" }}>{timeCasa}</strong>
          </div>
          <div className="rank-position" style={{ width: "36px", height: "36px", borderRadius: "10px", fontWeight: 900, fontSize: "11px", color: "var(--text-muted)" }}>VS</div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <img src={logoForaUrl || "https://s.sde.globo.com/media/organizations/default_60x60.png"} alt={timeFora} style={{ width: "52px", height: "52px", objectFit: "contain", marginBottom: "6px" }} onError={(e) => { (e.target as HTMLImageElement).src = "https://s.sde.globo.com/media/organizations/default_60x60.png" }} />
            <strong style={{ fontSize: "13px", display: "block", color: "var(--text-main)" }}>{timeFora}</strong>
          </div>
        </div>

        {/* Canais */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "var(--bg-input)", padding: "8px 12px", borderRadius: "10px", marginBottom: "14px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
          <span>📺 Onde assistir:</span>
          <strong style={{ color: "var(--text-main)" }}>{transmissao}</strong>
        </div>

        {/* Cronômetro */}
        {!jogoIniciado ? (
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ background: "var(--bg-input)", padding: "10px 6px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
                <strong className="font-scoreboard" style={{ fontSize: "24px", display: "block", color: "var(--crf-red)", fontWeight: 900 }}>{String(timeLeft.dias).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 700 }}>Dias</span>
              </div>
              <div style={{ background: "var(--bg-input)", padding: "10px 6px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
                <strong className="font-scoreboard" style={{ fontSize: "24px", display: "block", fontWeight: 900, color: "var(--text-main)" }}>{String(timeLeft.horas).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 700 }}>Horas</span>
              </div>
              <div style={{ background: "var(--bg-input)", padding: "10px 6px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
                <strong className="font-scoreboard" style={{ fontSize: "24px", display: "block", fontWeight: 900, color: "var(--text-main)" }}>{String(timeLeft.minutos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 700 }}>Min</span>
              </div>
              <div style={{ background: "var(--bg-input)", padding: "10px 6px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
                <strong className="font-scoreboard" style={{ fontSize: "24px", display: "block", color: "var(--rank-points-color)", fontWeight: 900 }}>{String(timeLeft.segundos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 700 }}>Seg</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--bg-input)", padding: "12px", borderRadius: "10px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontWeight: 700 }}>
            🔒 Votações encerradas! Acompanhe o canal.
          </div>
        )}

        <button onClick={() => setModalAberto(true)} style={{ width: "100%", background: "transparent", border: "1px dashed var(--border-color)", padding: "10px", borderRadius: "12px", color: "var(--text-muted)", fontSize: "12px", fontWeight: 700, marginTop: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          🗓️ Ver Agenda de Próximos Jogos
        </button>
      </section>

      {/* 🚪 MODAL AGENDA */}
      {modalAberto && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backdropFilter: "blur(4px)" }} onClick={() => setModalAberto(false)}>
          <div style={{ background: "var(--bg-card)", width: "100%", maxWidth: "440px", borderRadius: "24px", padding: "20px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
              <strong style={{ fontSize: "16px", color: "var(--text-main)" }}>🗓️ Calendário de Confrontos</strong>
              <button onClick={() => setModalAberto(false)} style={{ background: "var(--bg-input)", border: "none", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", color: "var(--text-main)", fontWeight: "bold" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
              {proximosJogos.length === 0 ? (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>Nenhum jogo futuro mapeado no momento.</p>
              ) : (
                proximosJogos.map((jogo, index) => (
                  <div key={index} className="rank-card" style={{ padding: "12px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center", flexShrink: 0 }}>
                      <img src={jogo.logoCasaUrl} alt={jogo.timeCasa} style={{ width: "24px", height: "24px", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).src = "https://s.sde.globo.com/media/organizations/default_60x60.png" }} />
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>x</span>
                      <img src={jogo.logoForaUrl} alt={jogo.timeFora} style={{ width: "24px", height: "24px", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).src = "https://s.sde.globo.com/media/organizations/default_60x60.png" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: "13px", fontWeight: 800, margin: 0, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{jogo.timeCasa} x {jogo.timeFora}</h4>
                      <span style={{ fontSize: "11px", color: "var(--crf-red)", fontWeight: 700, display: "block" }}>🏆 {jogo.campeonato}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>🕒 {formatarDataBr(jogo.data)} • 📺 {jogo.transmissao}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 📋 PASSO A PASSO REGRAS */}
      <section id="como-participar" className="how-section" style={{ padding: "18px 16px", margin: "12px 0" }}>
        <div className="how-header" style={{ marginBottom: "14px" }}>
          <span className="section-kicker" style={{ fontSize: "12px" }}>⚽ Como Participar</span>
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>Siga as etapas no Telegram</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { num: "01", t: "Aguarde a Escalação", p: "O bot publica automaticamente o card oficial do bolão no canal @Flamengo77." },
            { num: "02", t: "Comente seu Placar", p: "Envie seu palpite de placar exato direto nos comentários da postagem do jogo." },
            { num: "03", t: "Validação por Reação", p: "O bot vai reagir com um joinha (👍) no seu comentário para confirmar sua participação activa." },
            { num: "04", t: "Resultado e Ranking", p: "Após o fim do jogo, todos os acertos são reunidos, postados pelo bot e computados na tabela." }
          ].map((item, i) => (
            <div key={i} className="rank-card" style={{ padding: "10px 14px", borderRadius: "14px" }}>
              <div className="rank-left" style={{ gap: "10px" }}>
                <div className="rank-position" style={{ width: "32px", height: "32px", borderRadius: "8px", color: "var(--crf-red)", fontWeight: 900, fontSize: "12px" }}>{item.num}</div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{item.t}</h3>
                  <p style={{ fontSize: "11px", margin: "1px 0 0 0", lineHeight: "1.3", color: "var(--text-muted)" }}>{item.p}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏆 RANKING PRINCIPAL */}
      <section id="ranking" className="ranking-wrapper" style={{ marginTop: "12px" }}>
        <div className="ranking-heading" style={{ paddingLeft: "4px", marginBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 900, color: "var(--text-main)" }}>Tabela Geral</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Classificação de torcedores atualizada automaticamente.</p>
          </div>
        </div>
        <RankingClient />
      </section>

      <footer className="site-footer" style={{ marginTop: "24px", marginBottom: "20px", fontSize: "12px" }}>
        <span>Desenvolvido para a Nação Rubro-Negra</span>
        <strong>⚫🔴 FLAMENGO GOLS</strong>
      </footer>

      {/* 📱 NAVIGATION BAR ESTILO TELEGRAM FIXA NO RODAPÉ */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "500px",
        background: "var(--bg-card, #121212)",
        borderTop: "1px solid var(--border-color, #222)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        padding: "8px 0 max(12px, env(safe-area-inset-bottom)) 0",
        zIndex: 1000,
        backdropFilter: "blur(10px)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.4)"
      }}>
        {/* 1. PALPITAR (Com Notificação Vermelha Ativa) */}
        <a href="https://t.me/flamengogolsbot" target="_blank" rel="noreferrer" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "inherit", position: "relative" }}>
          <div style={{ padding: "4px 20px", borderRadius: "16px", background: "rgba(204, 20, 20, 0.15)", display: "flex", alignItems: "center", justifyCenter: "center", marginBottom: "4px" }}>
            <span style={{ fontSize: "20px" }}>🤖</span>
            <span style={{ position: "absolute", top: "-2px", right: "22%", background: "var(--crf-red, #cc1414)", color: "#fff", fontSize: "9px", fontWeight: 900, borderRadius: "10px", padding: "1px 5px", minWidth: "18px", textAlign: "center", border: "2px solid var(--bg-card, #121212)" }}>
              ON
            </span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-main)" }}>Palpitar</span>
        </a>

        {/* 2. REGRAS */}
        <a href="#como-participar" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "inherit" }}>
          <div style={{ padding: "4px 20px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
            <span style={{ fontSize: "20px" }}>⚽</span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Regras</span>
        </a>

        {/* 3. TABELA */}
        <a href="#ranking" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "inherit" }}>
          <div style={{ padding: "4px 20px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
            <span style={{ fontSize: "20px" }}>📊</span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Tabela</span>
        </a>

        {/* 4. TEMA */}
        <button onClick={toggleTheme} style={{ background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", padding: 0, cursor: "pointer", width: "100%", color: "inherit" }}>
          <div style={{ padding: "4px 20px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
            <span style={{ fontSize: "20px" }}>{isDarkMode ? "☀️" : "🌙"}</span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>{isDarkMode ? "Claro" : "Escuro"}</span>
        </button>
      </div>

    </main>
  )
}
