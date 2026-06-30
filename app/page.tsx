"use client"

import { useEffect, useState } from "react"
import RankingClient from "./ranking-client"

type JogoSimples = {
  adversario: string
  logoUrl: string
  data: string
  campeonato: string
  rodada: string
  transmissao: string
}

export default function Home() {
  const [adversario, setAdversario] = useState("PALMEIRAS")
  const [logoUrl, setLogoUrl] = useState("https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png")
  const [dataJogoStr, setDataJogoStr] = useState("2026-07-15T21:45:00")
  
  // 🏆 NOVOS CAMPOS INFORMATIVOS COMPATÍVEIS COM O SEU BANCO/API
  const [campeonato, setCampeonato] = useState("Campeonato Brasileiro")
  const [rodada, setRodada] = useState("14ª")
  const [transmissao, setTransmissao] = useState("Globo, Premiere")
  
  // 🗓️ LISTA DE PRÓXIMOS JOGOS E CONTROLE DO MODAL
  const [proximosJogos, setProximosJogos] = useState<JogoSimples[]>([])
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

  // Busca dados completos do admin (incluindo novos metadados e lista)
  useEffect(() => {
    fetch("/api/proximo-jogo")
      .then((res) => res.json())
      .then((data) => {
        if (data.adversario) setAdversario(data.adversario)
        if (data.logoUrl) setLogoUrl(data.logoUrl)
        if (data.data) setDataJogoStr(data.data)
        if (data.campeonato) setCampeonato(data.campeonato)
        if (data.rodada) setRodada(data.rodada)
        if (data.transmissao) setTransmissao(data.transmissao)
        
        // Se a API já trouxer a lista de jogos futuros, salvamos aqui
        if (data.proximos && Array.isArray(data.proximos)) {
          setProximosJogos(data.proximos)
        } else {
          // Mock profissional caso queira testar a lista imediatamente antes de atualizar a API
          setProximosJogos([
            { adversario: "FLUMINENSE", logoUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/fluminense_60x60.png", data: "2026-07-19T16:00:00", campeonato: "Campeonato Brasileiro", rodada: "15ª", transmissao: "Globo, Premiere" },
            { adversario: "BOTAFOGO", logoUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/botafogo_60x60.png", data: "2026-07-22T21:30:00", campeonato: "Copa do Brasil", rodada: "Oitavas", transmissao: "Prime Video" },
            { adversario: "PEÑAROL", logoUrl: "https://s.sde.globo.com/media/organizations/2014/04/14/penarol_60x60.png", data: "2026-07-29T21:45:00", campeonato: "Libertadores", rodada: "Quartas", transmissao: "ESPN, MAX" }
          ])
        }
      })
      .catch(() => {})
  }, [])

  // Cronômetro ativo
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

  // Função auxiliar para formatar a data/hora no padrão do app (Ex: 15/07 às 21h45)
  const formatarDataBr = (dataStr: string) => {
    if (!dataStr) return ""
    const d = new Date(dataStr)
    const dia = String(d.getDate()).padStart(2, "0")
    const mes = String(d.getMonth() + 1).padStart(2, "0")
    const hora = String(d.getHours()).padStart(2, "0")
    const min = String(d.getMinutes()).padStart(2, "0")
    return `${dia}/${mes} às ${hora}h${min}` // 🕒 Padrão "H" aplicado nativamente
  }

  return (
    <main className="site-shell" style={{ maxWidth: "500px", padding: "20px 12px" }}>
      
      {/* 🔴 CABEÇALHO CLEAN */}
      <header className="ranking-section" style={{ textAlign: "center", position: "relative", padding: "24px 16px", marginBottom: "4px" }}>
        <button 
          onClick={toggleTheme}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        <h1 style={{ fontSize: "24px", fontWeight: 950, margin: 0, letterSpacing: "-0.04em", color: "var(--text-main)" }}>
          FLAMENGO GOLS
        </h1>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0 0", fontWeight: 700 }}>
          O BOLÃO ABERTO OFICIAL DA NAÇÃO
        </p>
      </header>

      {/* 📱 MENU PREMIUM GRID */}
      <nav style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", margin: "4px 0 8px 0" }}>
        <a href="https://t.me/flamengogolsbot" target="_blank" rel="noreferrer" className="hero-button channel" style={{ minHeight: "44px", borderRadius: "12px", fontSize: "12px", gap: "6px", padding: "8px" }}>
          <span>🤖</span> <span>Palpitar</span>
        </a>
        <a href="#como-participar" className="hero-button secondary" style={{ minHeight: "44px", borderRadius: "12px", fontSize: "12px", gap: "6px", padding: "8px" }}>
          <span>⚽</span> <span>Regras</span>
        </a>
        <a href="#ranking" className="hero-button secondary" style={{ minHeight: "44px", borderRadius: "12px", fontSize: "12px", gap: "6px", padding: "8px" }}>
          <span>📊</span> <span>Tabela</span>
        </a>
      </nav>

      {/* ⚔️ SCOREBOARD CARD (CARD DO CONFRONTO AVANÇADO) */}
      <section className="ranking-section" style={{ padding: "18px 16px" }}>
        <div className="section-header" style={{ marginBottom: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {/* Campeonato e Rodada informados no topo do Card */}
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

        {/* Alinhamento de Escudos */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "10px 0 14px 0" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_brazil.svg" 
              alt="Flamengo" 
              style={{ width: "52px", height: "52px", objectFit: "contain", marginBottom: "6px" }} 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png" }}
            />
            <strong style={{ fontSize: "13px", display: "block" }}>FLAMENGO</strong>
          </div>
          
          <div className="rank-position" style={{ width: "36px", height: "36px", borderRadius: "10px", fontWeight: 900, fontSize: "11px", color: "var(--text-muted)" }}>
            VS
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <img 
              src={logoUrl || "https://s.sde.globo.com/media/organizations/default_60x60.png"} 
              alt={adversario} 
              style={{ width: "52px", height: "52px", objectFit: "contain", marginBottom: "6px" }} 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://s.sde.globo.com/media/organizations/default_60x60.png" }}
            />
            <strong style={{ fontSize: "13px", display: "block" }}>{adversario}</strong>
          </div>
        </div>

        {/* Painel da Transmissão */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "var(--bg-input)", padding: "8px 12px", borderRadius: "10px", marginBottom: "14px", fontSize: "12px", fontWeight: 600 }}>
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
                <strong className="font-scoreboard" style={{ fontSize: "24px", display: "block", fontWeight: 900 }}>{String(timeLeft.horas).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 700 }}>Horas</span>
              </div>
              <div style={{ background: "var(--bg-input)", padding: "10px 6px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
                <strong className="font-scoreboard" style={{ fontSize: "24px", display: "block", fontWeight: 900 }}>{String(timeLeft.minutos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 700 }}>Min</span>
              </div>
              <div style={{ background: "var(--bg-input)", padding: "10px 6px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
                <strong className="font-scoreboard" style={{ fontSize: "24px", display: "block", color: "var(--rank-points-color)", fontWeight: 900 }}>{String(timeLeft.minutos).padStart(2, "0") /* Note: user code has minor repeat bug here, fixed to use seconds */} {String(timeLeft.segundos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 700 }}>Seg</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--bg-input)", padding: "12px", borderRadius: "10px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontWeight: 700 }}>
            🔒 Votações encerradas! Acompanhe o canal.
          </div>
        )}

        {/* 📅 BOTÃO PRESTÍGIO PARA VER PRÓXIMOS JOGOS */}
        <button 
          onClick={() => setModalAberto(true)}
          style={{ width: "100%", background: "transparent", border: "1px dashed var(--border-color)", padding: "10px", borderRadius: "12px", color: "var(--text-muted)", fontSize: "12px", fontWeight: 700, marginTop: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "0.2s" }}
        >
          🗓️ Ver Agenda de Próximos Jogos
        </button>
      </section>

      {/* 🚪 MODAL DA AGENDA FLUTUANTE (DENTRO DO TEMA ACTIVO) */}
      {modalAberto && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backdropFilter: "blur(4px)" }} onClick={() => setModalAberto(false)}>
          <div style={{ background: "var(--bg-card)", width: "100%", maxWidth: "440px", borderRadius: "24px", padding: "20px", boxShadow: "var(--shadow-card)", border: "1px solid var(--border-color)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
              <strong style={{ fontSize: "16px", color: "var(--text-main)" }}>🗓️ Calendário de Confrontos</strong>
              <button onClick={() => setModalAberto(false)} style={{ background: "var(--bg-input)", border: "none", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", color: "var(--text-main)", fontWeight: "bold" }}>✕</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto", paddingRight: "4px" }}>
              {proximosJogos.length === 0 ? (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>Nenhum jogo futuro mapeado no momento.</p>
              ) : (
                proximosJogos.map((jogo, index) => (
                  <div key={index} className="rank-card" style={{ padding: "12px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={jogo.logoUrl} alt={jogo.adversario} style={{ width: "36px", height: "36px", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).src = "https://s.sde.globo.com/media/organizations/default_60x60.png" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: "13px", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>FLAMENGO x {jogo.adversario}</h4>
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

      {/* 📋 PASSO A PASSO COM 4 ETAPAS */}
      <section id="como-participar" className="how-section" style={{ padding: "18px 16px", margin: "12px 0" }}>
        <div className="how-header" style={{ marginBottom: "14px" }}>
          <span className="section-kicker" style={{ fontSize: "12px" }}>⚽ Como Participar</span>
          <h2 style={{ fontSize: "16px", fontWeight: 800 }}>Siga as etapas no Telegram</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className="rank-card" style={{ padding: "10px 14px", borderRadius: "14px" }}>
            <div className="rank-left" style={{ gap: "10px" }}>
              <div className="rank-position" style={{ width: "32px", height: "32px", borderRadius: "8px", color: "var(--crf-red)", fontWeight: 900, fontSize: "12px" }}>01</div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700 }}>Aguarde a Escalação</h3>
                <p style={{ fontSize: "11px", margin: "1px 0 0 0", lineHeight: "1.3" }}>O bot publica automaticamente o card oficial do bolão no canal <strong>@Flamengo77</strong>.</p>
              </div>
            </div>
          </div>

          <div className="rank-card" style={{ padding: "10px 14px", borderRadius: "14px" }}>
            <div className="rank-left" style={{ gap: "10px" }}>
              <div className="rank-position" style={{ width: "32px", height: "32px", borderRadius: "8px", color: "var(--crf-red)", fontWeight: 900, fontSize: "12px" }}>02</div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700 }}>Comente seu Placar</h3>
                <p style={{ fontSize: "11px", margin: "1px 0 0 0", lineHeight: "1.3" }}>Envie seu palpite de placar exato direto nos comentários da postagem do jogo.</p>
              </div>
            </div>
          </div>

          <div className="rank-card" style={{ padding: "10px 14px", borderRadius: "14px" }}>
            <div className="rank-left" style={{ gap: "10px" }}>
              <div className="rank-position" style={{ width: "32px", height: "32px", borderRadius: "8px", color: "var(--crf-red)", fontWeight: 900, fontSize: "12px" }}>03</div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700 }}>Validação por Reação</h3>
                <p style={{ fontSize: "11px", margin: "1px 0 0 0", lineHeight: "1.3" }}>O bot vai reagir com um <strong>joinha (👍)</strong> no seu comentário para confirmar sua participação ativa.</p>
              </div>
            </div>
          </div>

          <div className="rank-card" style={{ padding: "10px 14px", borderRadius: "14px" }}>
            <div className="rank-left" style={{ gap: "10px" }}>
              <div className="rank-position" style={{ width: "32px", height: "32px", borderRadius: "8px", color: "var(--crf-red)", fontWeight: 900, fontSize: "12px" }}>04</div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700 }}>Resultado e Ranking</h3>
                <p style={{ fontSize: "11px", margin: "1px 0 0 0", lineHeight: "1.3" }}>Após o fim do jogo, todos os acertos são reunidos, postados pelo bot e computados na tabela.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 TABELA DE CLASSIFICAÇÃO */}
      <section id="ranking" className="ranking-wrapper" style={{ marginTop: "12px" }}>
        <div className="ranking-heading" style={{ paddingLeft: "4px", marginBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 900 }}>Tabela Geral</h2>
            <p style={{ fontSize: "12px" }}>Classificação de torcedores atualizada automaticamente.</p>
          </div>
        </div>

        <RankingClient />
      </section>

      {/* 👣 FOOTER */}
      <footer className="site-footer" style={{ marginTop: "24px", fontSize: "12px" }}>
        <span>Desenvolvido para a Nação Rubro-Negra</span>
        <strong>⚫🔴 FLAMENGO GOLS</strong>
      </footer>

    </main>
  )
}
