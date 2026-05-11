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
              href="https://t.me/flamengogolsbot"
              target="_blank"
              rel="noreferrer"
              className="hero-button primary"
            >
              🤖 Abrir bot
            </a>

            <a
              href="https://t.me/flamengo77"
              target="_blank"
              rel="noreferrer"
              className="hero-button channel"
            >
              📢 Ir para o canal
            </a>

            <a href="#ranking" className="hero-button secondary">
              📊 Ver ranking
            </a>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="how-header">
          <span className="section-kicker">⚽ Como participar</span>
          <h2>O bolão acontece nos comentários do canal</h2>
          <p>
            Após a escalação ser publicada, o bot libera a postagem do bolão.
            Os palpites são feitos diretamente nos comentários dessa postagem.
          </p>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <span className="how-number">01</span>
            <div className="how-icon">📢</div>
            <h3>Postagem do bolão</h3>
            <p>
              O bot publica no canal News Flamengo a postagem oficial do bolão
              após a escalação.
            </p>
          </div>

          <div className="how-card">
            <span className="how-number">02</span>
            <div className="how-icon">💬</div>
            <h3>Palpite nos comentários</h3>
            <p>
              Os participantes deixam o placar nos comentários da postagem
              oficial do jogo.
            </p>
          </div>

          <div className="how-card">
            <span className="how-number">03</span>
            <div className="how-icon">✅</div>
            <h3>Apuração automática</h3>
            <p>
              No fim da partida, o bot confere os palpites certos e confirma os
              ganhadores.
            </p>
          </div>

          <div className="how-card">
            <span className="how-number">04</span>
            <div className="how-icon">🔗</div>
            <h3>Link de resgate</h3>
            <p>
              Os ganhadores recebem uma postagem com link obrigatório para
              concluir o resgate.
            </p>
          </div>
        </div>
      </section>

      <section id="ranking" className="ranking-wrapper">
        <div className="ranking-heading">
          <div>
            <span className="section-kicker">📊 Classificação geral</span>
            <h2>Ranking do bolão</h2>
            <p>
              Cada acerto soma pontos e atualiza a classificação geral da Nação.
            </p>
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
