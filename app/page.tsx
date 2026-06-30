"use client"

import { useEffect, useState } from "react"
import RankingClient from "./ranking-client"

export default function Home() {
  const [adversario, setAdversario] = useState("PALMEIRAS")
  const [logoUrl, setLogoUrl] = useState("https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png")
  const [dataJogoStr, setDataJogoStr] = useState("2026-07-15T21:45:00")

  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  const [jogoIniciado, setJogoIniciado] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

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

      {/* 📱 MENU PREMIUM: GRID HORIZONTAL ESTILO APP */}
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

      {/* ⚔️ SCOREBOARD CARD (CARD DO CONFRONTO) */}
      <section className="ranking-section" style={{ padding: "18px 16px" }}>
        <div className="section-header" style={{ marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>⚔️ Próximo Confronto</h2>
          <span className="pulse-badge live-pill" style={{ background: jogoIniciado ? "rgba(204,20,20,0.08)" : "rgba(46,125,50,0.08)", color: jogoIniciado ? "var(--crf-red)" : "#2e7d32", padding: "4px 10px", fontSize: "11px", fontWeight: 800, borderRadius: "6px", border: "none" }}>
            {jogoIniciado ? "Em Andamento" : "Inscrições Abertas"}
          </span>
        </div>

        {/* Alinhamento Perfeito de Escudos */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "10px 0 20px 0" }}>
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

        {/* Cronômetro com Fonte de Placar Profissional */}
        {!jogoIniciado ? (
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <span style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", textAlign: "center", marginBottom: "10px", letterSpacing: "0.5px" }}>
              ⏳ Fechamento dos palpites em:
            </span>
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
      </section>

      {/* 📋 PASSO A PASSO COMPACTO */}
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
                <p style={{ fontSize: "11px", margin: "1px 0 0 0", lineHeight: "1.3" }}>O bot publica automaticamente o card do jogo nos comentários.</p>
              </div>
            </div>
          </div>

          <div className="rank-card" style={{ padding: "10px 14px", borderRadius: "14px" }}>
            <div className="rank-left" style={{ gap: "10px" }}>
              <div className="rank-position" style={{ width: "32px", height: "32px", borderRadius: "8px", color: "var(--crf-red)", fontWeight: 900, fontSize: "12px" }}>02</div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700 }}>Comente seu Placar</h3>
                <p style={{ fontSize: "11px", margin: "1px 0 0 0", lineHeight: "1.3" }}>Envie seu palpite exato. O bot valida sua entrada de imediato.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 TABELA GERAL */}
      <section id="ranking" className="ranking-wrapper" style={{ marginTop: "12px" }}>
        <div className="ranking-heading" style={{ paddingLeft: "4px", marginBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 900 }}>Tabela Geral</h2>
            <p style={{ fontSize: "12px" }}>Classificação atualizada em tempo real por acertos.</p>
          </div>
        </div>

        <RankingClient />
      </section>

      {/* 👣 FOOTER MINIMALISTA */}
      <footer className="site-footer" style={{ marginTop: "24px", fontSize: "12px" }}>
        <span>Desenvolvido para a Nação Rubro-Negra</span>
        <strong>⚫🔴 FLAMENGO GOLS</strong>
      </footer>

    </main>
  )
}
