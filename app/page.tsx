type RankingItem = {
  id: string;
  nome: string;
  pontos: number;
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

function getMedal(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "👤";
}

export default async function Home() {
  const ranking = await getRanking();

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🏆 Ranking do Bolão</h1>
        <p style={styles.subtitle}>Atualização em tempo real</p>

        <div style={styles.card}>
          {ranking.length === 0 ? (
            <div style={styles.empty}>Nenhum ranking disponível.</div>
          ) : (
            ranking.map((item, index) => (
              <a
                key={item.id}
                href={`/user/${item.id}`}
                style={styles.row}
              >
                <div style={styles.left}>
                  <span style={styles.medal}>{getMedal(index)}</span>
                  <span style={styles.name}>
                    {index + 1}. {item.nome}
                  </span>
                </div>

                <div style={styles.points}>{item.pontos} pts</div>
              </a>
            ))
          )}
        </div>
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
    fontSize: 28,
    fontWeight: 700,
    color: "#ff3b30",
    marginBottom: 6,
  },
  subtitle: {
    color: "#bbbbbb",
    marginBottom: 18,
  },
  card: {
    background: "#1a1a1d",
    border: "1px solid #2a2a2f",
    borderRadius: 16,
    padding: 14,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid #2a2a2f",
    textDecoration: "none",
    color: "#fff",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  medal: {
    fontSize: 22,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
  },
  points: {
    color: "#ffcc66",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  empty: {
    color: "#bbbbbb",
    textAlign: "center",
    padding: "18px 0",
  },
};
