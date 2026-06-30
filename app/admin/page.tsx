"use client"

import type React from "react"
import { useState, useEffect } from "react"

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

export default function AdminPainel() {
  const [senha, setSenha] = useState("")
  const [isAutenticado, setIsAutenticado] = useState(false)
  
  // 🏟️ ESTADOS DO CONFRONTO PRINCIPAL (CASA x FORA)
  const [timeCasa, setTimeCasa] = useState("FLAMENGO")
  const [logoCasaUrl, setLogoCasaUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_brazil.svg")
  const [timeFora, setTimeFora] = useState("PALMEIRAS")
  const [logoForaUrl, setLogoForaUrl] = useState("https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png")
  
  const [dataJogo, setDataJogo] = useState("") 
  const [campeonato, setCampeonato] = useState("")
  const [rodada, setRodada] = useState("")
  const [transmissao, setTransmissao] = useState("") 

  // 🗓️ ESTADOS DA AGENDA DE JOGOS FUTUROS
  const [proximosJogos, setProximosJogos] = useState<JogoFuturo[]>([])
  
  // Form de adição de jogo futuro com mando de campo flexível
  const [fTimeCasa, setFTimeCasa] = useState("FLAMENGO")
  const [fLogoCasaUrl, setFLogoCasaUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_brazil.svg")
  const [fTimeFora, setFTimeFora] = useState("")
  const [fLogoForaUrl, setFLogoForaUrl] = useState("")
  
  const [fData, setFData] = useState("")
  const [fCampeonato, setFCampeonato] = useState("")
  const [fRodada, setFRodada] = useState("")
  const [fTransmissao, setFTransmissao] = useState("")

  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const tokenSalvo = sessionStorage.getItem("admin_token")
    if (tokenSalvo) {
      setSenha(tokenSalvo)
      setIsAutenticado(true)
    }

    fetch("/api/proximo-jogo")
      .then((res) => res.json())
      .then((data) => {
        if (data.timeCasa) setTimeCasa(data.timeCasa)
        if (data.logoCasaUrl) setLogoCasaUrl(data.logoCasaUrl)
        if (data.timeFora) setTimeFora(data.timeFora)
        if (data.logoForaUrl) setLogoForaUrl(data.logoForaUrl)
        if (data.campeonato) setCampeonato(data.campeonato)
        if (data.rodada) setRodada(data.rodada)
        if (data.transmissao) setTransmissao(data.transmissao)
        if (data.data) setDataJogo(data.data.slice(0, 16))
        if (data.proximos && Array.isArray(data.proximos)) setProximosJogos(data.proximos)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.body.classList.add("dark")
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!senha.trim()) return alert("Por favor, digite a senha de acesso!")
    sessionStorage.setItem("admin_token", senha)
    setIsAutenticado(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token")
    setSenha("")
    setIsAutenticado(false)
  }

  const adicionarJogoAgenda = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fTimeCasa || !fTimeFora || !fData || !fCampeonato) {
      return alert("Preencha Mandante, Visitante, Data e Campeonato do confronto futuro!")
    }

    const novoJogo: JogoFuturo = {
      timeCasa: fTimeCasa.toUpperCase().trim(),
      logoCasaUrl: fLogoCasaUrl.trim() || "https://s.sde.globo.com/media/organizations/default_60x60.png",
      timeFora: fTimeFora.toUpperCase().trim(),
      logoForaUrl: fLogoForaUrl.trim() || "https://s.sde.globo.com/media/organizations/default_60x60.png",
      data: fData.length === 16 ? `${fData}:00` : fData,
      campeonato: fCampeonato.trim(),
      rodada: fRodada.trim(),
      transmissao: fTransmissao.trim() || "A definir"
    }

    setProximosJogos([...proximosJogos, novoJogo])
    
    setFTimeCasa("FLAMENGO")
    setFLogoCasaUrl("https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_brazil.svg")
    setFTimeFora("")
    setFLogoForaUrl("")
    setFData("")
    setFCampeonato("")
    setFRodada("")
    setFTransmissao("")
  }

  const removerJogoAgenda = (indexRemover: number) => {
    setProximosJogos(proximosJogos.filter((_, index) => index !== indexRemover))
  }

  const handleSalvarGeral = async () => {
    if (!timeCasa || !timeFora || !dataJogo) return alert("Os campos do jogo principal são obrigatórios!")
    setEnviando(true)

    const dataFormatada = dataJogo.length === 16 ? `${dataJogo}:00` : dataJogo

    const payload = {
      timeCasa: timeCasa.toUpperCase().trim(),
      logoCasaUrl: logoCasaUrl.trim(),
      timeFora: timeFora.toUpperCase().trim(),
      logoForaUrl: logoForaUrl.trim(),
      data: dataFormatada,
      campeonato: campeonato.trim(),
      rodada: rodada.trim(),
      transmissao: transmissao.trim() || "A definir",
      proximos: proximosJogos,
      senha
    }

    try {
      const res = await fetch("/api/proximo-jogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const resultado = await res.json()
      
      if (resultado.ok) {
        alert("🚨 Configurações gerais salvas e sincronizadas com sucesso!")
      } else {
        alert("Erro ao salvar dados: " + resultado.error)
        if (res.status === 401) handleLogout()
      }
    } catch {
      alert("Erro crítico de comunicação com o servidor.")
    } finally {
      setEnviando(false)
    }
  }

  if (loading) {
    return (
      <div style={{ color: "var(--text-main)", padding: "60px 20px", textAlign: "center", fontFamily: "inherit" }}>
        <strong style={{ display: "block", fontSize: "16px" }}>Carregando Central do Administrador...</strong>
      </div>
    )
  }

  return (
    <main style={{ maxWidth: "500px", margin: "0 auto", padding: "24px 12px", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "var(--bg-main)" }}>
      
      {!isAutenticado ? (
        <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "28px 24px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "22px" }}>🔒</span>
            <h1 style={{ fontSize: "20px", fontWeight: 900, margin: 0, color: "var(--text-main)" }}>ÁREA RESTRITA</h1>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyles}>Senha Administrador</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={inputStyles} placeholder="Chave mestre da API..." />
            <button type="submit" style={{ width: "100%", background: "var(--text-main)", color: "var(--bg-card)", border: "none", padding: "14px", borderRadius: "12px", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
              Desbloquear Painel
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* TOPO LOGOUT */}
          <div style={{ background: "var(--bg-card)", borderRadius: "20px", padding: "14px 20px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: "16px", color: "var(--text-main)" }}>⚙️ Central Flamengo Gols</strong>
            <button onClick={handleLogout} style={{ background: "rgba(204,20,20,0.08)", border: "none", color: "var(--crf-red)", fontSize: "12px", fontWeight: 800, padding: "6px 14px", borderRadius: "8px", cursor: "pointer" }}>Sair</button>
          </div>

          {/* SEÇÃO 1: CONFRONTO PRINCIPAL (DINÂMICO E RESPONSIVO) */}
          <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "24px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 900, margin: "0 0 16px 0", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", color: "var(--text-main)" }}>⚔️ Jogo Principal do Cronômetro</h2>
            
            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={labelStyles}>Time da Casa (Mandante)</label>
                <input type="text" value={timeCasa} onChange={(e) => setTimeCasa(e.target.value)} style={inputStyles} placeholder="Ex: FLAMENGO" />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={labelStyles}>URL Logo Mandante</label>
                <input type="text" value={logoCasaUrl} onChange={(e) => setLogoCasaUrl(e.target.value)} style={inputStyles} placeholder="https://..." />
              </div>
            </div>

            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={labelStyles}>Time de Fora (Visitante)</label>
                <input type="text" value={timeFora} onChange={(e) => setTimeFora(e.target.value)} style={inputStyles} placeholder="Ex: PALMEIRAS" />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={labelStyles}>URL Logo Visitante</label>
                <input type="text" value={logoForaUrl} onChange={(e) => setLogoForaUrl(e.target.value)} style={inputStyles} placeholder="https://..." />
              </div>
            </div>

            <label style={labelStyles}>Campeonato</label>
            <input type="text" value={campeonato} onChange={(e) => setCampeonato(e.target.value)} style={inputStyles} placeholder="Ex: Campeonato Brasileiro" />

            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={labelStyles}>Rodada / Fase</label>
                <input type="text" value={rodada} onChange={(e) => setRodada(e.target.value)} style={inputStyles} placeholder="Ex: 14ª" />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={labelStyles}>Transmissões (Canais)</label>
                <input type="text" value={transmissao} onChange={(e) => setTransmissao(e.target.value)} style={inputStyles} placeholder="Ex: Globo, Premiere, ESPN" />
              </div>
            </div>

            <label style={labelStyles}>Data e Hora do Jogo</label>
            <input type="datetime-local" value={dataJogo} onChange={(e) => setDataJogo(e.target.value)} style={{ ...inputStyles, colorScheme: isDarkMode ? "dark" : "light" }} />
          </div>

          {/* SEÇÃO 2: ADICIONAR À AGENDA FUTURA (MANDO INDEPENDENTE RESOLVIDO) */}
          <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "24px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 900, margin: "0 0 16px 0", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", color: "var(--text-main)" }}>🗓️ Adicionar Jogo à Agenda Futura</h2>
            
            <form onSubmit={adicionarJogoAgenda}>
              <div style={responsiveGridStyles}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={labelStyles}>Mandante (Casa)</label>
                  <input type="text" value={fTimeCasa} onChange={(e) => setFTimeCasa(e.target.value)} style={inputStyles} placeholder="Ex: FLAMENGO" />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={labelStyles}>URL Logo Mandante</label>
                  <input type="text" value={fLogoCasaUrl} onChange={(e) => setFLogoCasaUrl(e.target.value)} style={inputStyles} placeholder="https://..." />
                </div>
              </div>

              <div style={responsiveGridStyles}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={labelStyles}>Visitante (Fora)</label>
                  <input type="text" value={fTimeFora} onChange={(e) => setFTimeFora(e.target.value)} style={inputStyles} placeholder="Ex: BOTAFOGO" />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={labelStyles}>URL Logo Visitante</label>
                  <input type="text" value={fLogoForaUrl} onChange={(e) => setFLogoForaUrl(e.target.value)} style={inputStyles} placeholder="https://..." />
                </div>
              </div>

              <label style={labelStyles}>Campeonato / Competição</label>
              <input type="text" value={fCampeonato} onChange={(e) => setFCampeonato(e.target.value)} style={inputStyles} placeholder="Ex: Copa do Brasil" />

              <div style={responsiveGridStyles}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={labelStyles}>Rodada / Turno</label>
                  <input type="text" value={fRodada} onChange={(e) => setFRodada(e.target.value)} style={inputStyles} placeholder="Ex: Oitavas" />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={labelStyles}>Canais de Transmissão</label>
                  <input type="text" value={fTransmissao} onChange={(e) => setFTransmissao(e.target.value)} style={inputStyles} placeholder="Ex: Prime Video" />
                </div>
              </div>

              <label style={labelStyles}>Data e Hora Futura</label>
              <input type="datetime-local" value={fData} onChange={(e) => setFData(e.target.value)} style={{ ...inputStyles, colorScheme: isDarkMode ? "dark" : "light" }} />

              <button type="submit" style={{ width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-main)", padding: "12px", borderRadius: "10px", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}>
                ➕ Inserir Jogo na Lista Abaixo
              </button>
            </form>
          </div>

          {/* SEÇÃO 3: LISTAGEM DA AGENDA GRAVADA */}
          <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "24px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 900, margin: "0 0 12px 0", color: "var(--text-main)" }}>📋 Agenda de Jogos Gravada ({proximosJogos.length})</h2>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>Jogos que aparecerão no modal da Home. Remova os que já passaram.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {proximosJogos.length === 0 ? (
                <div style={{ padding: "14px", border: "1px dashed var(--border-color)", borderRadius: "12px", textAlign: "center", fontSize: "12px", color: "var(--text-muted)" }}>Nenhum jogo na agenda futura.</div>
              ) : (
                proximosJogos.map((jogo, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-input)", padding: "10px 12px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    <div style={{ flex: 1, minWidth: 0, fontSize: "12px" }}>
                      <strong style={{ color: "var(--text-main)" }}>{jogo.timeCasa} x {jogo.timeFora}</strong>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "11px", marginTop: "2px" }}>{jogo.campeonato} • {jogo.transmissao}</span>
                    </div>
                    <button onClick={() => removerJogoAgenda(index)} style={{ background: "transparent", border: "none", color: "var(--crf-red)", fontWeight: 800, fontSize: "11px", cursor: "pointer", padding: "4px 8px" }}>
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 🚀 BOTÃO MASTER SALVAR GERAL */}
          <button 
            onClick={handleSalvarGeral}
            disabled={enviando}
            style={{ width: "100%", background: "linear-gradient(135deg, var(--crf-red), #990f0f)", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontSize: "14px", fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 20px rgba(204, 20, 20, 0.25)" }}
          >
            {enviando ? "Gravando Dados Globais..." : "💾 GRAVAR CONFIGURAÇÕES DO BOLÃO"}
          </button>

        </div>
      )}
    </main>
  )
}

const labelStyles: React.CSSProperties = { fontSize: "11px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.3px", textTransform: "uppercase" }
const inputStyles: React.CSSProperties = { width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-main)", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", marginTop: "4px", marginBottom: "14px", outline: "none", fontFamily: "inherit", fontWeight: 500 }
const responsiveGridStyles: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "0 10px" }
