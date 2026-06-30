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
  const [logoCasaUrl, setLogoCasaUrl] = useState("https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png")
  const [timeFora, setTimeFora] = useState("PALMEIRAS")
  const [logoForaUrl, setLogoForaUrl] = useState("https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png")
  
  const [dataJogo, setDataJogo] = useState("") 
  const [campeonato, setCampeonato] = useState("")
  const [rodada, setRodada] = useState("")
  const [transmissao, setTransmissao] = useState("") 

  // 🗓️ ESTADOS DA AGENDA DE JOGOS FUTUROS
  const [proximosJogos, setProximosJogos] = useState<JogoFuturo[]>([])
  
  // Form de adição de jogo futuro
  const [fTimeCasa, setFTimeCasa] = useState("FLAMENGO")
  const [fLogoCasaUrl, setFLogoCasaUrl] = useState("https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png")
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
    setFLogoCasaUrl("https://s.sde.globo.com/media/organizations/2018/04/10/flamengo_60x60.png")
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

  // 🚀 FUNÇÃO MASTER: PUXA O JOGO DA AGENDA DIRETO PARA O TOPO DO CRONÔMETRO
  const promoverParaPrincipal = (index: number) => {
    const jogo = proximosJogos[index]
    
    setTimeCasa(jogo.timeCasa)
    setLogoCasaUrl(jogo.logoCasaUrl)
    setTimeFora(jogo.timeFora)
    setLogoForaUrl(jogo.logoForaUrl)
    setCampeonato(jogo.campeonato)
    setRodada(jogo.rodada)
    setTransmissao(jogo.transmissao)
    setDataJogo(jogo.data.slice(0, 16))

    // Remove ele automaticamente da lista de espera (já que virou o principal)
    setProximosJogos(proximosJogos.filter((_, i) => i !== index))
    alert(`⚡ ${jogo.timeCasa} x ${jogo.timeFora} foi movido para o Bloco Principal. Clique no botão vermelho abaixo para salvar no servidor!`)
  }

  const handleSalvarGeral = async () => {
    if (!timeCasa || !timeFora || !dataJogo) return alert("Os campos do jogo principal são obrigatórios!")
    setEnviando(true)

    const dataFormatada = dataJogo.length === 16 ? `${dataJogo}:00` : dataJogo

    try {
      const res = await fetch("/api/proximo-jogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeCasa, logoCasaUrl, timeFora, logoForaUrl, data: dataFormatada, campeonato, rodada, transmissao, proximos: proximosJogos, senha })
      })
      if ((await res.json()).ok) alert("🚨 Configurações da fila atualizadas e salvas com sucesso!")
    } catch {
      alert("Erro de comunicação com o servidor.")
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return <div style={{ color: "var(--text-main)", padding: "60px 20px", textAlign: "center" }}>Carregando...</div>

  return (
    <main style={{ maxWidth: "500px", margin: "0 auto", padding: "20px 12px", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "var(--bg-main)" }}>
      
      {!isAutenticado ? (
        <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "24px", border: "1px solid var(--border-color)" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text-main)", marginBottom: "12px" }}>🔒 ÁREA RESTRITA</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={inputStyles} placeholder="Chave mestre..." />
            <button type="submit" style={{ width: "100%", background: "var(--text-main)", color: "var(--bg-card)", border: "none", padding: "14px", borderRadius: "12px", fontWeight: 800 }}>Acessar</button>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ background: "var(--bg-card)", borderRadius: "20px", padding: "14px 20px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: "15px", color: "var(--text-main)" }}>⚙️ Central Flamengo Gols</strong>
            <button onClick={handleLogout} style={{ background: "rgba(204,20,20,0.08)", border: "none", color: "var(--crf-red)", fontSize: "12px", fontWeight: 800, padding: "6px 14px", borderRadius: "8px" }}>Sair</button>
          </div>

          {/* JOGO ATIVO */}
          <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "20px", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 900, marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", color: "var(--text-main)" }}>⚔️ Jogo Ativo no Cronômetro</h2>
            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>Mandante (Casa)</label><input type="text" value={timeCasa} onChange={(e) => setTimeCasa(e.target.value)} style={inputStyles} /></div>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>URL Logo Mandante</label><input type="text" value={logoCasaUrl} onChange={(e) => setLogoCasaUrl(e.target.value)} style={inputStyles} /></div>
            </div>
            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>Visitante (Fora)</label><input type="text" value={timeFora} onChange={(e) => setTimeFora(e.target.value)} style={inputStyles} /></div>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>URL Logo Visitante</label><input type="text" value={logoForaUrl} onChange={(e) => setLogoForaUrl(e.target.value)} style={inputStyles} /></div>
            </div>
            <label style={labelStyles}>Campeonato</label><input type="text" value={campeonato} onChange={(e) => setCampeonato(e.target.value)} style={inputStyles} />
            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>Rodada</label><input type="text" value={rodada} onChange={(e) => setRodada(e.target.value)} style={inputStyles} /></div>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>Transmissão</label><input type="text" value={transmissao} onChange={(e) => setTransmissao(e.target.value)} style={inputStyles} /></div>
            </div>
            <label style={labelStyles}>Data e Hora do Jogo</label><input type="datetime-local" value={dataJogo} onChange={(e) => setDataJogo(e.target.value)} style={{ ...inputStyles, colorScheme: isDarkMode ? "dark" : "light" }} />
          </div>

          {/* ADICIONAR AGENDA */}
          <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "20px", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 900, marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", color: "var(--text-main)" }}>🗓️ Adicionar Confronto Futuro na Agenda</h2>
            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>Mandante (Casa)</label><input type="text" value={fTimeCasa} onChange={(e) => setFTimeCasa(e.target.value)} style={inputStyles} /></div>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>URL Logo Mandante</label><input type="text" value={fLogoCasaUrl} onChange={(e) => setFLogoCasaUrl(e.target.value)} style={inputStyles} /></div>
            </div>
            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>Visitante (Fora)</label><input type="text" value={fTimeFora} onChange={(e) => setFTimeFora(e.target.value)} style={inputStyles} /></div>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>URL Logo Visitante</label><input type="text" value={fLogoForaUrl} onChange={(e) => setFLogoForaUrl(e.target.value)} style={inputStyles} /></div>
            </div>
            <label style={labelStyles}>Campeonato</label><input type="text" value={fCampeonato} onChange={(e) => setFCampeonato(e.target.value)} style={inputStyles} />
            <div style={responsiveGridStyles}>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>Rodada</label><input type="text" value={fRodada} onChange={(e) => setFRodada(e.target.value)} style={inputStyles} /></div>
              <div style={{ flex: "1 1 200px" }}><label style={labelStyles}>Transmissão</label><input type="text" value={fTransmissao} onChange={(e) => setFTransmissao(e.target.value)} style={inputStyles} /></div>
            </div>
            <label style={labelStyles}>Data Futura</label><input type="datetime-local" value={fData} onChange={(e) => setFData(e.target.value)} style={{ ...inputStyles, colorScheme: isDarkMode ? "dark" : "light" }} />
            <button onClick={adicionarJogoAgenda} style={{ width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-main)", padding: "12px", borderRadius: "10px", fontWeight: 850, fontSize: "12px", cursor: "pointer" }}>➕ Inserir Jogo na Agenda de Espera</button>
          </div>

          {/* JOGOS SALVOS (COM BOTÃO DE PROMOVER ATIVO) */}
          <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "20px", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 900, marginBottom: "12px", color: "var(--text-main)" }}>📋 Fila de Espera Atual ({proximosJogos.length} de 5)</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {proximosJogos.length === 0 ? (
                <div style={{ padding: "14px", border: "1px dashed var(--border-color)", borderRadius: "12px", textAlign: "center", fontSize: "12px", color: "var(--text-muted)" }}>Nenhum jogo futuro mapeado.</div>
              ) : (
                proximosJogos.map((jogo, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-input)", padding: "10px 12px", borderRadius: "12px", border: "1px solid var(--border-color)", gap: "10px" }}>
                    <div style={{ flex: 1, minWidth: 0, fontSize: "12px" }}>
                      <strong style={{ color: "var(--text-main)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{jogo.timeCasa} x {jogo.timeFora}</strong>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "11px", marginTop: "2px" }}>{jogo.campeonato}</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      {/* ✨ BOTÃO DE ATALHO DE FLUXO ROLANTE */}
                      <button onClick={() => promoverParaPrincipal(idx)} style={{ background: "rgba(46,125,50,0.08)", border: "none", color: "#2e7d32", fontWeight: 800, fontSize: "11px", cursor: "pointer", padding: "6px 10px", borderRadius: "6px" }}>Promover</button>
                      <button onClick={() => removerJogoAgenda(idx)} style={{ background: "transparent", border: "none", color: "var(--crf-red)", fontWeight: 800, fontSize: "11px", cursor: "pointer", padding: "6px" }}>Remover</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button onClick={handleSalvarGeral} disabled={enviando} style={{ width: "100%", background: "linear-gradient(135deg, #cc1414, #990f0f)", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontSize: "13px", fontWeight: 900, boxShadow: "0 6px 20px rgba(204, 20, 20, 0.25)", cursor: "pointer" }}>
            {enviando ? "Sincronizando Fila..." : "💾 GRAVAR CONFIGURAÇÕES DO BOLÃO"}
          </button>
        </div>
      )}
    </main>
  )
}

const labelStyles: React.CSSProperties = { fontSize: "10px", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase" }
const inputStyles: React.CSSProperties = { width: "100%", padding: "11px 14px", background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-main)", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", marginTop: "4px", marginBottom: "12px", outline: "none", fontFamily: "inherit" }
const responsiveGridStyles: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "0 10px" }
