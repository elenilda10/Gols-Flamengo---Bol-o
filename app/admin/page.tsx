"use client"

import { useState, useEffect } from "react"

export default function AdminPainel() {
  const [adversario, setAdversario] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [dataJogo, setDataJogo] = useState("")
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    fetch("/api/proximo-jogo")
      .then((res) => res.json())
      .then((data) => {
        setAdversario(data.adversario || "")
        setLogoUrl(data.logoUrl || "")
        setDataJogo(data.data || "")
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    try {
      const res = await fetch("/api/proximo-jogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adversario, logoUrl, data: dataJogo })
      })
      const resultado = await res.json()
      if (resultado.ok) {
        alert("🚨 Cronômetro e logos atualizados com sucesso na Vercel!")
      } else {
        alert("Erro: " + resultado.error)
      }
    } catch {
      alert("Falha ao conectar com a API.")
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return <div style={{ color: "#fff", padding: "50px", textAlign: "center" }}>Carregando Painel Administrativo...</div>

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 16px", backgroundColor: "var(--bg-main)", minHeight: "100vh" }}>
      <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "24px", border: "1px solid var(--border-color)" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 20px 0", color: "#fff" }}>🏟️ GERENCIAR CRONÔMETRO</h1>
        
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>NOME DO ADVERSÁRIO</label>
          <input type="text" value={adversario} onChange={(e) => setAdversario(e.target.value)} style={inputStyles} placeholder="Ex: PALMEIRAS" />

          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>URL DA LOGO DO RIVAL (Link de Imagem)</label>
          <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} style={inputStyles} placeholder="Ex: https://s.sde.globo.com/.../palmeiras.png" />

          <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>DATA E HORA DO JOGO</label>
          <input type="text" value={dataJogo} onChange={(e) => setDataJogo(e.target.value)} style={inputStyles} placeholder="Ex: 2026-07-15T21:45:00" />

          <button type="submit" disabled={enviando} style={{ width: "100%", background: "linear-gradient(135deg, var(--crf-red), #990f0f)", color: "#fff", border: "none", padding: "15px", borderRadius: "14px", fontWeight: 700, cursor: "pointer" }}>
            {enviando ? "Atualizando..." : "🚀 Atualizar Dados do Jogo"}
          </button>
        </form>
      </div>
    </main>
  )
}

const inputStyles: React.CSSProperties = {
  width: "100%", padding: "14px", background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "12px", fontSize: "14px", boxSizing: "border-box", marginTop: "6px", marginBottom: "16px"
}
