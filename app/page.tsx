import RankingClient from "./ranking-client"

export default function Home() {
  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Flamengo Gols</h1>
          <p style={styles.subtitle}>Ranking geral do bolão</p>
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
      "radial-gradient(circle at top left, rgba(150,0,0,.35), transparent 35%), #050505",
    color: "#fff",
    padding: "28px 18px",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: 760,
    margin: "0 auto",
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 44,
    lineHeight: 1,
    margin: 0,
    fontWeight: 900,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 22,
    color: "#d4d4d8",
  },
  footer: {
    textAlign: "center",
    color: "#71717a",
    marginTop: 28,
  },
}
