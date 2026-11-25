// Klein, rustige gedrag. Alles werk ook sonder hierdie skrip.
const minderBeweging = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Sagte vervaag-en-styg wanneer iets in sig kom
const onthul = document.querySelectorAll<HTMLElement>(".onthul");
if (minderBeweging || !("IntersectionObserver" in window)) {
  onthul.forEach((el) => el.classList.add("is-sigbaar"));
} else {
  const io = new IntersectionObserver(
    (inskrywings) => {
      for (const i of inskrywings) {
        if (i.isIntersecting) {
          i.target.classList.add("is-sigbaar");
          io.unobserve(i.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  onthul.forEach((el) => io.observe(el));
}

// 2. Kopstuk kry 'n lyn wanneer jy rol
const kop = document.querySelector<HTMLElement>("[data-kop]");
const merk = () => kop?.classList.toggle("is-gerol", window.scrollY > 8);
merk();
window.addEventListener("scroll", merk, { passive: true });

// 3. Vaste kontrole-balk op selfone: wys na die inleiding, versteek by die eind-blok
const balk = document.querySelector<HTMLElement>("[data-vaste-balk]");
const inleiding = document.querySelector<HTMLElement>("[data-inleiding]");
const eind = document.querySelector<HTMLElement>("[data-eind-cta]");
if (balk && inleiding && "IntersectionObserver" in window) {
  let verbyInleiding = false;
  let eindSigbaar = false;
  const opdateer = () => {
    const wys = verbyInleiding && !eindSigbaar;
    balk.classList.toggle("is-sigbaar", wys);
    balk.toggleAttribute("inert", !wys);
  };
  new IntersectionObserver(([i]) => {
    verbyInleiding = !i.isIntersecting && i.boundingClientRect.top < 0;
    opdateer();
  }).observe(inleiding);
  if (eind) {
    new IntersectionObserver(([i]) => {
      eindSigbaar = i.isIntersecting || i.boundingClientRect.top < 0;
      opdateer();
    }).observe(eind);
  }
}

// 4. Inhoudsopgawe: merk die afdeling waar jy lees
const tocSkakels = document.querySelectorAll<HTMLAnchorElement>(".inhoud-sy a[href^='#']");
if (tocSkakels.length && "IntersectionObserver" in window) {
  const kaart = new Map<string, HTMLAnchorElement>();
  tocSkakels.forEach((a) => kaart.set(decodeURIComponent(a.hash.slice(1)), a));
  const io = new IntersectionObserver(
    (inskrywings) => {
      for (const i of inskrywings) {
        if (i.isIntersecting) {
          tocSkakels.forEach((a) => a.removeAttribute("aria-current"));
          kaart.get(i.target.id)?.setAttribute("aria-current", "true");
        }
      }
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );
  kaart.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

// 5. Soek en filter op "Alle artikels"
const soekVorm = document.querySelector<HTMLElement>("[data-soekvorm]");
if (soekVorm) {
  soekVorm.hidden = false;
  const filters = document.querySelector<HTMLElement>("[data-filters]");
  if (filters) filters.hidden = false;
  const invoer = soekVorm.querySelector<HTMLInputElement>("input")!;
  const uitslag = document.querySelector<HTMLElement>("[data-soek-uitslag]")!;
  const kaarte = Array.from(document.querySelectorAll<HTMLElement>("[data-soek-lys] [data-soek]"));
  const knoppies = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-filter]"));
  const geenUitslag = document.querySelector<HTMLElement>("[data-geen]");
  let kategorie = "alles";

  const verfyn = () => {
    const woorde = invoer.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let getal = 0;
    for (const k of kaarte) {
      const pas =
        (kategorie === "alles" || k.dataset.kategorie === kategorie) &&
        woorde.every((w) => (k.dataset.soek ?? "").includes(w));
      k.hidden = !pas;
      if (pas) {
        getal++;
        k.classList.add("is-sigbaar");
      }
    }
    if (geenUitslag) geenUitslag.hidden = getal > 0;
    uitslag.textContent = woorde.length || kategorie !== "alles" ? `${getal} ${getal === 1 ? "artikel" : "artikels"} gevind` : "";
  };

  invoer.addEventListener("input", verfyn);
  soekVorm.addEventListener("submit", (e) => e.preventDefault());
  knoppies.forEach((b) =>
    b.addEventListener("click", () => {
      kategorie = b.dataset.filter ?? "alles";
      knoppies.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      verfyn();
    }),
  );
  const q = new URLSearchParams(location.search).get("q");
  if (q) {
    invoer.value = q;
    verfyn();
  }
}
