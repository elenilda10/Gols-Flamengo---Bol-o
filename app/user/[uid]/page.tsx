type RankingItem = {
  id: string;
  nome: string;
  pontos: number;
  total?: number;
  acertos?: string[];
};

type RankingResponse = {
  ok: boolean;
  ranking: RankingItem[];
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

    const data: RankingResponse = await res.json();

    return Array.isArray(data.ranking) ? data.ranking : [];
  } catch {
    return [];
  }
}

export default async function UserPage({
  params,
}: {
  params: { uid: string };
}) {
  const uid = params.uid;

  const ranking = await getRanking();

  const userData = ranking.find((item) => {
    return String(item.id) === String(uid);
  });

  const posicao =
    ranking.findIndex((item) => {
      return String(item.id) === String(uid);
    }) + 1;

  if (!userData) {
    return (
      <main className="page">
        <a className="back-link" href="/">
          ⬅ Voltar ao ranking
        </a>

        <section className="error-card">
          <div>
            <h1>❌ Usuário não encontrado</h1>
            <p>Esse jogador ainda não aparece no ranking do bolão.</p>
          </div>
        </section>
      </main>
    );
  }

  const nome = userData.nome || "Jogador";
  const inicial = nome.charAt(0).toUpperCase();
  const pontos = Number(userData.pontos || 0);
  const total = Number(userData.total || userData.pontos || 0);
  const acertos = Array.isArray(userData.acertos) ? userData.acertos : [];

  return (
    <main className="page">
      <a className="back-link" href="/">
        ⬅ Voltar ao ranking
      </a>

      <section className="profile-card">
        <div className="profile-avatar">{inicial}</div>

        <span className="profile-tag">
          #{posicao > 0 ? posicao : "-"} no ranking
        </span>

        <h1>{nome}</h1>

        <p className="profile-subtitle">
          Participante do bolão FlamengoGolsBot
        </p>

        <div className="profile-stats">
          <div className="profile-stat">
            <strong>{pontos}</strong>
            <span>{pontos === 1 ? "Ponto" : "Pontos"}</span>
          </div>

          <div className="profile-stat">
            <strong>{total}</strong>
            <span>{total === 1 ? "Acerto" : "Acertos"}</span>
          </div>

          <div className="profile-stat">
            <strong>{posicao > 0 ? posicao : "-"}</strong>
            <span>Posição</span>
          </div>
        </div>
      </section>

      <section className="history-section">
        <div className="section-header">
          <div>
            <h2>Histórico de acertos</h2>
            <p>Resultados acertados por este participante</p>
          </div>

          <span className="live-pill">🎯 Perfil</span>
        </div>

        {acertos.length === 0 ? (
          <div className="empty-card">
            <h3>Nenhum acerto listado</h3>
            <p>Quando o jogador acertar um placar, aparecerá aqui.</p>
          </div>
        ) : (
          <div className="history-list">
            {acertos.map((item, index) => (
              <div className="history-item" key={`${item}-${index}`}>
                <strong>⚽ {item}</strong>
                <span>Acerto #{index + 1}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        Perfil oficial do ranking FlamengoGolsBot ⚫🔴
      </footer>
    </main>
  );
}
