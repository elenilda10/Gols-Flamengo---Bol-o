"use client"

import type React from "react"
import { useState, useEffect } from "react"

export default function AdminPainel() {
  const [senha, setSenha] = useState("")
  const [isAutenticado, setIsAutenticado] = useState(false)
  
  const [adversario, setAdversario] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [dataJogo, setDataJogo] = useState("") 
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
        setAdversario(data.adversario || "")
        setLogoUrl(data.logoUrl || "")
        if (data.data) {
          setDataJogo(data.data.slice(0, 16)) 
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adversario || !logoUrl || !dataJogo) return alert("Preencha todos os campos antes de salvar!")
    setEnviando(true)

    const dataFormatada = dataJogo.length === 16 ? `${dataJogo}:00` : dataJogo

    try {
      const res = await fetch("/api/proximo-jogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          adversario: adversario.toUpperCase().trim(), 
          logoUrl: logoUrl.trim(), 
          data: dataFormatada, 
          senha 
        })
      })
      const resultado = await res.json()
      
      if (resultado.ok) {
        alert("🚨 Confronto e contagem regressiva sincronizados com sucesso!")
      } else {
        alert("Erro ao salvar: " + resultado.error)
        if (res.status === 401) handleLogout()
      }
    } catch {
      alert("Erro crítico ao tentar conectar com o servidor da aplicação.")
    } finally {
      setEnviando(false)
    }
  }

  if (loading) {
    return (
      <div style={{ color: "var(--text-main)", padding: "60px 20px", textAlign: "center" }}>
        <strong style={{ display: "block", fontSize: "16px" }}>Carregando Painel do Controlador...</strong>
      </div>
    )
  }

  return (
    <main style={{ maxWidth: "460px", margin: "0 auto", padding: "40px 14px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      
      {!isAutenticado ? (
        <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "28px 24px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "22px" }}>🔒</span>
            <h1 style={{ fontSize: "20px", fontWeight: 900, margin: 0, letterSpacing: "-0.04em", color: "var(--text-main)" }}>ÁREA RESTRITA</h1>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 24px 0", lineHeight: "1.5" }}>
            Este painel modifica o cronômetro oficial do Flamengo Gols. Forneça a credencial de segurança para prosseguir.
          </p>
          
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>Senha de Acesso</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              style={inputStyles} 
              placeholder="Chave mestre da API..." 
            />
            <button type="submit" style={{ width: "100%", background: "var(--text-main)", color: "var(--bg-card)", border: "none", padding: "14px", borderRadius: "12px", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
              Desbloquear Painel
            </button>
          </form>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "28px 24px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)" }}>
          {/* 🏟️ MANAGER FORM (EXIBIDO APÓS AUTENTICAÇÃO) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🏟️</span>
              <h1 style={{ fontSize: "18px", fontWeight: 900, margin: 0, color: "var(--text-main)" }}>CONTROLADOR</h1>
            </div>
            <button onClick={handleLogout} style={{ background: "rgba(204,20,20,0.06)", border: "none", color: "var(--crf-red)", fontSize: "11px", fontWeight: 800, cursor: "pointer", padding: "6px 12px", borderRadius: "8px" }}>
              Sair
            </button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.3px" }}>NOME DO ADVERSÁRIO</label>
            <input type="text" value={adversario} onChange={(e) => setAdversario(e.target.value)} style={inputStyles} placeholder="Ex: PALMEIRAS" />

            <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.3px" }}>URL DA LOGO DO RIVAL (GE)</label>
            <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} style={inputStyles} placeholder="https://s.sde.globo.com/media/..." />

            <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.3px" }}>DATA E HORA DO CONFRONTO</label>
            <input 
              type="datetime-local" 
              value={dataJogo} 
              onChange={(e) => setDataJogo(e.target.value)} 
              style={{ ...inputStyles, colorScheme: isDarkMode ? "dark" : "light" }} 
            />

            <button type="submit" disabled={enviando} style={{ width: "100%", background: "linear-gradient(135deg, var(--crf-red), #990f0f)", color: "#fff", border: "none", padding: "15px", borderRadius: "12px", fontSize: "14px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(204, 20, 20, 0.2)", marginTop: "10px" }}>
              {enviando ? "Sincronizando Banco de Dados..." : "🚀 Atualizar Confronto Oficial"}
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

const inputStyles: React.CSSProperties = {
  width: "100%", padding: "12px 14px", background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-main)", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", marginTop: "6px", marginBottom: "18px", outline: "none", fontFamily: "inherit", fontWeight: 500
}
