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
  const res = await fetch(
    "https://prod-api.telebothost.com/ownlang/webhook/22351677?command=ranking_api&sig=623c115af27121ecc3f10058d0e06d6122e703c692f002fc24795db6af325a9b",
    {
      cache: "no-store",
    }
  );

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
