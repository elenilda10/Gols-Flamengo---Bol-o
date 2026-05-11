import RankingClient from "./ranking-client"

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="hero-content">
          <div className="hero-topline">
            <span className="brand-pill">🔴 Flamengo Gols</span>
            <span className="live-pill-home">● Bolão ao vivo</span>
          </div>

          <h1>Bolão Rubro-Negro</h1>

          <p>
            Ranking ao vivo dos palpites da Nação. Veja quem está liderando,
            acompanhe os acertos e dispute ponto a ponto após cada jogo do Mengão.
          </p>

          <div className="hero-actions">
            <a
              href="https://t.me/flamengogolsbot"
              target="_blank"
              rel="noreferrer"
              className="hero-button primary"
            >
              🤖 Abrir bot
            </a>

            <a href="#ranking" className="hero-button secondary">
              📊 Ver ranking
            </a>
          </div>

          <div className="hero-mini-grid">
            <div className="hero-mini-card">
              <span>⚽</span>
              <strong>Palpite</strong>
              <p>Envie seu placar no bot.</p>
            </div>

            <div className="hero-mini-card">
              <span>✅</span>
              <strong>Acerto</strong>
              <p>O bot confirma após o jogo.</p>
            </div>

            <div className="hero-mini-card">
              <span>🏆</span>
              <strong>Ranking</strong>
              <p>A classificação atualiza ao vivo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-strip">
        <div>
          <span>🔥</span>
          <strong>Disputa da Nação</strong>
          <p>Participe, acerte o placar e suba na classificação.</p>
        </div>

        <div>
          <span>📸</span>
          <strong>Perfil do torcedor</strong>
          <p>Veja pontos, posição e histórico de acertos.</p>
        </div>

        <div>
          <span>🔴⚫</span>
          <strong>Feito para flamenguistas</strong>
          <p>Visual rubro-negro e ranking direto do bot.</p>
        </div>
      </section>

      <section id="ranking" className="ranking-wrapper">
        <div className="ranking-heading">
          <div>
            <span className="section-kicker">📊 Classificação geral</span>
            <h2>Ranking do bolão</h2>
          </div>

          <a
            href="https://t.me/flamengogolsbot"
            target="_blank"
            rel="noreferrer"
            className="ranking-heading-link"
          >
            Participar pelo bot →
          </a>
        </div>

        <RankingClient />
      </section>

      <footer className="site-footer">
        <span>Feito para a Nação Rubro-Negra</span>
        <strong>⚫🔴 Flamengo Gols</strong>
      </footer>
    </main>
  )
}
