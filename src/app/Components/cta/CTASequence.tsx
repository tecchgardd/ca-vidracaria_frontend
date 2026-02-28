"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/** ===== CONFIG ===== */
const IS_DEV = process.env.NODE_ENV === "development";
const DELAY_MS = IS_DEV ? 90 * 1000 : 120 * 1000;
const STORAGE_KEY = "ca_cta_sequence_v12";

const CARD_BLUE = "#1777B3";

const BRAND = {
  name: "CA Vidracaria",
  logoSrc: "/assets/logo.png",
  instagramUrl: "https://www.instagram.com/ca_vidracaria_/",
  whatsappNumber: "5548999516903",
};

type CTAProps = { onClose: () => void };
type CTAItem = { id: string; render: (props: CTAProps) => React.ReactNode };

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-full inline-flex items-center justify-center
        h-12 px-5
        rounded-2xl
        bg-black text-white font-semibold
        transition hover:bg-neutral-900 active:scale-[0.99]
      "
    >
      {children}
    </a>
  );
}

/** ===== MODAL SHELL (SEM BORDER) ===== */
function ModalShell({
  stepLabel,
  title,
  subtitle,
  children,
  onClose,
}: {
  stepLabel: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const showStep = Boolean(stepLabel && stepLabel.trim().length > 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="
          relative w-full max-w-[420px]
          bg-white rounded-3xl overflow-hidden
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={BRAND.logoSrc}
                  alt={BRAND.name}
                  className="w-7 h-7 object-contain"
                />
              </div>

              <div>
                <div className="text-sm font-semibold text-black">
                  {BRAND.name}
                </div>

                {showStep && (
                  <div className="mt-1 text-[11px] font-semibold text-black/60">
                    {stepLabel}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="
                w-9 h-9 rounded-full
                flex items-center justify-center
                text-black hover:bg-black/5 transition
              "
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-extrabold text-black leading-tight">
              {title}
            </h3>

            {subtitle && (
              <p className="mt-3 text-sm text-black/70 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Divider suave */}
        <div className="h-px bg-black/10" />

        {/* CONTENT */}
        <div className="px-6 py-6">{children}</div>

        {/* Divider suave */}
        <div className="h-px bg-black/10" />

        {/* FOOTER */}
        <div className="px-6 py-4 text-xs text-black/60 text-center">
          Atendimento rapido • orcamento sem compromisso
        </div>
      </div>
    </div>
  );
}

/** ===== WhatsApp ===== */
function buildWhatsAppLink(message: string) {
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

/** ===== Storage ===== */
type StoredState = {
  index: number;
  lastClosedAt: number;
};

function readStored(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStored(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

/** ===== Info Card (SEM BORDER) ===== */
function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 text-white shadow-sm"
      style={{ backgroundColor: CARD_BLUE }}
    >
      <p className="font-extrabold text-white text-base">{title}</p>
      <p className="text-sm text-white/90 mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/** ================= CTA 1 ================= */
function CTACapturarLead({ onClose }: CTAProps) {
  const message =
    "Ola, vim pelo site e quero um orcamento.\n\nPode me ajudar?";

  return (
    <ModalShell
      stepLabel=""
      title="Solicite seu orcamento agora"
      subtitle="Fale com a gente e receba orientacao rapida para o seu projeto."
      onClose={onClose}
    >
      <div className="space-y-4">
        <InfoCard
          title="Atendimento rapido no WhatsApp"
          description="Envie tipo de servico, medidas e bairro para agilizar o orcamento."
        />
        <PrimaryLink href={buildWhatsAppLink(message)}>
          Quero meu orcamento
        </PrimaryLink>
      </div>
    </ModalShell>
  );
}

/** ================= CTA 2 ================= */
function CTAInstagram({ onClose }: CTAProps) {
  return (
    <ModalShell
      stepLabel=""
      title="Acompanhe nossos trabalhos"
      subtitle="Siga o Instagram para ver obras reais, antes e depois e novidades."
      onClose={onClose}
    >
      <div className="space-y-4">
        <InfoCard
          title="Conteudo e referencias"
          description="Veja modelos, acabamentos e ideias para o seu ambiente."
        />
        <PrimaryLink href={BRAND.instagramUrl}>
          Seguir no Instagram
        </PrimaryLink>
      </div>
    </ModalShell>
  );
}

/** ================= CTA 3 ================= */
function CTAAnaliseGratuita({ onClose }: CTAProps) {
  const message =
    "Ola, vim pelo site e quero um orcamento.\n\nPode me ajudar?";

  return (
    <ModalShell
      stepLabel=""
      title="Ainda esta com duvida?"
      subtitle="Peca uma analise gratuita e a gente te orienta no melhor caminho."
      onClose={onClose}
    >
      <div className="space-y-4">
        <InfoCard
          title="Analise gratuita"
          description="A gente avalia seu caso e indica a melhor solucao."
        />
        <PrimaryLink href={buildWhatsAppLink(message)}>
          Quero analise gratuita
        </PrimaryLink>
      </div>
    </ModalShell>
  );
}

/** ================= ORQUESTRADOR ================= */
export default function CTASequence() {
  const ctas: CTAItem[] = useMemo(
    () => [
      { id: "cta1", render: (p) => <CTACapturarLead {...p} /> },
      { id: "cta2", render: (p) => <CTAInstagram {...p} /> },
      { id: "cta3", render: (p) => <CTAAnaliseGratuita {...p} /> },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const timerRef = useRef<number | null>(null);
  const initRef = useRef(false);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function scheduleOpen(ms: number, targetIndex: number) {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setIndex(targetIndex);
      setOpen(true);
    }, ms);
  }

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const stored = readStored();

    if (!stored) {
      writeStored({ index: 0, lastClosedAt: Date.now() });
      scheduleOpen(DELAY_MS, 0);
      return () => clearTimer();
    }

    const safeIndex =
      stored.index >= ctas.length
        ? 0
        : Math.max(0, Math.min(ctas.length - 1, stored.index));

    const elapsed = Date.now() - stored.lastClosedAt;
    const remaining = Math.max(0, DELAY_MS - elapsed);

    setIndex(safeIndex);
    scheduleOpen(remaining, safeIndex);

    return () => clearTimer();
  }, [ctas.length]);

  function closeCurrent() {
    setOpen(false);

    const nextIndex = index + 1;

    writeStored({
      index: nextIndex >= ctas.length ? 0 : nextIndex,
      lastClosedAt: Date.now(),
    });

    const target = nextIndex >= ctas.length ? 0 : nextIndex;
    scheduleOpen(DELAY_MS, target);
  }

  if (!open) return null;

  const current = ctas[index];
  if (!current) return null;

  return <>{current.render({ onClose: closeCurrent })}</>;
}
