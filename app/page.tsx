import RankingClient from "./ranking-client"

export default function Home() {
  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.hero}>
          <div style={styles.badge}>🔴 Flamengo Gols</div>

          <h1 style={styles.title}>Bolão Rubro-Negro</h1>

          <p style={styles.subtitle}>
            Ranking ao vivo dos palpites da Nação.
          </p>
        </header>

        <RankingClient />

        <footer style={styles.footer}>
          Feito para a Nação Rubro-Negra ⚫🔴
        </footer>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(185,28,28,.45), transparent 32%), radial-gradient(circle at bottom right, rgba(127,29,29,.28), transparent 30%), #030303",
    color: "#fff",
    padding: "26px 16px 38px",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: 760,
    margin: "0 auto",
  },
  hero: {
    padding: "18px 2px 22px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(127,29,29,.42)",
    border: "1px solid rgba(248,113,113,.28)",
    color: "#fecaca",
    borderRadius: 999,
    padding: "8px 13px",
    fontWeight: 900,
    fontSize: 14,
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 46,
    lineHeight: 0.95,
    letterSpacing: "-.06em",
    fontWeight: 1000,
  },
  subtitle: {
    color: "#d4d4d8",
    fontSize: 18,
    lineHeight: 1.45,
    margin: "14px 0 0",
    maxWidth: 430,
  },
  footer: {
    textAlign: "center",
    color: "#71717a",
    marginTop: 26,
    fontSize: 15,
    fontWeight: 700,
  },
}
