import axios from "axios";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GBP_ACCOUNT_ID,
  GBP_LOCATION_ID,
} = process.env;

export type ReviewCard = {
  reviewId: string;
  reviewerName: string;
  profilePhotoUrl?: string;
  starRating: number;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  replyComment?: string;
};

function assertEnv(name: string, value?: string) {
  if (!value) throw new Error(`Falta ${name} no .env.local`);
}

export async function getAccessTokenFromRefreshToken(): Promise<string> {
  assertEnv("GOOGLE_CLIENT_ID", GOOGLE_CLIENT_ID);
  assertEnv("GOOGLE_CLIENT_SECRET", GOOGLE_CLIENT_SECRET);
  assertEnv("GOOGLE_REFRESH_TOKEN", GOOGLE_REFRESH_TOKEN);

  const resp = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      refresh_token: GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }).toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return resp.data.access_token as string;
}

function parseStarRating(raw: unknown): number {
  const s = String(raw || "");
  if (/FIVE/i.test(s)) return 5;
  if (/FOUR/i.test(s)) return 4;
  if (/THREE/i.test(s)) return 3;
  if (/TWO/i.test(s)) return 2;
  if (/ONE/i.test(s)) return 1;

  const n = Number(s);
  if (Number.isFinite(n)) return Math.max(0, Math.min(5, n));
  return 0;
}

function mapReviewsToCards(data: any): { cards: ReviewCard[]; nextPageToken?: string } {
  const reviews = Array.isArray(data?.reviews) ? data.reviews : [];

  const cards: ReviewCard[] = reviews.map((r: any) => ({
    reviewId: String(r?.reviewId || r?.name || ""),
    reviewerName: String(r?.reviewer?.displayName || "Anônimo"),
    profilePhotoUrl: r?.reviewer?.profilePhotoUrl,
    starRating: parseStarRating(r?.starRating),
    comment: r?.comment,
    createTime: r?.createTime,
    updateTime: r?.updateTime,
    replyComment: r?.reviewReply?.comment,
  }));

  return { cards, nextPageToken: data?.nextPageToken };
}

async function fetchReviewsPage(params: {
  baseUrl: string;
  accessToken: string;
  pageToken?: string;
}) {
  const { baseUrl, accessToken, pageToken } = params;

  return axios.get(baseUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      pageSize: 50,
      orderBy: "updateTime desc",
      ...(pageToken ? { pageToken } : {}),
    },
  });
}

export async function listAllReviews(): Promise<ReviewCard[]> {
  assertEnv("GBP_ACCOUNT_ID", GBP_ACCOUNT_ID);
  assertEnv("GBP_LOCATION_ID", GBP_LOCATION_ID);

  const accessToken = await getAccessTokenFromRefreshToken();

  /**
   * ✅ Tentativa #1 (preferida): Business Profile (host novo)
   * Endpoint: https://businessprofile.googleapis.com/v1/accounts/{accountId}/locations/{locationId}/reviews
   */
  const primaryBaseUrl = `https://businessprofile.googleapis.com/v1/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/reviews`;

  /**
   * ✅ Fallback #2 (legado): My Business v4 (host antigo)
   * Endpoint: https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews
   */
  const fallbackBaseUrl = `https://mybusiness.googleapis.com/v4/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/reviews`;

  const tryFetchAll = async (baseUrl: string): Promise<ReviewCard[]> => {
    const all: ReviewCard[] = [];
    let pageToken: string | undefined;

    while (true) {
      const resp = await fetchReviewsPage({ baseUrl, accessToken, pageToken });
      const { cards, nextPageToken } = mapReviewsToCards(resp.data);

      all.push(...cards);

      pageToken = nextPageToken;
      if (!pageToken) break;
    }

    return all;
  };

  // ✅ 1) tenta o host novo
  try {
    return await tryFetchAll(primaryBaseUrl);
  } catch (errPrimary: any) {
    const primaryDetails = errPrimary?.response?.data ?? null;
    const primaryStatus = errPrimary?.response?.status ?? null;

    // ✅ 2) tenta o host antigo
    try {
      return await tryFetchAll(fallbackBaseUrl);
    } catch (errFallback: any) {
      const fallbackDetails = errFallback?.response?.data ?? null;
      const fallbackStatus = errFallback?.response?.status ?? null;

      throw new Error(
        `Falha ao buscar reviews.\n` +
          `Primary (businessprofile.googleapis.com) status=${primaryStatus} details=${JSON.stringify(primaryDetails)}\n` +
          `Fallback (mybusiness.googleapis.com) status=${fallbackStatus} details=${JSON.stringify(fallbackDetails)}`
      );
    }
  }
}