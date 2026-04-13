type UserData = {
  ok: boolean;
  uid: string;
  nome: string;
  total: number;
  acertos: string[];
};

// 🔥 BUSCA OS DADOS DO USUÁRIO
async function getUser(uid: string): Promise<UserData> {
  const res = await fetch(
    `https://prod-api.telebothost.com/ownlang/webhook/22351677?command=ranking_user_api&uid=${uid}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao carregar usuário");
  }

  return res.json();
}

export default async function Page({
  params,
}: {
  params: { uid: string };
}) {
  const data = await getUser(params.uid);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🏆 {data.nome}</h1>

        <p style={styles.subtitle}>
          {data.total} acerto(s)
        </p>

        <div style={styles.card}>
          {data.acertos.length === 0 ? (
            <div style={styles.empty}>
              😕 Nenhum acerto ainda
            </div>
          ) : (
            data.acertos.map((item, index) => (
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
