"use client";

import { useEffect, useMemo, useState } from "react";

type ReviewCard = {
  id: string;
  reviewerName: string;
  reviewerMeta?: string;
  rating: number;
  dateLabel: string;
  comment?: string;
  ownerReply?: {
    dateLabel?: string;
    comment: string;
  };
};

function clampRating(n: number) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(5, Math.round(x)));
}

function Stars({ rating }: { rating: number }) {
  const r = clampRating(rating);

  return (
    <div className="flex items-center justify-center gap-0.5 leading-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < r ? "text-black text-sm" : "text-black/20 text-sm"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function GoogleReviewsBadge() {
  return (
    <div className="mb-6 flex items-center lg:justify-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-white/20 flex items-center justify-center">
        <img
          src="/assets/google.png"
          alt="Google Reviews"
          className="h-6 w-6 object-contain"
        />
      </div>

      <div className="leading-tight">
        <div className="text-white font-semibold">
          Avaliações do Google
        </div>
        <div className="text-white/80 text-xs">
          Fonte: Google Reviews • avaliações verificadas
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/reviews", { cache: "no-store" });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} - ${txt || "Falha na API"}`);
        }

        const data = (await res.json()) as { reviews?: ReviewCard[] };
        const list = Array.isArray(data?.reviews) ? data.reviews : [];

        if (alive) {
          setReviews(list);
          setPage(0);
        }
      } catch (e: any) {
        if (alive) {
          setError(e?.message || "Erro ao carregar avaliações.");
          setReviews([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const pageSize = 3;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(reviews.length / pageSize));
  }, [reviews.length]);

  const currentPageItems = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return reviews.slice(start, end);
  }, [reviews, page]);

  const hasNext = page < totalPages - 1;
  const hasPrev = page > 0;

  return (
    <section id="avaliacoes" className="bg-[#1677B3] text-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          
          {/* TEXTO */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              Veja o que estão
              <br />
              falando sobre nós
            </h2>

            <p className="mt-4 text-white/80 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Avaliações reais de clientes. Transparência total e compromisso com qualidade.
            </p>
          </div>

          {/* LISTA */}
          <div className="lg:col-span-2">
            {!loading && !error && reviews.length > 0 && (
              <GoogleReviewsBadge />
            )}

            {loading && (
              <p className="text-white/90 text-center lg:text-left">
                Carregando avaliações...
              </p>
            )}

            {!loading && error && (
              <p className="text-white/90 text-center lg:text-left">
                {error}
              </p>
            )}

            {!loading && !error && reviews.length === 0 && (
              <p className="text-white/90 text-center lg:text-left">
                Sem avaliações no momento.
              </p>
            )}

            {!loading && !error && reviews.length > 0 && (
              <>
                {/* GRID AJUSTADO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {currentPageItems.map((r) => (
                    <article
                      key={r.id}
                      className="
                        w-full
                        max-w-[280px]
                        h-[180px]
                        bg-white
                        text-black
                        rounded-2xl
                        border border-black/10
                        shadow-md
                        px-5
                        py-4
                        flex flex-col
                        items-center
                        justify-center
                        text-center
                        overflow-hidden
                        mx-auto
                      "
                    >
                      <div className="text-sm font-semibold leading-tight w-full truncate">
                        {r.reviewerName}
                      </div>

                      <div className="mt-2">
                        <Stars rating={r.rating} />
                      </div>

                      <p
                        className="
                          mt-3 text-sm text-black/60
                          overflow-hidden
                          [display:-webkit-box]
                          [-webkit-line-clamp:4]
                          [-webkit-box-orient:vertical]
                        "
                      >
                        {r.comment?.trim()
                          ? r.comment
                          : "Sem comentário"}
                      </p>
                    </article>
                  ))}
                </div>

                {/* PAGINAÇÃO */}
                <div className="mt-10 flex items-center lg:justify-center gap-6 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={!hasPrev}
                    className="
                      px-5 py-2 rounded-lg
                      bg-white/10 hover:bg-white/20
                      transition text-sm font-semibold
                      disabled:opacity-40 disabled:cursor-not-allowed
                    "
                  >
                    Voltar
                  </button>

                  <div className="text-white/80 text-sm">
                    Página {page + 1} de {totalPages}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) =>
                        Math.min(totalPages - 1, p + 1)
                      )
                    }
                    disabled={!hasNext}
                    className="
                      px-5 py-2 rounded-lg
                      bg-white/10 hover:bg-white/20
                      transition text-sm font-semibold
                      disabled:opacity-40 disabled:cursor-not-allowed
                    "
                  >
                    Avançar
                  </button>

                  <div className="hidden sm:block text-white/70 text-sm">
                    • {reviews.length} avaliações
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
