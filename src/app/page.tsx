"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CTASequence from "./Components/cta/CTASequence";
import ReviewsSection from "./Components/ReviewsSection";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faArrowUp,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function Page() {
  // HERO
  const HERO_IMAGES = useMemo(
    () => [
      "/assets/ALBUM2/img1.jpeg",
      "/assets/ALBUM2/img2.jpeg",
      "/assets/ALBUM2/img10.jpeg",
      "/assets/ALBUM2/img12.jpeg",
      "/assets/ALBUM2/img14.jpeg",
    ],
    []
  );

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPrevIndex, setHeroPrevIndex] = useState<number | null>(null);
  const [isFadingHero, setIsFadingHero] = useState(false);

  // CARD ORÇAMENTO
  const SERVICES_CARD_IMAGES = useMemo(
    () => [
      "/assets/ALBUM1/img2.jpeg",
      "/assets/ALBUM1/img3.jpeg",
      "/assets/ALBUM1/img5.jpeg",
      "/assets/ALBUM1/img8.jpeg",
    ],
    []
  );

  const [servicesCardIndex, setServicesCardIndex] = useState(0);
  const [servicesCardPrevIndex, setServicesCardPrevIndex] = useState<
    number | null
  >(null);
  const [isFadingServicesCard, setIsFadingServicesCard] = useState(false);

  const heroIndexRef = useRef(0);
  const servicesFadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    heroIndexRef.current = heroIndex;
  }, [heroIndex]);

  useEffect(() => {
    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("mobileMenu");

    const closeMenu = () => menu?.classList.add("hidden");
    const toggleMenu = () => menu?.classList.toggle("hidden");

    const handleMenuBtnClick = (e: Event) => {
      e.stopPropagation();
      toggleMenu();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!menu || !menuBtn) return;

      const target = e.target as Node | null;
      const clickedInsideMenu = target ? menu.contains(target) : false;
      const clickedMenuBtn = target ? menuBtn.contains(target) : false;

      if (!clickedInsideMenu && !clickedMenuBtn) closeMenu();
    };

    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName?.toLowerCase() === "a") closeMenu();
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    menuBtn?.addEventListener("click", handleMenuBtnClick);
    document.addEventListener("click", handleClickOutside);
    menu?.addEventListener("click", handleLinkClick);
    document.addEventListener("keydown", handleEsc);

    closeMenu();

    return () => {
      menuBtn?.removeEventListener("click", handleMenuBtnClick);
      document.removeEventListener("click", handleClickOutside);
      menu?.removeEventListener("click", handleLinkClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // HERO automático mais rápido
  useEffect(() => {
    if (!HERO_IMAGES.length) return;

    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      const current = heroIndexRef.current;
      const next = (current + 1) % HERO_IMAGES.length;

      setHeroPrevIndex(current);
      setIsFadingHero(true);
      setHeroIndex(next);

      const timeout = setTimeout(() => {
        setIsFadingHero(false);
        setHeroPrevIndex(null);
      }, 800);

      return () => clearTimeout(timeout);
    }, 3500);

    return () => clearInterval(interval);
  }, [HERO_IMAGES]);

  // Card orçamento: só pré-carrega imagens, sem autoplay
  useEffect(() => {
    SERVICES_CARD_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    return () => {
      if (servicesFadeTimeoutRef.current) {
        clearTimeout(servicesFadeTimeoutRef.current);
      }
    };
  }, [SERVICES_CARD_IMAGES]);

  const changeServicesCardImage = (nextIndex: number) => {
    if (nextIndex === servicesCardIndex) return;

    if (servicesFadeTimeoutRef.current) {
      clearTimeout(servicesFadeTimeoutRef.current);
    }

    setServicesCardPrevIndex(servicesCardIndex);
    setIsFadingServicesCard(true);
    setServicesCardIndex(nextIndex);

    servicesFadeTimeoutRef.current = setTimeout(() => {
      setIsFadingServicesCard(false);
      setServicesCardPrevIndex(null);
    }, 800);
  };

  const handlePrevServicesCard = () => {
    const prev =
      servicesCardIndex === 0
        ? SERVICES_CARD_IMAGES.length - 1
        : servicesCardIndex - 1;

    changeServicesCardImage(prev);
  };

  const handleNextServicesCard = () => {
    const next = (servicesCardIndex + 1) % SERVICES_CARD_IMAGES.length;
    changeServicesCardImage(next);
  };

  return (
    <main className="bg-black text-white min-h-screen">
      {/* HERO */}
      <section
        id="home"
        className="relative w-full min-h-[85vh] sm:min-h-screen overflow-hidden"
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity duration-700"
            style={{ backgroundImage: `url('${HERO_IMAGES[heroIndex]}')` }}
          />

          {heroPrevIndex !== null && (
            <div
              className={`absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity duration-700 ${
                isFadingHero ? "opacity-0" : "opacity-100"
              }`}
              style={{ backgroundImage: `url('${HERO_IMAGES[heroPrevIndex]}')` }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
        </div>

        {/* HEADER */}
        <header className="absolute top-0 left-0 w-full z-20">
          <div className="w-full bg-black/25 backdrop-blur-[2px]">
            <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
              <a href="#home" className="flex items-center">
                <img
                  src="/assets/logo.png"
                  alt="CAM Vidraçaria"
                  className="h-14 sm:h-20 md:h-28 w-auto object-contain"
                />
              </a>

              <button
                id="menuBtn"
                type="button"
                className="w-11 h-11 sm:w-12 sm:h-12 flex flex-col justify-center items-center gap-1 rounded border border-white/30 hover:bg-white/10 transition"
                aria-label="Abrir menu"
                aria-expanded="false"
                aria-controls="mobileMenu"
              >
                <span className="w-6 sm:w-7 h-0.5 bg-white"></span>
                <span className="w-6 sm:w-7 h-0.5 bg-white"></span>
                <span className="w-6 sm:w-7 h-0.5 bg-white"></span>
              </button>
            </div>
          </div>

          <nav
            id="mobileMenu"
            className="hidden w-full bg-black/85 border-t border-white/10"
          >
            <div className="max-w-6xl mx-auto flex flex-col text-center">
              <a href="#home" className="p-4 hover:bg-white/10 transition">
                Home
              </a>
              <a href="#sobre" className="p-4 hover:bg-white/10 transition">
                Sobre
              </a>
              <a href="#servicos" className="p-4 hover:bg-white/10 transition">
                Serviços
              </a>
              <a href="#contato" className="p-4 hover:bg-white/10 transition">
                Contato
              </a>
            </div>
          </nav>
        </header>

        {/* CONTEÚDO DO HERO */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 min-h-[85vh] sm:min-h-screen flex items-center">
          <div className="w-full max-w-[760px]">
            <h1 className="max-w-[300px] min-[420px]:max-w-[360px] sm:max-w-[560px] text-left">
              <span
                className="
                  block text-white font-extrabold uppercase
                  text-[1.2rem] min-[420px]:text-[1.4rem] sm:text-4xl md:text-5xl
                  leading-[1.05] tracking-[-0.02em] drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]
                "
              >
                Atendendo sua necessidade
              </span>

              <span
                className="
                  block mt-2 text-white/95 font-extrabold uppercase
                  text-[1.2rem] min-[420px]:text-[1.4rem] sm:text-3xl md:text-3xl
                  leading-[1.05] tracking-[-0.02em] drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]
                "
              >
                Deixando seu ambiente{" "}
                <span className="text-[#f4c15d]">mais elegante</span>
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 items-center">
            <div>
              <p className="text-sm text-black/70 mb-3">
                CA Vidraçaria e Esquadrias de Alumínio
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                Soluções em Esquadrias de Alto
                <br className="hidden sm:block" />
                Desempenho para Projetos Modernos
              </h2>

              <p className="mt-5 text-black/70 leading-relaxed max-w-xl text-[17px] sm:text-base">
                A CA Vidraçaria e Esquadrias de Alumínio é especializada no
                desenvolvimento e execução de projetos sob medida em esquadrias
                de alumínio para residências, comércios e empreendimentos de alto
                padrão.
              </p>

              <a
                href="https://wa.me/5548999516903?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20CA%20Vidra%C3%A7aria%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento"
                className="inline-flex items-center justify-center mt-8 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
              >
                Faça seu orçamento
              </a>
            </div>

            <div className="md:flex md:justify-end">
              <img
                src="/assets/img5.jpeg"
                alt="Projeto em vidro da CA Vidraçaria"
                className="w-full md:w-[420px] rounded-2xl object-cover shadow-lg max-h-[360px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-14 md:py-20">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-extrabold mb-10 sm:mb-8">
            Aqui na CA Vidraçaria o seu projeto é único e nós cuidamos de cada
            detalhe
          </h2>

          <div className="sm:hidden -mx-4 px-4 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 w-max">
              <a
                href="#"
                className="group relative w-[280px] shrink-0 rounded-2xl overflow-hidden shadow-sm border border-black/10 bg-white"
              >
                <img
                  src="/assets/img16.jpeg"
                  alt="Portões em alumínio"
                  className="h-64 w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                  Portões de Alumínio
                </span>
              </a>

              <a
                href="#"
                className="group relative w-[280px] shrink-0 rounded-2xl overflow-hidden shadow-sm border border-black/10 bg-white"
              >
                <img
                  src="/assets/img17.jpeg"
                  alt="Divisória em vidro para ambientes corporativo"
                  className="h-64 w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                  Divisória de Ambiente
                </span>
              </a>

              <a
                href="#"
                className="group relative w-[280px] shrink-0 rounded-2xl overflow-hidden shadow-sm border border-black/10 bg-white"
              >
                <img
                  src="/assets/img18.jpeg"
                  alt="Esquadrias termo acústicas"
                  className="h-64 w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                  Esquadrias Térmico Acústico
                </span>
              </a>

              <a
                href="#"
                className="group relative w-[280px] shrink-0 rounded-2xl overflow-hidden shadow-sm border border-black/10 bg-white"
              >
                <img
                  src="/assets/img19.jpeg"
                  alt="Fachadas"
                  className="h-64 w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                  Sistema de Fachada
                </span>
              </a>

              <a
                href="#"
                className="group relative w-[280px] shrink-0 rounded-2xl overflow-hidden shadow-sm border border-black/10 bg-white"
              >
                <img
                  src="/assets/img20.jpeg"
                  alt="Persianas"
                  className="h-64 w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                  Sistema de Persiana Integrada
                </span>
              </a>
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <a
              href="#"
              className="group relative rounded-2xl overflow-hidden shadow-sm border border-black/10"
            >
              <img
                src="/assets/img16.jpeg"
                alt="Portões em alumínio"
                className="h-56 sm:h-60 w-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                Portões de Alumínio
              </span>
            </a>

            <a
              href="#"
              className="group relative rounded-2xl overflow-hidden shadow-sm border border-black/10"
            >
              <img
                src="/assets/img17.jpeg"
                alt="Divisória em vidro para ambientes corporativo"
                className="h-56 sm:h-60 w-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                Divisória de Ambiente
              </span>
            </a>

            <a
              href="#"
              className="group relative rounded-2xl overflow-hidden shadow-sm border border-black/10"
            >
              <img
                src="/assets/img18.jpeg"
                alt="Esquadrias termo acústicas"
                className="h-56 sm:h-60 w-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                Esquadrias Térmico Acústico
              </span>
            </a>

            <a
              href="#"
              className="group relative rounded-2xl overflow-hidden shadow-sm border border-black/10"
            >
              <img
                src="/assets/img19.jpeg"
                alt="Fachadas"
                className="h-56 sm:h-60 w-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                Sistema de Fachada
              </span>
            </a>

            <a
              href="#"
              className="group relative rounded-2xl overflow-hidden shadow-sm border border-black/10 sm:col-span-2 lg:col-span-1"
            >
              <img
                src="/assets/img20.jpeg"
                alt="Persianas"
                className="h-56 sm:h-60 w-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/25"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow">
                Sistema de Persiana Integrada
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-14 md:py-20">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-extrabold mb-10 sm:mb-10">
            Por que escolher a CA Vidraçaria?
          </h2>

          <div className="sm:hidden -mx-4 px-4 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 w-max">
              <div className="w-[280px] shrink-0 bg-[#1677B3] text-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 3h5v5" />
                    <path d="M10 14 21 3" />
                  </svg>
                </div>

                <h3 className="font-bold text-base mb-3">
                  Máxima Qualidade e Segurança
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Trabalhamos com vidros certificados e processos confiáveis, com
                  instalação especializada.
                </p>
              </div>

              <div className="w-[280px] shrink-0 bg-[#1677B3] text-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 7V3h8v4" />
                    <path d="M3 7h18" />
                    <path d="M5 7v14h14V7" />
                    <path d="M9 12h6" />
                  </svg>
                </div>

                <h3 className="font-bold text-base mb-3">Entrega no Prazo</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Cumprimos rigorosamente os prazos combinados para garantir sua
                  tranquilidade.
                </p>
              </div>

              <div className="w-[280px] shrink-0 bg-[#1677B3] text-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 3v18" />
                    <path d="M7 8h10" />
                    <path d="M7 16h10" />
                  </svg>
                </div>

                <h3 className="font-bold text-base mb-3">
                  Alto Desempenho Térmico e Acústico
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Sistemas modernos que elevam conforto e eficiência, reduzindo
                  ruídos e calor.
                </p>
              </div>

              <div className="w-[280px] shrink-0 bg-[#1677B3] text-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z" />
                  </svg>
                </div>

                <h3 className="font-bold text-base mb-3">
                  Acabamento e Durabilidade
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Acabamento sofisticado, valorização estética e alta durabilidade
                  em esquadrias de alumínio.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="bg-[#1677B3] text-white rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 3h5v5" />
                  <path d="M10 14 21 3" />
                </svg>
              </div>

              <h3 className="font-bold text-sm md:text-base mb-2">
                Máxima Qualidade e Segurança
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Trabalhamos com vidros certificados e processos confiáveis, com
                instalação especializada.
              </p>
            </div>

            <div className="bg-[#1677B3] text-white rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 7V3h8v4" />
                  <path d="M3 7h18" />
                  <path d="M5 7v14h14V7" />
                  <path d="M9 12h6" />
                </svg>
              </div>

              <h3 className="font-bold text-sm md:text-base mb-2">
                Entrega no Prazo
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Cumprimos rigorosamente os prazos combinados para garantir sua
                tranquilidade.
              </p>
            </div>

            <div className="bg-[#1677B3] text-white rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3v18" />
                  <path d="M7 8h10" />
                  <path d="M7 16h10" />
                </svg>
              </div>

              <h3 className="font-bold text-sm md:text-base mb-2">
                Alto Desempenho Térmico e Acústico
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Sistemas modernos que elevam conforto e eficiência, reduzindo
                ruídos e calor.
              </p>
            </div>

            <div className="bg-[#1677B3] text-white rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z" />
                </svg>
              </div>

              <h3 className="font-bold text-sm md:text-base mb-2">
                Acabamento e Durabilidade
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Acabamento sofisticado, valorização estética e alta durabilidade
                em esquadrias de alumínio.
              </p>
            </div>
          </div>

          <p className="text-center text-black/70 text-sm md:text-base mt-10 sm:mt-10">
            <strong>CA VIDRAÇARIA</strong>: a escolha certa para quem busca
            sofisticação e durabilidade em esquadrias de alumínio.
          </p>
        </div>
      </section>

      <ReviewsSection />

      {/* CONTATO / ORÇAMENTO */}
      <section id="contato" className="bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                Solicite Seu Orçamento Agora Mesmo
              </h2>

              <p className="text-black/70 leading-relaxed text-[17px] sm:text-base">
                Receba um atendimento rápido e profissional. Nossa equipe está
                pronta para tirar suas dúvidas e ajudar você a escolher a melhor
                solução em vidros.
              </p>

              <p className="mt-5 text-black/70 leading-relaxed text-[17px] sm:text-base">
                <strong className="text-black">CA Vidraçaria:</strong> Qualidade,
                instalação profissional e orçamento rápido. Solicite agora!
              </p>

              <a
                href="https://wa.me/5548999516903?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20CA%20Vidra%C3%A7aria%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center mt-8 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
              >
                Solicitar Orçamento no WhatsApp
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-black/10 shadow-sm">
              <div className="relative w-full h-[240px] sm:h-[280px] md:h-[340px]">
                <div
                  className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat transition-opacity duration-700"
                  style={{
                    backgroundImage: `url('${SERVICES_CARD_IMAGES[servicesCardIndex]}')`,
                  }}
                />

                {servicesCardPrevIndex !== null && (
                  <div
                    className={`absolute inset-0 z-0 bg-center bg-cover bg-no-repeat transition-opacity duration-700 ${
                      isFadingServicesCard ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                      backgroundImage: `url('${SERVICES_CARD_IMAGES[servicesCardPrevIndex]}')`,
                    }}
                  />
                )}

                <div className="absolute inset-0 z-10 bg-black/10" />

                <div className="absolute bottom-3 left-3 z-20">
                  <span className="inline-flex px-3 py-1 rounded-full bg-black/55 text-white text-xs font-semibold backdrop-blur-sm">
                    Projetos Recentes
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePrevServicesCard}
                  aria-label="Imagem anterior"
                  className="absolute left-3 top-1/2 z-20 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition flex items-center justify-center shadow-lg"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNextServicesCard}
                  aria-label="Próxima imagem"
                  className="absolute right-3 top-1/2 z-20 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition flex items-center justify-center shadow-lg"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 backdrop-blur-sm">
                  {SERVICES_CARD_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => changeServicesCardImage(index)}
                      aria-label={`Ir para imagem ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all ${
                        servicesCardIndex === index
                          ? "w-6 bg-white"
                          : "w-2.5 bg-white/55 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#121212] text-white relative">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute -top-6 right-6 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110"
          aria-label="Voltar ao topo"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-12 lg:gap-12 items-start">
            <div className="space-y-5">
              <img
                src="/assets/logo.png"
                alt="CA Vidraçaria"
                className="h-24 sm:h-28 md:h-32 w-auto object-contain"
              />

              <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                Solução em esquadrias de alumínio com sofisticação,segurança e
                durabilidade para o seu projeto!
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-5 text-white">Serviços</h3>

              <ul className="space-y-4 text-sm text-white/60">
                <li className="hover:text-white transition cursor-pointer">
                  Portões em alumínio
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Divisória de ambientes
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Esquadrias Térmico acusticos
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Sistema de Fachada
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Sistema de Persiana Integrada
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-5 text-white">Contato</h3>

              <div className="space-y-4 text-sm text-white/60">
                <div className="flex items-center gap-3">
                  <span className="text-blue-500 w-5 flex justify-center">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <span>(48) 9 9951-6903</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-blue-500 w-5 flex justify-center">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <span>cavidracaria78@gmail.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-5 text-white">Localização</h3>

              <div className="flex items-start gap-3 text-sm text-white/60 mb-8">
                <span className="text-blue-500 w-5 flex justify-center mt-0.5">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>

                <span>
                  R. José Silvério Da Silva - Aririu, Palhoça - SC, 88135-623
                </span>
              </div>

              <h3 className="font-semibold mb-4 text-white">Redes Sociais</h3>

              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/ca_vidracaria_/"
                  className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-pink-600 transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                </a>

                <a
                  href="https://wa.me/5548999516903?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20CA%20Vidra%C3%A7aria%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento"
                  target="_blank"
                  aria-label="WhatsApp"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-green-600 transition-all duration-300 hover:scale-110"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <span>© 2025 CA Vidraçaria</span>
            <span>Todos os direitos reservados</span>
          </div>
        </div>
      </footer>

      <CTASequence />
    </main>
  );
}