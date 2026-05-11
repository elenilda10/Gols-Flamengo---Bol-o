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
            Ranking ao vivo dos palpites da Nação. Participe pelo canal,
            comente seu placar na postagem do bolão e acompanhe aqui quem está
            liderando após cada jogo do Mengão.
          </p>

          <div className="hero-actions">
            <a
              href="https://t.me/flamengo77"
              target="_blank"
              rel="noreferrer"
              className="hero-button primary"
            >
              📢 Ir para o canal
            </a>

            <a href="#ranking" className="hero-button secondary">
              📊 Ver ranking
            </a>
          </div>

          <div className="hero-mini-grid">
            <div className="hero-mini-card">
              <span>📢</span>
              <strong>Postagem do bolão</strong>
              <p>
                Após a escalação, o bot publica o bolão no canal Flamengo Gols.
              </p>
            </div>

            <div className="hero-mini-card">
              <span>💬</span>
              <strong>Palpite nos comentários</strong>
              <p>
                Os participantes deixam o placar nos comentários da postagem.
              </p>
            </div>

            <div className="hero-mini-card">
              <span>✅</span>
              <strong>Conferência automática</strong>
              <p>
                No fim do jogo, o bot confirma os palpites corretos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-strip">
        <div>
          <span>🏆</span>
          <strong>Ganhadores do jogo</strong>
          <p>
            Após a apuração, o bot publica os nomes dos participantes que acertaram.
          </p>
        </div>

        <div>
          <span>🔗</span>
          <strong>Link de resgate</strong>
          <p>
            Os ganhadores recebem uma postagem com link obrigatório para resgatar.
          </p>
        </div>

        <div>
          <span>📈</span>
          <strong>Ranking atualizado</strong>
          <p>
            Cada acerto soma pontos e atualiza a classificação geral do bolão.
          </p>
        </div>
      </section>

      <section id="ranking" className="ranking-wrapper">
        <div className="ranking-heading">
          <div>
            <span className="section-kicker">📊 Classificação geral</span>
            <h2>Ranking do bolão</h2>
          </div>

          <a
            href="https://t.me/flamengo77"
            target="_blank"
            rel="noreferrer"
            className="ranking-heading-link"
          >
            Participar pelo canal →
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
