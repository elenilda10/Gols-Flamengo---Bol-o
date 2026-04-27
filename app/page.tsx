type RankingItem = {
  id?: string;
  uid?: string;
  nome?: string;
  name?: string;
  pontos?: number;
  total?: number;
  acertos?: string[];
};

type RankingResponse = {
  ok?: boolean;
  ranking?: RankingItem[];
  data?: RankingItem[] | {
    ranking?: RankingItem[];
  };
};

async function getRanking(): Promise<RankingItem[]> {
  const apiUrl = process.env.RANKING_API_URL;

  if (!apiUrl) {
    return [];
  }

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data: RankingResponse | RankingItem[] = await res.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.ranking)) {
      return data.ranking;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }

    if (data.data && Array.isArray(data.data.ranking)) {
      return data.data.ranking;
    }

    return [];
  } catch {
    return [];
  }
}

function getUserId(item: RankingItem, index: number) {
  return String(item.id || item.uid || index);
}

function getUserName(item: RankingItem) {
  return item.nome || item.name || "Jogador";
}

function getMedal(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "👤";
}

function getPositionClass(index: number) {
  if (index === 0) return "rank-card first";
  if (index === 1) return "rank-card second";
  if (index === 2) return "rank-card third";
  return "rank-card";
}

export default async function Home() {
  const ranking = await getRanking();

  const totalJogadores = ranking.length;

  const totalPontos = ranking.reduce((sum, item) => {
    return sum + Number(item.pontos || 0);
  }, 0);

  const totalAcertos = ranking.reduce((sum, item) => {
    return sum + Number(item.total || item.pontos || 0);
  }, 0);

  const lider = ranking[0];

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-badge">⚫ FlamengoGolsBot</div>

        <h1>Ranking do Bolão</h1>

        <p>
          Acompanhe em tempo real a classificação dos participantes do bolão.
          Pontuação atualizada pelo bot oficial.
        </p>

        <div className="hero-actions">
          <a
            className="primary-btn"
            href="https://t.me/FlamengoGolsBot"
            target="_blank"
            rel="noreferrer"
          >
            Abrir Bot
          </a>

          <a className="secondary-btn" href="#ranking">
            Ver Ranking
          </a>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>👥</span>
          <strong>{totalJogadores}</strong>
          <p>Jogadores</p>
        </div>

        <div className="stat-card">
          <span>🏆</span>
          <strong>{totalPontos}</strong>
          <p>Pontos somados</p>
        </div>

        <div className="stat-card">
          <span>🎯</span>
          <strong>{totalAcertos}</strong>
          <p>Acertos registrados</p>
        </div>
      </section>

      <section className="ranking-section" id="ranking">
        <div className="section-header">
          <div>
            <h2>Classificação</h2>
            <p>
              Líder atual:{" "}
              <strong>{lider ? getUserName(lider) : "—"}</strong>
            </p>
          </div>

          <span className="live-pill">● Ao vivo</span>
        </div>

        {ranking.length === 0 ? (
          <div className="empty-card">
            <h3>Nenhum ranking disponível</h3>
            <p>
              Verifique se a variável RANKING_API_URL está salva na Vercel e
              faça redeploy.
            </p>
          </div>
        ) : (
          <div className="ranking-list">
            {ranking.map((item, index) => {
              const userId = getUserId(item, index);
              const nome = getUserName(item);
              const pontos = Number(item.pontos || 0);
              const total = Number(item.total || item.pontos || 0);

              return (
                <a
                  key={`${userId}-${index}`}
                  className={getPositionClass(index)}
                  href={`/user/${encodeURIComponent(userId)}`}
                >
                  <div className="rank-left">
                    <div className="rank-position">
                      <span>{getMedal(index)}</span>
                      <strong>#{index + 1}</strong>
                    </div>

                    <div>
                      <h3>{nome}</h3>
                      <p>{total} acerto(s)</p>
                    </div>
                  </div>

                  <div className="rank-points">
                    <strong>{pontos}</strong>
                    <span>{pontos === 1 ? "ponto" : "pontos"}</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      <footer className="footer">
        Feito para a Nação Rubro-Negra ⚫🔴
      </footer>
    </main>
  );
}    }

    if (Array.isArray(data.ranking)) {
      return data.ranking;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch {
    return [];
  }
}

function getUserId(item: RankingItem) {
  return String(item.id || item.uid || "");
}

function getUserName(item: RankingItem) {
  return item.nome || item.name || "Jogador";
}

function getMedal(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "👤";
}

function getPositionClass(index: number) {
  if (index === 0) return "rank-card first";
  if (index === 1) return "rank-card second";
  if (index === 2) return "rank-card third";
  return "rank-card";
}

export default async function Home() {
  const ranking = await getRanking();

  const totalJogadores = ranking.length;

  const totalPontos = ranking.reduce((sum, item) => {
    return sum + Number(item.pontos || 0);
  }, 0);

  const totalAcertos = ranking.reduce((sum, item) => {
    return sum + Number(item.total || item.pontos || 0);
  }, 0);

  const lider = ranking[0];

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-badge">⚫ FlamengoGolsBot</div>

        <h1>Ranking do Bolão</h1>

        <p>
          Acompanhe em tempo real a classificação dos participantes do bolão.
          Pontuação atualizada pelo bot oficial.
        </p>

        <div className="hero-actions">
          <a
            className="primary-btn"
            href="https://t.me/FlamengoGolsBot"
            target="_blank"
            rel="noreferrer"
          >
            Abrir Bot
          </a>

          <a className="secondary-btn" href="#ranking">
            Ver Ranking
          </a>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>👥</span>
          <strong>{totalJogadores}</strong>
          <p>Jogadores</p>
        </div>

        <div className="stat-card">
          <span>🏆</span>
          <strong>{totalPontos}</strong>
          <p>Pontos somados</p>
        </div>

        <div className="stat-card">
          <span>🎯</span>
          <strong>{totalAcertos}</strong>
          <p>Acertos registrados</p>
        </div>
      </section>

      <section className="ranking-section" id="ranking">
        <div className="section-header">
          <div>
            <h2>Classificação</h2>
            <p>
              Líder atual:{" "}
              <strong>{lider ? getUserName(lider) : "—"}</strong>
            </p>
          </div>

          <span className="live-pill">● Ao vivo</span>
        </div>

        {ranking.length === 0 ? (
          <div className="empty-card">
            <h3>Nenhum ranking disponível</h3>
            <p>
              Verifique se a variável RANKING_API_URL está salva na Vercel e
              faça redeploy.
            </p>
          </div>
        ) : (
          <div className="ranking-list">
            {ranking.map((item, index) => {
              const userId = getUserId(item);
              const nome = getUserName(item);
              const pontos = Number(item.pontos || 0);
              const total = Number(item.total || item.pontos || 0);

              return (
                <a
                  key={`${userId}-${index}`}
                  className={getPositionClass(index)}
                  href={`/user/${encodeURIComponent(userId)}`}
                >
                  <div className="rank-left">
                    <div className="rank-position">
                      <span>{getMedal(index)}</span>
                      <strong>#{index + 1}</strong>
                    </div>

                    <div>
                      <h3>{nome}</h3>
                      <p>{total} acerto(s)</p>
                    </div>
                  </div>

                  <div className="rank-points">
                    <strong>{pontos}</strong>
                    <span>{pontos === 1 ? "ponto" : "pontos"}</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      <footer className="footer">
        Feito para a Nação Rubro-Negra ⚫🔴
      </footer>
    </main>
  );
}
function getMedal(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "👤";
}

function getPositionClass(index: number) {
  if (index === 0) return "rank-card first";
  if (index === 1) return "rank-card second";
  if (index === 2) return "rank-card third";
  return "rank-card";
}

export default async function Home() {
  const ranking = await getRanking();

  const totalJogadores = ranking.length;

  const totalPontos = ranking.reduce((sum, item) => {
    return sum + Number(item.pontos || 0);
  }, 0);

  const totalAcertos = ranking.reduce((sum, item) => {
    return sum + Number(item.total || item.pontos || 0);
  }, 0);

  const lider = ranking[0];

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-badge">⚫ FlamengoGolsBot</div>

        <h1>Ranking do Bolão</h1>

        <p>
          Acompanhe em tempo real a classificação dos participantes do bolão.
          Pontuação atualizada pelo bot oficial.
        </p>

        <div className="hero-actions">
          <a
            className="primary-btn"
            href="https://t.me/FlamengoGolsBot"
            target="_blank"
            rel="noreferrer"
          >
            Abrir Bot
          </a>

          <a className="secondary-btn" href="#ranking">
            Ver Ranking
          </a>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>👥</span>
          <strong>{totalJogadores}</strong>
          <p>Jogadores</p>
        </div>

        <div className="stat-card">
          <span>🏆</span>
          <strong>{totalPontos}</strong>
          <p>Pontos somados</p>
        </div>

        <div className="stat-card">
          <span>🎯</span>
          <strong>{totalAcertos}</strong>
          <p>Acertos registrados</p>
        </div>
      </section>

      <section className="ranking-section" id="ranking">
        <div className="section-header">
          <div>
            <h2>Classificação</h2>
            <p>
              Líder atual: <strong>{lider ? lider.nome : "—"}</strong>
            </p>
          </div>

          <span className="live-pill">● Ao vivo</span>
        </div>

        {ranking.length === 0 ? (
          <div className="empty-card">
            <h3>Nenhum ranking disponível</h3>
            <p>
              Assim que o bot registrar pontos, eles aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="ranking-list">
            {ranking.map((item, index) => {
              const pontos = Number(item.pontos || 0);
              const total = Number(item.total || item.pontos || 0);

              return (
                <a
                  key={String(item.id)}
                  className={getPositionClass(index)}
                  href={`/user/${encodeURIComponent(String(item.id))}`}
                >
                  <div className="rank-left">
                    <div className="rank-position">
                      <span>{getMedal(index)}</span>
                      <strong>#{index + 1}</strong>
                    </div>

                    <div>
                      <h3>{item.nome || "Jogador"}</h3>
                      <p>{total} acerto(s)</p>
                    </div>
                  </div>

                  <div className="rank-points">
                    <strong>{pontos}</strong>
                    <span>{pontos === 1 ? "ponto" : "pontos"}</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      <footer className="footer">
        Feito para a Nação Rubro-Negra ⚫🔴
      </footer>
    </main>
  );
}
