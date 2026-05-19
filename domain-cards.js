(function () {
  const data = window.VOIDHEART_DOMAIN_CARDS;
  if (!data) return;

  const { domains, cards } = data;
  const DOMAIN_ORDER = [
    "iron",
    "vector",
    "shadow",
    "grid",
    "cipher",
    "deep",
    "psionic",
    "tide",
    "sable",
  ];

  const params = new URLSearchParams(window.location.search);
  const initialDomain = params.get("domain");
  const initialLevel = params.get("level");

  const filterDomain = document.getElementById("filter-domain");
  const filterLevel = document.getElementById("filter-level");
  const filterSearch = document.getElementById("filter-search");
  const catalog = document.getElementById("card-catalog");
  const resultCount = document.getElementById("result-count");

  function typeLabel(type) {
    const labels = {
      ability: "Ability",
      spell: "Spell",
      archive: "Grid Archive",
    };
    return labels[type] || type;
  }

  function escapeHtml(text) {
    const el = document.createElement("div");
    el.textContent = text;
    return el.innerHTML;
  }

  function formatEffect(text) {
    return escapeHtml(text).replace(/\n/g, "<br>");
  }

  function renderCard(card) {
    const was = card.was
      ? `<span class="deck-card-was">was ${escapeHtml(card.was)}</span>`
      : "";
    return `<article class="deck-card ${card.domain}" id="${card.id}" data-level="${card.level}">
        <header class="deck-card-header">
          <div class="deck-card-title">
            <h3>${escapeHtml(card.name)}</h3>
            ${was}
          </div>
          <div class="deck-card-badges">
            <span class="badge level">Lv ${card.level}</span>
            <span class="badge type">${typeLabel(card.type)}</span>
            <span class="badge recall">Recall ${card.recallCost}</span>
          </div>
        </header>
        <p class="deck-card-effect">${formatEffect(card.effect)}</p>
      </article>`;
  }

  function getFilteredCards() {
    const domain = filterDomain.value;
    const level = filterLevel.value;
    const q = filterSearch.value.trim().toLowerCase();

    return cards.filter((card) => {
      if (domain && card.domain !== domain) return false;
      if (level && String(card.level) !== level) return false;
      if (q) {
        const hay = [card.name, card.was, card.effect, domains[card.domain].name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderCatalog() {
    const filtered = getFilteredCards();
    resultCount.textContent = `${filtered.length} card${filtered.length === 1 ? "" : "s"}`;

    if (!filtered.length) {
      catalog.innerHTML = '<p class="catalog-empty">No cards match your filters.</p>';
      return;
    }

    const byDomain = {};
    filtered.forEach((card) => {
      if (!byDomain[card.domain]) byDomain[card.domain] = [];
      byDomain[card.domain].push(card);
    });

    const activeDomain = filterDomain.value || initialDomain;
    catalog.innerHTML = DOMAIN_ORDER.filter((d) => byDomain[d])
      .map((domainId) => {
        const meta = domains[domainId];
        const domainCards = byDomain[domainId].sort(
          (a, b) => a.level - b.level || a.name.localeCompare(b.name)
        );
        const terms = meta.terminology
          .map((t) => `<li>${escapeHtml(t)}</li>`)
          .join("");
        const termsOpen = domainId === activeDomain ? " open" : "";

        return `<section class="catalog-domain ${domainId}" id="cards-${domainId}">
            <div class="catalog-domain-header">
              <span class="catalog-glyph">${meta.glyph}</span>
              <div>
                <h2>${escapeHtml(meta.name)}</h2>
                <p class="catalog-was">was ${escapeHtml(meta.was)}</p>
                <p class="catalog-tagline">${escapeHtml(meta.tagline)}</p>
              </div>
              <a class="catalog-back" href="domains.html#${domainId}">Domain overview →</a>
            </div>
            <details class="catalog-terms"${termsOpen}>
              <summary>Terminology</summary>
              <ul>${terms}</ul>
            </details>
            <div class="deck-grid">
              ${domainCards.map(renderCard).join("")}
            </div>
          </section>`;
      })
      .join("");
  }

  function syncUrl() {
    const next = new URLSearchParams();
    if (filterDomain.value) next.set("domain", filterDomain.value);
    if (filterLevel.value) next.set("level", filterLevel.value);
    const qs = next.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    history.replaceState(null, "", url);
  }

  function populateFilters() {
    DOMAIN_ORDER.forEach((id) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = domains[id].name;
      filterDomain.appendChild(opt);
    });

    for (let lvl = 1; lvl <= 10; lvl += 1) {
      const opt = document.createElement("option");
      opt.value = String(lvl);
      opt.textContent = `Level ${lvl}`;
      filterLevel.appendChild(opt);
    }

    if (initialDomain && domains[initialDomain]) filterDomain.value = initialDomain;
    if (initialLevel) filterLevel.value = initialLevel;
  }

  function onFilterChange() {
    renderCatalog();
    syncUrl();
  }

  populateFilters();
  filterDomain.addEventListener("change", onFilterChange);
  filterLevel.addEventListener("change", onFilterChange);
  filterSearch.addEventListener("input", onFilterChange);
  renderCatalog();

  if (initialDomain) {
    requestAnimationFrame(() => {
      const anchor = document.getElementById(`cards-${initialDomain}`);
      if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
