"use client"

import { useEffect, useState } from "react"
import RankingClient from "./ranking-client"

export default function Home() {
  const [adversario, setAdversario] = useState("ADVERSÁRIO")
  const [logoUrl, setLogoUrl] = useState("")
  const [dataJogoStr, setDataJogoStr] = useState("")

  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  const [jogoIniciado, setJogoIniciado] = useState(false)

  // 1. Busca os dados configurados no painel admin
  useEffect(() => {
    fetch("/api/proximo-jogo")
      .then((res) => res.json())
      .then((data) => {
        if (data.adversario) setAdversario(data.adversario)
        if (data.logoUrl) setLogoUrl(data.logoUrl)
        if (data.data) setDataJogoStr(data.data)
      })
  }, [])

  // 2. Roda a contagem regressiva ativa baseada na API
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

  const shellStyles: React.CSSProperties = { maxWidth: "480px", margin: "0 auto", padding: "0 16px 40px 16px", display: "flex", flexDirection: "column", gap: "20px", backgroundColor: "var(--bg-main)" }
  const cardStyles: React.CSSProperties = { background: "var(--bg-card)", borderRadius: "24px", padding: "20px", border: "1px solid var(--border-color)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }
  const menuButtonStyles: React.CSSProperties = { flex: 1, background: "var(--bg-card)", color: "var(--text-main)", padding: "12px", borderRadius: "14px", fontSize: "12px", fontWeight: 700, textAlign: "center", textDecoration: "none", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }
  const timeBoxStyles: React.CSSProperties = { background: "var(--bg-input)", padding: "10px 8px", borderRadius: "12px", flex: 1, textAlign: "center", border: "1px solid rgba(255,255,255,0.02)" }

  return (
    <main style={shellStyles}>
      
      {/* HEADER */}
      <section style={{ ...cardStyles, background: "linear-gradient(135deg, #141417 0%, #050506 100%)", borderBottom: "3px solid var(--crf-red)", marginTop: "20px", textAlign: "center", padding: "24px 20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0, color: "#fff" }}>FLAMENGO GOLS</h1>
      </section>

      {/* MENU */}
      <nav style={{ display: "flex", gap: "8px" }}>
        <a href="https://t.me/flamengogolsbot" target="_blank" rel="noreferrer" style={{ ...menuButtonStyles, background: "linear-gradient(135deg, var(--crf-red), #990f0f)", borderColor: "transparent" }}>
          <span style={{ fontSize: "16px" }}>🤖</span><span style={{ color: "#fff" }}>Dar Palpite</span>
        </a>
        <a href="#como-participar" style={menuButtonStyles}>
          <span style={{ fontSize: "16px" }}>⚽</span><span>Regras</span>
        </a>
        <a href="#ranking" style={menuButtonStyles}>
          <span style={{ fontSize: "16px" }}>📊</span><span>Classificação</span>
        </a>
      </nav>

      {/* CARD DO CONFRONTO COM LOGOS REAIS */}
      <section style={cardStyles}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: 700, margin: 0, color: "var(--text-muted)", textTransform: "uppercase" }}>⚔️ Próximo Confronto</h3>
          <span className="pulse-badge" style={{ background: jogoIniciado ? "rgba(239, 68, 68, 0.1)" : "rgba(52, 199, 89, 0.1)", color: jogoIniciado ? "var(--crf-red)" : "#34c759", fontSize: "10px", fontWeight: 700, padding: "4px 8px", borderRadius: "6px" }}>
            {jogoIniciado ? "Em Andamento" : "Inscrições Abertas"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "5px 0 15px 0" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <img src="https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png" alt="Flamengo" style={{ width: "50px", height: "50px", objectFit: "contain", marginBottom: "6px" }} />
            <strong style={{ fontSize: "13px", display: "block", color: "#fff" }}>FLAMENGO</strong>
          </div>
          
          <div style={{ background: "var(--bg-input)", padding: "6px 14px", borderRadius: "12px", fontWeight: 800, fontSize: "14px", color: "var(--text-muted)" }}>VS</div>

          <div style={{ flex: 1, textAlign: "center" }}>
            {logoUrl ? (
              <img src={logoUrl} alt={adversario} style={{ width: "50px", height: "50px", objectFit: "contain", marginBottom: "6px" }} />
            ) : (
              <div style={{ width: "50px", height: "50px", margin: "0 auto 6px auto", background: "var(--bg-input)", borderRadius: "50%" }} />
            )}
            <strong style={{ fontSize: "13px", display: "block", color: "#fff" }}>{adversario}</strong>
          </div>
        </div>

        {/* CRONÔMETRO */}
        {!jogoIniciado ? (
          <div>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={timeBoxStyles}>
                <strong style={{ fontSize: "18px", display: "block", color: "var(--crf-red)" }}>{String(timeLeft.dias).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>Dias</span>
              </div>
              <div style={timeBoxStyles}>
                <strong style={{ fontSize: "18px", display: "block", color: "#fff" }}>{String(timeLeft.horas).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>Horas</span>
              </div>
              <div style={timeBoxStyles}>
                <strong style={{ fontSize: "18px", display: "block", color: "#fff" }}>{String(timeLeft.minutos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>Min</span>
              </div>
              <div style={timeBoxStyles}>
                <strong style={{ fontSize: "18px", display: "block", color: "var(--crf-gold)" }}>{String(timeLeft.segundos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>Seg</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--bg-input)", padding: "12px", borderRadius: "14px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>
            🔒 Votações encerradas! Acompanhe o resultado.
          </div>
        )}
      </section>

      {/* PASSO A PASSO */}
      <section id="como-participar" style={cardStyles}>
        <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 800, margin: 0, color: "#fff" }}>📋 Passo a Passo para Participar</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ background: "var(--bg-input)", width: "26px", height: "26px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "11px", color: "var(--crf-red)" }}>01</div>
            <div>
              <h4 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "#fff" }}>Aguarde a Escalação</h4>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0", lineHeight: "1.4" }}>Assim que a escalação sai, o bot libera a postagem do bolão nos comentários do canal.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ background: "var(--bg-input)", width: "26px", height: "26px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "11px", color: "var(--crf-red)" }}>02</div>
            <div>
              <h4 style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: "#fff" }}>Comente seu Placar</h4>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0", lineHeight: "1.4" }}>Envie seu palpite de placar exato nos comentários. O bot valida sua participação na mesma hora.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RANKING */}
      <section id="ranking" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 0 4px", color: "#fff" }}>📊 Tabela de Classificação</h2>
        <RankingClient />
      </section>
    </main>
  )
}
