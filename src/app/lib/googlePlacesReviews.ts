import axios from "axios";

const { GOOGLE_MAPS_API_KEY, GOOGLE_PLACE_ID } = process.env;

export type ReviewCard = {
  reviewId: string;
  reviewerName: string;
  profilePhotoUrl?: string;
  starRating: number;
  comment?: string;
  createTime?: string;
};

function assertEnv(name: string, value?: string) {
  if (!value) throw new Error(`Falta ${name} no .env.local`);
}

/**
 * Retorna SOMENTE o place_id (string).
 * Ex: input = "CA Vidraçaria Palhoça SC"
 */
export async function findPlaceIdByText(input: string): Promise<string> {
  assertEnv("GOOGLE_MAPS_API_KEY", GOOGLE_MAPS_API_KEY);

  const resp = await axios.get(
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
    {
      params: {
        input,
        inputtype: "textquery",
        fields: "place_id,name,formatted_address",
        key: GOOGLE_MAPS_API_KEY,
        language: "pt-BR",
      },
    }
  );

  const candidates = Array.isArray(resp.data?.candidates)
    ? resp.data.candidates
    : [];
  const first = candidates[0];

  if (!first?.place_id) {
    throw new Error(
      `Nenhum local encontrado. status=${resp.data?.status || "?"} - ${
        resp.data?.error_message || ""
      }`
    );
  }

  return String(first.place_id);
}

/**
 * Retorna SOMENTE o array de reviews (ReviewCard[]).
 * Usa GOOGLE_PLACE_ID do .env.local se placeId não for passado.
 */
export async function getPlaceReviews(placeId?: string): Promise<ReviewCard[]> {
  assertEnv("GOOGLE_MAPS_API_KEY", GOOGLE_MAPS_API_KEY);

  const pid = placeId || GOOGLE_PLACE_ID;
  if (!pid) {
    throw new Error(
      "Falta GOOGLE_PLACE_ID no .env.local (ou passe placeId na query)."
    );
  }

  const resp = await axios.get(
    "https://maps.googleapis.com/maps/api/place/details/json",
    {
      params: {
        place_id: pid,
        fields: "name,rating,user_ratings_total,reviews",
        reviews_sort: "newest", // ou "most_relevant"
        key: GOOGLE_MAPS_API_KEY,
        language: "pt-BR",
      },
    }
  );

  const raw = resp.data;
  const result = raw?.result || {};
  const reviewsArr = Array.isArray(result?.reviews) ? result.reviews : [];

  return reviewsArr.map((r: any, idx: number) => ({
    reviewId: String(r?.time ?? idx),
    reviewerName: String(r?.author_name || "Anônimo"),
    profilePhotoUrl: r?.profile_photo_url,
    starRating: Number(r?.rating ?? 0),
    comment: r?.text,
    createTime: r?.relative_time_description,
  }));
}