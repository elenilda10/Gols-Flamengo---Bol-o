type RankingUser = {
  id?: string;
  uid?: string;
  nome?: string;
  name?: string;
  pontos?: number;
  total?: number;
  posicao?: number;
  position?: number;
  acertos?: string[];
};

type UserApiResponse = {
  ok?: boolean;
  user?: RankingUser;
  jogador?: RankingUser;
  data?:
    | RankingUser
    | {
        user?: RankingUser;
        jogador?: RankingUser;
      };
  ranking?: RankingUser[];
};

function buildUserApiUrl(baseUrl: string, uid: string) {
  const options = encodeURIComponent(
    JSON.stringify({
      uid: uid,
    })
  );

  if (baseUrl.includes("&sig=")) {
    return baseUrl.replace("&sig=", `&options=${options}&sig=`);
  }

  if (baseUrl.includes("?sig=")) {
    return baseUrl.replace("?sig=", `?options=${options}&sig=`);
  }

  const separator = baseUrl.includes("?") ? "&" : "?";

  return `${baseUrl}${separator}options=${options}`;
}

function isRankingUser(value: unknown): value is RankingUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const obj = value as RankingUser;

  return (
    "nome" in obj ||
    "name" in obj ||
    "pontos" in obj ||
    "total" in obj ||
    "acertos" in obj
  );
}

async function getUser(uid: string): Promise<RankingUser | null> {
  const baseUrl = process.env.RANKING_USER_API_BASE;

  if (!baseUrl) {
    return null;
  }

  try {
    const url = buildUserApiUrl(baseUrl, uid);

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json: unknown = await res.json();

    if (isRankingUser(json)) {
      return json;
    }

    const data = json as UserApiResponse;

    if (data.user) {
      return data.user;
    }

    if (data.jogador) {
      return data.jogador;
    }

    if (data.data && isRankingUser(data.data)) {
      return data.data;
    }

    if (
      data.data &&
      typeof data.data === "object" &&
      "user" in data.data &&
      data.data.user
    ) {
      return data.data.user;
    }

    if (
      data.data &&
      typeof data.data === "object" &&
      "jogador" in data.data &&
      data.data.jogador
    ) {
      return data.data.jogador;
    }

    if (Array.isArray(data.ranking)) {
      const found = data.ranking.find((item) => {
        return String(item.id || item.uid) === String(uid);
      });

      return found || null;
    }

    return null;
  } catch {
    return null;
  }
}

function getName(userData: RankingUser) {
  return userData.nome || userData.name || "Jogador";
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  const userData = await getUser(uid);

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
              Não foi possível carregar este jogador. Verifique se
              RANKING_USER_API_BASE está salva na Vercel e faça redeploy.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const nome = getName(userData);
  const inicial = nome.charAt(0).toUpperCase();
  const pontos = Number(userData.pontos || 0);
  const total = Number(userData.total || userData.pontos || 0);
  const posicao = Number(userData.posicao || userData.position || 0);
  const acertos = Array.isArray(userData.acertos) ? userData.acertos : [];

  return (
    <main className="page">
      <a className="back-link" href="/">
        ⬅ Voltar ao ranking
      </a>

      <section className="profile-card">
        <div className="profile-avatar">{inicial}</div>

        <span className="profile-tag">
          {posicao > 0 ? `#${posicao} no ranking` : "Participante"}
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
