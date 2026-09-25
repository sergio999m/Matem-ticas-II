/*
 * common.js
 * ---------
 * Construye el header (marca + navegación + buscador) y el footer
 * que se repiten en TODAS las páginas del sitio, y contiene la
 * lógica del buscador de módulos (sección 5 del prompt de diseño).
 *
 * Cómo se usa en cada página:
 *   <div id="site-header"></div>
 *   ...
 *   <div id="site-footer"></div>
 *   <script src="assets/js/modules-catalog.js"></script>
 *   <script src="assets/js/common.js"></script>
 *   <script>initSite("");</script>   // "" en la raíz, "../" dentro de modulo-XX/
 */

// Quita tildes y pasa a minúsculas para poder comparar texto sin
// preocuparnos de mayúsculas o acentos ("Área" === "area").
function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderHeader(basePath) {
  const header = document.getElementById("site-header");
  if (!header) return;
  header.className = "site-header";
  header.innerHTML = `
    <a class="brand" href="${basePath}index.html">Mate II<span>:</span> Un Mundo por Explorar</a>
    <div class="search-wrap">
      <input id="module-search" type="text" autocomplete="off"
        placeholder="¿Qué método buscas? Ej: Simpson, área entre curvas...">
      <span class="search-kbd">/</span>
      <div id="search-results" class="search-results"></div>
    </div>
    <nav>
      <a href="${basePath}index.html">Módulos</a>
      <a href="${basePath}mis-trabajos/index.html">Mis Trabajos</a>
    </nav>
  `;
}

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.className = "site-footer";
  const year = new Date().getFullYear();
  footer.innerHTML = `Mate II: Un Mundo por Explorar — Proyecto semestral de Cálculo Integral · UTP · ${year}`;
}

// Arma la lista desplegable de resultados a partir de un arreglo
// de módulos ya filtrado y ordenado.
function renderSearchResults(matches, basePath, query) {
  const box = document.getElementById("search-results");
  if (!matches.length) {
    box.innerHTML = query
      ? `<div class="search-empty">Sin resultados para "${query}". Módulos disponibles ahora: Riemann, Trapecio, Punto Medio, Simpson, Área, Directa.</div>`
      : "";
    box.classList.toggle("open", !!query);
    return;
  }
  box.innerHTML = matches.map((m, i) => `
    <a href="${basePath}${m.path}" data-index="${i}">
      <span>${m.id}. ${m.title}</span>
      <span class="tag ${m.status}">${m.status === "activo" ? "Disponible" : "Próximamente"}</span>
    </a>
  `).join("");
  box.classList.add("open");
}

// Búsqueda simple por relevancia: coincidencia en el título pesa más
// que coincidencia en una palabra clave/sinónimo.
function searchModules(rawQuery) {
  const q = normalizeText(rawQuery.trim());
  if (!q) return [];
  const scored = [];
  MODULES_CATALOG.forEach((m) => {
    const title = normalizeText(m.title);
    let score = 0;
    if (title.includes(q)) score += title.startsWith(q) ? 3 : 2;
    m.keywords.forEach((k) => {
      const nk = normalizeText(k);
      if (nk.includes(q)) score += nk.startsWith(q) ? 2 : 1;
    });
    if (score > 0) scored.push({ ...m, score });
  });
  return scored.sort((a, b) => b.score - a.score || a.id - b.id);
}

function initSearch(basePath) {
  const input = document.getElementById("module-search");
  const box = document.getElementById("search-results");
  if (!input || !box) return;
  let activeIndex = -1;

  input.addEventListener("input", () => {
    activeIndex = -1;
    const matches = searchModules(input.value).slice(0, 8);
    renderSearchResults(matches, basePath, input.value.trim());
  });

  input.addEventListener("keydown", (e) => {
    const links = Array.from(box.querySelectorAll("a"));
    if (e.key === "ArrowDown" && links.length) {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % links.length;
    } else if (e.key === "ArrowUp" && links.length) {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + links.length) % links.length;
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && links[activeIndex]) {
        window.location.href = links[activeIndex].href;
      } else if (links[0]) {
        window.location.href = links[0].href;
      }
      return;
    } else if (e.key === "Escape") {
      box.classList.remove("open");
      input.blur();
      return;
    } else {
      return;
    }
    links.forEach((a, i) => a.classList.toggle("active", i === activeIndex));
    if (links[activeIndex]) links[activeIndex].scrollIntoView({ block: "nearest" });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) box.classList.remove("open");
  });

  // Atajo de teclado global: "/" o Ctrl+K enfocan el buscador.
  document.addEventListener("keydown", (e) => {
    const typingSomewhereElse = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) && document.activeElement !== input;
    if (typingSomewhereElse) return;
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      input.focus();
    }
  });
}

function initSite(basePath) {
  renderHeader(basePath);
  renderFooter();
  initSearch(basePath);
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
    });
  }
}
