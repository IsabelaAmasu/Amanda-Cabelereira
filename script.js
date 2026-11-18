/* =========================================================
   Amanda Cabeleireira — script.js
   JavaScript puro, sem dependências.
   ========================================================= */

/* ---------------------------------------------------------
   CONTEÚDO EDITÁVEL
   Para trocar as fotos: substitua "thumb" e "full" pelo caminho
   das fotos reais (ex.: "img/resultado-01.webp") e ajuste o "alt".
   Os formatos "w" e "h" são só a proporção (evita saltos de layout).
   --------------------------------------------------------- */
const GALLERY_ITEMS = [
  { id: "g1", thumb: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=70", full: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1600&q=80", alt: "Cabelo longo com acabamento brilhante (imagem ilustrativa)", w: 900, h: 700 },
  { id: "g2", thumb: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=700&q=70", full: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1600&q=80", alt: "Cabelo com coloração (imagem ilustrativa)", w: 700, h: 700 },
  { id: "g3", thumb: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=70", full: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80", alt: "Corte de cabelo bem definido (imagem ilustrativa)", w: 700, h: 1000 },
  { id: "g4", thumb: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=70", full: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80", alt: "Escova modelada (imagem ilustrativa)", w: 700, h: 700 },
  { id: "g5", thumb: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=700&q=70", full: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1600&q=80", alt: "Penteado elaborado (imagem ilustrativa)", w: 700, h: 1000 },
  { id: "g6", thumb: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=70", full: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1600&q=80", alt: "Cabelo liso e alinhado (imagem ilustrativa)", w: 700, h: 1000 },
  { id: "g7", thumb: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=70", full: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80", alt: "Ambiente de salão de beleza (imagem ilustrativa)", w: 700, h: 1000 },
  { id: "g8", thumb: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=700&q=70", full: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1600&q=80", alt: "Cadeiras e espelhos de salão (imagem ilustrativa)", w: 700, h: 700 },
];

/* Depoimentos DEMONSTRATIVOS. Substituir por avaliações reais do Google
   ou mensagens enviadas pelas clientes (com autorização). */
const TESTIMONIALS = [
  { text: "Aqui entra o comentário real de uma cliente, copiado da avaliação no Google.", author: "Nome da cliente" },
  { text: "Cada card mostra um depoimento curto. Textos mais longos também cabem sem quebrar o layout.", author: "Nome da cliente" },
  { text: "Depoimento de exemplo para testar o carrossel. Será trocado por uma avaliação verdadeira.", author: "Nome da cliente" },
  { text: "Espaço reservado para a opinião de quem já foi atendida pela Amanda.", author: "Nome da cliente" },
  { text: "Conteúdo demonstrativo: nenhuma destas frases foi dita por uma cliente.", author: "Nome da cliente" },
];

/* --------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Imagem que não carrega: esconde o ícone quebrado e deixa a moldura blush */
function watchImage(img) {
  const markMissing = () => img.classList.add("is-missing");
  img.addEventListener("error", markMissing);
  img.addEventListener("load", () => img.classList.remove("is-missing"));
  if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) markMissing();
}

/* ---------- Ano no rodapé ---------- */
function initYear() {
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Navbar: estado sticky e menu mobile ---------- */
function initHeader() {
  const header = $(".site-header");
  const burger = $(".burger");
  const nav = $("#menu");
  const desktop = window.matchMedia("(min-width: 900px)");

  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  };

  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });
  desktop.addEventListener("change", (e) => { if (e.matches) setMenu(false); });
}

/* ---------- Link ativo do menu conforme a seção visível ---------- */
function initActiveNav() {
  if (!("IntersectionObserver" in window)) return;
  const links = $$(".nav__list a");
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...map.keys()].map((id) => document.getElementById(id)).filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      const link = map.get(entry.target.id);
      if (link) link.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));
}

/* ---------- Animações de entrada ao rolar ---------- */
function initReveal() {
  const items = $$(".reveal, .reveal-img");
  if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  items.forEach((el) => io.observe(el));
}

/* ---------- Galeria + lightbox ---------- */
function initGallery() {
  const gallery = $("#gallery");
  if (!gallery) return;

  gallery.innerHTML = GALLERY_ITEMS.map((item, i) => `
    <button class="gallery__item ${item.id}" type="button" data-index="${i}" aria-label="Ampliar imagem: ${item.alt}">
      <span class="media"><img src="${item.thumb}" alt="" width="${item.w}" height="${item.h}" loading="lazy" decoding="async"></span>
    </button>`).join("");
  $$("img", gallery).forEach(watchImage);

  const box = $("#lightbox");
  const img = $(".lightbox__img", box);
  const caption = $(".lightbox__caption", box);
  const btnClose = $(".lightbox__close", box);
  const btnPrev = $(".lightbox__prev", box);
  const btnNext = $(".lightbox__next", box);
  let current = 0;
  let opener = null;
  let closeTimer = null;

  watchImage(img);

  const show = (index) => {
    current = (index + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    const item = GALLERY_ITEMS[current];
    img.src = item.full;
    img.alt = item.alt;
    caption.textContent = `${item.alt}. Imagem ${current + 1} de ${GALLERY_ITEMS.length}.`;
  };

  const open = (index, trigger) => {
    clearTimeout(closeTimer);
    opener = trigger;
    show(index);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => box.classList.add("is-open"));
    btnClose.focus();
  };

  const close = () => {
    box.classList.remove("is-open");
    document.body.style.overflow = "";
    closeTimer = setTimeout(() => { box.hidden = true; img.removeAttribute("src"); }, prefersReducedMotion.matches ? 0 : 350);
    if (opener) opener.focus();
  };

  gallery.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery__item");
    if (btn) open(Number(btn.dataset.index), btn);
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));

  /* Clique fora da imagem (no fundo) fecha */
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lightbox__figure")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") {
      /* Mantém o foco dentro do lightbox */
      const focusables = [btnClose, btnPrev, btnNext];
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Gesto de deslize no celular */
  let startX = null;
  box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
}

/* ---------- Depoimentos: carrossel vertical infinito ---------- */
function initTestimonials() {
  const track = $("#marquee-track");
  if (!track) return;

  const buildList = (clone) => {
    const ul = document.createElement("ul");
    ul.className = "marquee__list";
    ul.innerHTML = TESTIMONIALS.map((t) => `
      <li class="quote">
        <p class="quote__text">“${t.text}”</p>
        <p class="quote__author">${t.author}<span class="quote__tag">Conteúdo demonstrativo</span></p>
      </li>`).join("");
    if (clone) {
      /* Cópia só para o efeito visual: escondida de leitores de tela e do teclado */
      ul.setAttribute("aria-hidden", "true");
      ul.setAttribute("inert", "");
    }
    return ul;
  };

  track.append(buildList(false), buildList(true));

  /* Duração proporcional à altura, para manter a velocidade confortável */
  const setSpeed = () => {
    const listHeight = track.firstElementChild.offsetHeight;
    track.style.animationDuration = `${Math.max(30, listHeight / 28)}s`;
  };
  setSpeed();
  window.addEventListener("resize", setSpeed, { passive: true });
}

/* ---------- Início ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initHeader();
  initActiveNav();
  initReveal();
  initGallery();
  initTestimonials();
  $$("main img, .hero img").forEach(watchImage);
});
