type RankingItem = {
  id: string;
  nome: string;
  pontos: number;
  total: number;
  acertos: string[];
};

type RankingResponse = {
  ok: boolean;
  ranking: RankingItem[];
};

async function getRanking(): Promise<RankingItem[]> {
  const apiUrl = process.env.RANKING_API_URL;

  if (!apiUrl) {
    throw new Error("RANKING_API_URL não configurada no Vercel.");
  }

  const res = await fetch(apiUrl, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar ranking");
  }

  const data: RankingResponse = await res.json();
  return data.ranking || [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const ranking = await getRanking();

  const userData = ranking.find((item) => String(item.id) === String(uid));
  const posicao = ranking.findIndex((item) => String(item.id) === String(uid)) + 1;

  if (!userData) {
    return (
      <main className="page">
        <section className="profile-card">
          <div className="profile-avatar">❌</div>
          <h1>Usuário não encontrado</h1>
          <p>Esse jogador ainda não aparece no ranking do bolão.</p>

          <a href="/" className="primary-btn">
            ⬅ Voltar ao ranking
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="profile-card">
        <div className="profile-avatar">
          {userData.nome.charAt(0).toUpperCase()}
        </div>

        <span className="profile-tag">#{posicao} no ranking</span>

        <h1>{userData.nome}</h1>

        <p className="profile-subtitle">
          Participante do bolão FlamengoGolsBot
        </p>

        <div className="profile-stats">
          <div>
            <strong>{userData.pontos}</strong>
            <span>Pontos</span>
          </div>

          <div>
            <strong>{userData.total}</strong>
            <span>Acertos</span>
          </div>

          <div>
            <strong>{posicao}</strong>
            <span>Posição</span>
          </div>
        </div>
      </section>

      <section className="history-section">
        <div className="section-header">
          <div>
            <h2>Histórico de acertos</h2>
            <p>Resultados acertados pelo participante</p>
          </div>
        </div>

        {userData.acertos.length === 0 ? (
          <div className="empty-card">
            <h3>Nenhum acerto ainda</h3>
            <p>Quando o jogador acertar um placar, aparecerá aqui.</p>
          </div>
        ) : (
          <div className="history-list">
            {userData.acertos.map((item, index) => (
              <div key={index} className="history-card">
                <span>⚽</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        )}

        <a href="/" className="secondary-btn back-btn">
          ⬅ Voltar ao ranking
        </a>
      </section>
    </main>
  );
}
  const userData = ranking.find((item) => item.id === uid);

  if (!userData) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Usuário não encontrado</h1>
          <a href="/" style={styles.btn}>⬅ Voltar ao ranking</a>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🏆 {userData.nome}</h1>

        <p style={styles.subtitle}>
          {userData.total} acerto(s)
        </p>

        <div style={styles.card}>
          {userData.acertos.length === 0 ? (
            <div style={styles.empty}>😕 Nenhum acerto ainda</div>
          ) : (
            userData.acertos.map((item, index) => (
              <div key={index} style={styles.item}>
                ⚽ {item}
              </div>
            ))
          )}
        </div>

        <a href="/" style={styles.btn}>
          ⬅ Voltar ao ranking
        </a>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f0f10",
    color: "#fff",
    padding: 16,
  },
  container: {
    maxWidth: 720,
    margin: "0 auto",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#ff3b30",
    marginBottom: 6,
  },
  subtitle: {
    color: "#bbb",
    marginBottom: 18,
  },
  card: {
    background: "#1a1a1d",
    border: "1px solid #2a2a2f",
    borderRadius: 16,
    padding: 14,
  },
  item: {
    padding: "12px 0",
    borderBottom: "1px solid #2a2a2f",
    fontSize: 18,
  },
  empty: {
    color: "#bbb",
    textAlign: "center",
    padding: "18px 0",
  },
  btn: {
    display: "inline-block",
    marginTop: 16,
    padding: 12,
    background: "#ff3b30",
    borderRadius: 10,
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
};
