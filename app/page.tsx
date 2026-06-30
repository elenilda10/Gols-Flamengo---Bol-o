"use client"

import { useEffect, useState } from "react"
import RankingClient from "./ranking-client"

export default function Home() {
  const [adversario, setAdversario] = useState("PALMEIRAS")
  const [logoUrl, setLogoUrl] = useState("https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png")
  const [dataJogoStr, setDataJogoStr] = useState("2026-07-15T21:45:00")

  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  const [jogoIniciado, setJogoIniciado] = useState(false)
  
  // Estado do Tema (true = Escuro, false = Claro)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // 1. Inicializa o tema salvo no navegador do torcedor
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

  // 2. Função que altera o tema entre Claro e Escuro
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

  // 3. Busca os dados configurados no painel admin
  useEffect(() => {
    fetch("/api/proximo-jogo")
      .then((res) => res.json())
      .then((data) => {
        if (data.adversario) setAdversario(data.adversario)
        if (data.logoUrl) setLogoUrl(data.logoUrl)
        if (data.data) setDataJogoStr(data.data)
      })
      .catch(() => {})
  }, [])

  // 4. Regressão ativa do Cronômetro
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

  return (
    <main className="site-shell" style={{ maxWidth: "520px" }}>
      
      {/* 🔴 CABEÇALHO PRINCIPAL DA PÁGINA */}
      <section className="ranking-section" style={{ textAlign: "center", position: "relative", padding: "30px 20px" }}>
        
        {/* INTERRUPTOR DE TEMA DINÂMICO */}
        <button 
          onClick={toggleTheme}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.2s ease"
          }}
          title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        <h1 style={{ fontSize: "26px", fontWeight: 950, margin: 0, letterSpacing: "-0.04em" }}>
          FLAMENGO GOLS
        </h1>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0 0", fontWeight: 600 }}>
          O Bolão Aberto Oficial da Nação Rubro-Negra
        </p>
      </section>

      {/* 📱 ABAS DO MENU DE NAVEGAÇÃO */}
      <nav className="hero-actions" style={{ marginTop: 0 }}>
        <a href="https://t.me/flamengogolsbot" target="_blank" rel="noreferrer" className="hero-button channel">
          <span>🤖</span> Dar Palpite
        </a>
        <a href="#como-participar" className="hero-button secondary">
          <span>⚽</span> Regras
        </a>
        <a href="#ranking" className="hero-button secondary">
          <span>📊</span> Classificação
        </a>
      </nav>

      {/* ⚔️ CARD DO PRÓXIMO CONFRONTO */}
      <section className="ranking-section">
        <div className="section-header" style={{ marginBottom: "20px" }}>
          <h2>⚔️ Próximo Confronto</h2>
          <span className="pulse-badge live-pill" style={{ background: jogoIniciado ? "rgba(204,20,20,0.1)" : "rgba(46,125,50,0.1)", color: jogoIniciado ? "var(--crf-red)" : "#2e7d32", borderColor: "transparent" }}>
            {jogoIniciado ? "⚽ Em Andamento" : "● Inscrições Abertas"}
          </span>
        </div>

        {/* Escudos e Nomes dos Times */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "10px 0 24px 0" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <img src="https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png" alt="Flamengo" style={{ width: "56px", height: "56px", objectFit: "contain", marginBottom: "8px" }} />
            <strong style={{ fontSize: "14px", display: "block" }}>FLAMENGO</strong>
          </div>
          
          <div className="rank-position" style={{ width: "40px", height: "40px", borderRadius: "10px", fontWeight: 900, fontSize: "13px" }}>
            VS
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <img 
              src={logoUrl || "https://s.sde.globo.com/media/organizations/default_60x60.png"} 
              alt={adversario} 
              style={{ width: "56px", height: "56px", objectFit: "contain", marginBottom: "8px" }} 
              onError={(e) => { (e.target as HTMLImageElement).src = "https://s.sde.globo.com/media/organizations/default_60x60.png" }}
            />
            <strong style={{ fontSize: "14px", display: "block" }}>{adversario}</strong>
          </div>
        </div>

        {/* Painel Numérico do Cronômetro */}
        {!jogoIniciado ? (
          <div>
            <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center", marginBottom: "8px", letterSpacing: "0.5px" }}>
              ⏳ Encerramento dos palpites em:
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ background: "var(--bg-input)", padding: "12px 8px", borderRadius: "14px", flex: 1, textAlign: "center" }}>
                <strong style={{ fontSize: "20px", display: "block", color: "var(--crf-red)", fontWeight: 900 }}>{String(timeLeft.dias).padStart(2, "0")}</strong>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700 }}>Dias</span>
              </div>
              <div style={{ background: "var(--bg-input)", padding: "12px 8px", borderRadius: "14px", flex: 1, textAlign: "center" }}>
                <strong style={{ fontSize: "20px", display: "block", fontWeight: 900 }}>{String(timeLeft.horas).padStart(2, "0")}</strong>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700 }}>Horas</span>
              </div>
              <div style={{ background: "var(--bg-input)", padding: "12px 8px", borderRadius: "14px", flex: 1, textAlign: "center" }}>
                <strong style={{ fontSize: "20px", display: "block", fontWeight: 900 }}>{String(timeLeft.minutos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700 }}>Min</span>
              </div>
              <div style={{ background: "var(--bg-input)", padding: "12px 8px", borderRadius: "14px", flex: 1, textAlign: "center" }}>
                <strong style={{ fontSize: "20px", display: "block", color: "var(--rank-points-color)", fontWeight: 900 }}>{String(timeLeft.segundos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700 }}>Seg</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--bg-input)", padding: "14px", borderRadius: "14px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px", fontWeight: 700 }}>
            🔒 Votações encerradas! A bola já está rolando.
          </div>
        )}
      </section>

      {/* 📋 SEÇÃO INFORMATIVA: PASSO A PASSO */}
      <section id="como-participar" className="how-section" style={{ padding: "20px" }}>
        <div className="how-header" style={{ marginBottom: "16px" }}>
          <span className="section-kicker">⚽ Como Funciona</span>
          <h2 style={{ fontSize: "20px" }}>Participe direto pelo canal do Telegram</h2>
        </div>

        <div className="ranking-list">
          <div className="rank-card" style={{ padding: "12px 16px" }}>
            <div className="rank-left">
              <div className="rank-position" style={{ width: "36px", height: "36px", borderRadius: "10px", color: "var(--crf-red)", fontWeight: 900 }}>01</div>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 700 }}>Aguarde a Escalação</h3>
                <p style={{ fontSize: "12px", margin: "2px 0 0 0" }}>Assim que o elenco oficial sai, o nosso bot libera o card do bolão no canal.</p>
              </div>
            </div>
          </div>

          <div className="rank-card" style={{ padding: "12px 16px" }}>
            <div className="rank-left">
              <div className="rank-position" style={{ width: "36px", height: "36px", borderRadius: "10px", color: "var(--crf-red)", fontWeight: 900 }}>02</div>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 700 }}>Comente seu Placar</h3>
                <p style={{ fontSize: "12px", margin: "2px 0 0 0" }}>Deixe seu palpite exato na postagem. O bot captura seu ID e valida na mesma hora.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 SEÇÃO DO COMPONENTE DO RANKING DINÂMICO */}
      <section id="ranking" className="ranking-wrapper">
        <div className="ranking-heading" style={{ paddingLeft: "4px" }}>
          <div>
            <h2>Tabela Geral</h2>
            <p style={{ fontSize: "13px" }}>Cada placar exato cravado garante pontos na classificação.</p>
          </div>
        </div>

        <RankingClient />
      </section>

      {/* 👣 RODAPÉ */}
      <footer className="site-footer">
        <span>Desenvolvido para a Nação Rubro-Negra</span>
        <strong>⚫🔴 FLAMENGO GOLS</strong>
      </footer>

    </main>
  )
}
