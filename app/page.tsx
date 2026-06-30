"use client"

import { useEffect, useState } from "react"
import RankingClient from "./ranking-client"

export default function Home() {
  // 📋 ESTADOS DINÂMICOS DO JOGO (Podem ser editados pelo painel admin integrado abaixo)
  const [adversario, setAdversario] = useState("PALMEIRAS")
  const [emojiAdversario, setEmojiAdversario] = useState("🐷")
  const [dataJogoStr, setDataJogoStr] = useState("2026-07-01T21:45:00")

  // Estados de controle da contagem regressiva e admin
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  const [jogoIniciado, setJogoIniciado] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  // Inputs temporários do painel admin
  const [inputAdversario, setInputAdversario] = useState(adversario)
  const [inputEmoji, setInputEmoji] = useState(emojiAdversario)
  const [inputData, setInputData] = useState(dataJogoStr)

  // Checa se "?admin=true" está na URL para liberar o painel de edição
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("admin") === "true") {
        setShowAdminPanel(true)
      }
    }
  }, [])

  // Lógica ativa do Cronômetro baseado no estado dataJogoStr
  useEffect(() => {
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
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24))
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60))
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000)

        setTimeLeft({ dias, horas, minutos, segundos })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [dataJogoStr])

  // Função para salvar a nova configuração do jogo em tempo de execução
  const salvarDadosAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setAdversario(inputAdversario.toUpperCase())
    setEmojiAdversario(inputEmoji)
    setDataJogoStr(inputData)
    alert("Dados do próximo jogo atualizados com sucesso na tela!")
  }

  // Estilos Base do Layout Carbono
  const shellStyles: React.CSSProperties = {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "0 16px 40px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    backgroundColor: "var(--bg-main)"
  }

  const cardStyles: React.CSSProperties = {
    background: "var(--bg-card)",
    borderRadius: "24px",
    padding: "20px",
    border: "1px solid var(--border-color)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)"
  }

  const menuButtonStyles: React.CSSProperties = {
    flex: 1,
    background: "var(--bg-card)",
    color: "var(--text-main)",
    padding: "12px",
    borderRadius: "14px",
    fontSize: "12px",
    fontWeight: 700,
    textAlign: "center",
    textDecoration: "none",
    border: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px"
  }

  const timeBoxStyles: React.CSSProperties = {
    background: "var(--bg-input)",
    padding: "10px 8px",
    borderRadius: "12px",
    flex: 1,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.02)"
  }

  return (
    <main style={shellStyles}>
      
      {/* 🔐 PAINEL ADMINISTRATIVO EMBUTIDO DIRECT-ON-SCREEN (Apenas com ?admin=true) */}
      {showAdminPanel && (
        <section style={{ ...cardStyles, border: "2px solid var(--crf-gold)", background: "#1a1610" }}>
          <h3 style={{ fontSize: "14px", color: "var(--crf-gold)", fontWeight: 800, margin: "0 0 12px 0" }}>
            🛠️ Gerenciar Próximo Jogo (Modo Admin)
          </h3>
          <form onSubmit={salvarDadosAdmin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input 
              type="text" 
              placeholder="Nome do Adversário (Ex: Palmeiras)" 
              value={inputAdversario}
              onChange={(e) => setInputAdversario(e.target.value)}
              style={{ width: "100%", padding: "10px", background: "var(--bg-main)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "10px" }}
            />
            <input 
              type="text" 
              placeholder="Emoji do Adversário (Ex: 🐷)" 
              value={inputEmoji}
              onChange={(e) => setInputEmoji(e.target.value)}
              style={{ width: "100%", padding: "10px", background: "var(--bg-main)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "10px" }}
            />
            <input 
              type="text" 
              placeholder="Data e Hora ISO (Ex: 2026-07-01T21:45:00)" 
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              style={{ width: "100%", padding: "10px", background: "var(--bg-main)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "10px" }}
            />
            <button type="submit" style={{ background: "var(--crf-gold)", color: "#000", fontWeight: 700, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
              Atualizar Tela do Jogo
            </button>
          </form>
        </section>
      )}

      {/* 🔴 HEADER FLAMENGO GOLS */}
      <section style={{
        ...cardStyles,
        background: "linear-gradient(135deg, #141417 0%, #050506 100%)",
        borderBottom: "3px solid var(--crf-red)",
        marginTop: "20px",
        textAlign: "center",
        padding: "24px 20px"
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <span style={{
            background: "rgba(204, 20, 20, 0.15)",
            color: "var(--crf-red)",
            fontSize: "10px",
            fontWeight: 800,
            padding: "4px 10px",
            borderRadius: "20px",
            letterSpacing: "1px",
            textTransform: "uppercase"
          }}>
            Plataforma da Nação
          </span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0, color: "#fff" }}>
          FLAMENGO GOLS
        </h1>
      </section>

      {/* 📱 MENU DE NAVEGAÇÃO INTERATIVO */}
      <nav style={{ display: "flex", gap: "8px" }}>
        <a href="https://t.me/flamengogolsbot" target="_blank" rel="noreferrer" style={{ ...menuButtonStyles, background: "linear-gradient(135deg, var(--crf-red), #990f0f)", borderColor: "transparent" }}>
          <span style={{ fontSize: "16px" }}>🤖</span>
          <span style={{ color: "#fff" }}>Dar Palpite</span>
        </a>
        <a href="#como-participar" style={menuButtonStyles}>
          <span style={{ fontSize: "16px" }}>⚽</span>
          <span>Regras</span>
        </a>
        <a href="#ranking" style={menuButtonStyles}>
          <span style={{ fontSize: "16px" }}>📊</span>
          <span>Classificação</span>
        </a>
      </nav>

      {/* ⏱️ CARD DO CONFRONTO COM CRONÔMETRO DINÂMICO */}
      <section style={cardStyles}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: 700, margin: 0, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            ⚔️ Próximo Confronto
          </h3>
          <span className="pulse-badge" style={{
            background: jogoIniciado ? "rgba(239, 68, 68, 0.1)" : "rgba(52, 199, 89, 0.1)",
            color: jogoIniciado ? "var(--crf-red)" : "#34c759",
            fontSize: "10px",
            fontWeight: 700,
            padding: "4px 8px",
            borderRadius: "6px",
            textTransform: "uppercase"
          }}>
            {jogoIniciado ? "Em Andamento" : "Inscrições Abertas"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "10px", padding: "5px 0 15px 0" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "4px" }}>🔴</div>
            <strong style={{ fontSize: "13px", display: "block", color: "#fff", letterSpacing: "0.5px" }}>FLAMENGO</strong>
          </div>
          
          <div style={{ background: "var(--bg-input)", padding: "6px 14px", borderRadius: "12px", fontWeight: 800, fontSize: "14px", color: "var(--text-muted)" }}>
            VS
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "4px" }}>{emojiAdversario}</div>
            <strong style={{ fontSize: "13px", display: "block", color: "#fff", letterSpacing: "0.5px" }}>{adversario}</strong>
          </div>
        </div>

        {!jogoIniciado ? (
          <div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
              ⏳ Fechamento das apostas em:
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={timeBoxStyles}>
                <strong style={{ fontSize: "18px", display: "block", color: "var(--crf-red)" }}>{String(timeLeft.dias).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Dias</span>
              </div>
              <div style={timeBoxStyles}>
                <strong style={{ fontSize: "18px", display: "block", color: "#fff" }}>{String(timeLeft.horas).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Horas</span>
              </div>
              <div style={timeBoxStyles}>
                <strong style={{ fontSize: "18px", display: "block", color: "#fff" }}>{String(timeLeft.minutos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Min</span>
              </div>
              <div style={timeBoxStyles}>
                <strong style={{ fontSize: "18px", display: "block", color: "var(--crf-gold)" }}>{String(timeLeft.segundos).padStart(2, "0")}</strong>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Seg</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--bg-input)", padding: "12px", borderRadius: "14px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600 }}>
            🔒 Votações encerradas! Acompanhe o resultado.
          </div>
        )}
      </section>

      {/* 📋 PASSO A PASSO ATUALIZADO CONFORME AS DIRETRIZES DA ANÁLISE DE CÓDIGO */}
      <section id="como-participar" style={cardStyles}>
        <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 800, margin: 0, color: "#fff" }}>📋 Passo a Passo para Participar</h2>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>Entenda o fluxo correto das postagens oficiais.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ background: "var(--bg-input)", width: "26px", height: "26px", borderRadius: "8px", display: "flex", alignItems: "center", fontWeight: 700, fontSize: "11px", color: "var(--crf-red)", flexShrink: 0, justifyContent: "center" }}>01</div>
            <div>
              <h4 style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 2px 0", color: "#fff" }}>Aguarde a Escalação</h4>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0, lineHeight: "1.4" }}>Assim que a escalação oficial do Flamengo sai, o nosso bot publica automaticamente a postagem do bolão nos comentários do canal.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ background: "var(--bg-input)", width: "26px", height: "26px", borderRadius: "8px", display: "flex", alignItems: "center", fontWeight: 700, fontSize: "11px", color: "var(--crf-red)", flexShrink: 0, justifyContent: "center" }}>02</div>
            <div>
              <h4 style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 2px 0", color: "#fff" }}>Comente seu Placar</h4>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0, lineHeight: "1.4" }}>Abra os comentários da postagem e envie o seu palpite de placar exato. O bot captura seu ID de usuário do Telegram na mesma hora.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ background: "var(--bg-input)", width: "26px", height: "26px", borderRadius: "8px", display: "flex", alignItems: "center", fontWeight: 700, fontSize: "11px", color: "var(--crf-red)", flexShrink: 0, justifyContent: "center" }}>03</div>
            <div>
              <h4 style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 2px 0", color: "#fff" }}>Fim de Jogo e Pontos</h4>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0, lineHeight: "1.4" }}>Após o apito final, o sistema confere quem cravou o placar correto e adiciona +1 ponto para atualizar a classificação geral aqui no site.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 COMPONENTE DO RANKING DINÂMICO */}
      <section id="ranking" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ padding: "0 4px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 800, margin: 0, color: "#fff" }}>📊 Tabela de Classificação</h2>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>Os melhores palpiteiros da Nação ordenados por acertos.</p>
        </div>

        <RankingClient />
      </section>

      {/* 👣 FOOTER */}
      <footer style={{ textAlign: "center", padding: "20px 0 10px 0", borderTop: "1px solid var(--border-color)", marginTop: "10px", display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Desenvolvido para a Nação Rubro-Negra</span>
        <strong style={{ fontSize: "11px", color: "#fff", letterSpacing: "0.5px" }}>⚫🔴 FLAMENGO GOLS</strong>
      </footer>

    </main>
  )
}
