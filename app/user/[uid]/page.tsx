type RankingUser = {
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
  ranking?: RankingUser[];
  data?:
    | RankingUser[]
    | {
        ranking?: RankingUser[];
      };
};

async function getRanking(): Promise<RankingUser[]> {
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

    const data: RankingResponse | RankingUser[] = await res.json();

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

function getUserId(user: RankingUser) {
  return String(user.id || user.uid || "");
}

function getName(user: RankingUser) {
  return user.nome || user.name || "Jogador";
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  const ranking = await getRanking();

  const userIndex = ranking.findIndex((item) => {
    return getUserId(item) === String(uid);
  });

  const userData = userIndex >= 0 ? ranking[userIndex] : null;

  if (!userData) {
    return (
      <main className="page">
        <a className="back-link" href="/">
          ⬅ Voltar ao ranking
        </a>

        <section className="error-card">
          <div>
            <h1>❌ Usuário não encontrado</h1>
            <p>
              Este jogador ainda não aparece no ranking atual do bolão.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const nome = getName(userData);
  const inicial = nome.charAt(0).toUpperCase();

  const pontos = Number(userData.pontos || userData.total || 0);
  const total = Number(userData.total || userData.pontos || 0);
  const posicao = userIndex + 1;
  const acertos = Array.isArray(userData.acertos) ? userData.acertos : [];

  return (
    <main className="page">
      <a className="back-link" href="/">
        ⬅ Voltar ao ranking
      </a>

      <section className="profile-card">
        <div className="profile-avatar">{inicial}</div>

        <span className="profile-tag">#{posicao} no ranking</span>

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
            <strong>{posicao}</strong>
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
