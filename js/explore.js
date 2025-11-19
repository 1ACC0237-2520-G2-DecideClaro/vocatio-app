document.addEventListener("DOMContentLoaded", () => {
    if (typeof CAREERS_DATA === "undefined" || !CAREERS_DATA.carreras) {
        console.error("CAREERS_DATA no está cargado. Verifica carreras.js");
        return;
    }

    const grid = document.getElementById("career-grid");
    const body = document.body;

    const STORAGE_KEY = "vocatio_favorites_v1";
    const getFavorites = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const saveFavorites = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

    let currentRatingFilter = null;   
    let currentTemaFilter = null;    
    let currentSort = "popular";      
    let currentSearch = "";          

    function renderFavoriteState(btn, isFav) {
        btn.classList.toggle("active", isFav);
        btn.setAttribute("aria-pressed", isFav ? "true" : "false");
        btn.setAttribute("aria-label", isFav ? "Quitar de favoritos" : "Agregar a favoritos");
        btn.innerHTML = isFav
            ? '<img src="../assets/img/heart-filled.webp" alt="Favorito">'
            : '<img src="../assets/img/heart-empty.webp" alt="No favorito">';
    }

    function getFilteredSortedCareers() {
    const { ratingFilter, temaFilter } = getCurrentFilters();

    const searchInput = document.getElementById("search-input");
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const sortSelect = document.getElementById("sort-select");
    const sortValue = sortSelect ? sortSelect.value : "popular"; 

    let list = CAREERS_DATA.carreras.slice();

    if (searchTerm) {
        list = list.filter((c) => {
            const name = c.nombre.toLowerCase();
            const shortDesc = (c.descripcionCorta || "").toLowerCase();
            const longDesc  = (c.descripcionLarga || "").toLowerCase();
            return (
                name.includes(searchTerm) ||
                shortDesc.includes(searchTerm) ||
                longDesc.includes(searchTerm)
            );
        });
    }

    if (ratingFilter) {
        let minRating = 0;
        if (ratingFilter === "4_5") minRating = 4.5;
        else if (ratingFilter === "4_0") minRating = 4.0;
        else if (ratingFilter === "3_5") minRating = 3.5;
        else if (ratingFilter === "3_0") minRating = 3.0;

        list = list.filter((c) => (c.rating || 0) >= minRating);
    }

    if (temaFilter) {
        list = list.filter((c) => c.tema === temaFilter);
    }

    list.sort((a, b) => {
        if (sortValue === "valorados") {
            return (b.rating || 0) - (a.rating || 0);
        }

        if (sortValue === "recientes") {
            return (b.fechaOrden || 0) - (a.fechaOrden || 0);
        }

        return (b.popularidad || 0) - (a.popularidad || 0);
    });

    return list;
}


    function renderCareerCards(careersList) {
    grid.innerHTML = "";

    const list = careersList || CAREERS_DATA.carreras;

    list.forEach((c, index) => {
        const card = document.createElement("article");
        card.classList.add("career-card");
        card.dataset.id = c.id;

        const lazyAttr = index > 2 ? 'loading="lazy"' : "";

        card.innerHTML = `
            <a href="#modal-${c.id}" class="card-link">
                <img src="${c.imagen}" alt="${c.nombre}" ${lazyAttr} />
                <div class="career-info">
                    <h2>${c.nombre}</h2>
                    <p>${c.descripcionCorta}</p>
                </div>
            </a>
            <div class="card-actions">
                <button class="favorite-btn" aria-label="Agregar a favoritos" aria-pressed="false">
                  <img src="../assets/img/heart-empty.png" alt="No favorito">
                </button>
                <button class="btn-start">Empieza Aquí</button>
            </div>
        `;

        grid.appendChild(card);
    });

    initFavorites();
    initStartButtons();
}


    function getCurrentFilters() {
    const ratingChecked = document.querySelector('input[name="rating"]:checked');
    const temaChecked   = document.querySelector('input[name="tema"]:checked');

    const ratingValue = ratingChecked ? ratingChecked.value : "all";
    const temaValue   = temaChecked ? temaChecked.value : "all";

    return {
        ratingFilter: ratingValue === "all" ? null : ratingValue,
        temaFilter:   temaValue   === "all" ? null : temaValue
    };
}

    function renderModals() {
        CAREERS_DATA.carreras.forEach((c) => {
            const modal = document.createElement("div");
            modal.classList.add("modal");
            modal.id = `modal-${c.id}`;

            modal.innerHTML = `
                <div class="modal-content">
                    <a href="#" class="close" aria-label="Cerrar">&times;</a>
                    <img src="${c.imagen}" alt="${c.nombre}" loading="lazy" />
                    <h2>${c.nombre}</h2>

                    <div class="career-details">
                        <p><strong>Duración:</strong> ${c.duracion}</p>
                        <p><strong>Modalidad:</strong> ${c.modalidad}</p>

                        <h3>Descripción general</h3>
                        <p>${c.descripcionLarga}</p>

                        <h3>¿Qué aprenderás?</h3>
                        <ul>
                            ${c.aprendizajes.map((i) => `<li>${i}</li>`).join("")}
                        </ul>

                        <h3>Campos laborales</h3>
                        <ul>
                            ${c.campos.map((i) => `<li>${i}</li>`).join("")}
                        </ul>

                        <h3>Habilidades que desarrollarás</h3>
                        <ul>
                            ${c.habilidades.map((i) => `<li>${i}</li>`).join("")}
                        </ul>

                        <h3>Más información</h3>
                        <a href="${c.link}" target="_blank" class="btn-start modal-link">Sitio oficial</a>
                    </div>
                </div>
            `;

            body.appendChild(modal);
        });
    }

    function initModalOutsideClose() {
        document.querySelectorAll(".modal").forEach((modal) => {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    window.location.hash = "";
                }
            });
        });
    }

    function initModalEscClose() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && window.location.hash.startsWith("#modal-")) {
                window.location.hash = "";
            }
        });
    }

    function initFavorites() {
        const favs = getFavorites();

        document.querySelectorAll(".career-card").forEach((card) => {
            const id = card.dataset.id;
            const btn = card.querySelector(".favorite-btn");
            if (!btn || !id) return;

            const isFav = favs.includes(id);
            renderFavoriteState(btn, isFav);

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                let current = getFavorites();
                const index = current.indexOf(id);

                if (index !== -1) {
                    current.splice(index, 1);
                    renderFavoriteState(btn, false);
                } else {
                    current.push(id);
                    renderFavoriteState(btn, true);
                }

                saveFavorites(current);
            };
        });
    }

    function initSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const list = getFilteredSortedCareers();
        renderCareerCards(list);
    });
}

    function initStartButtons() {
        document.querySelectorAll(".career-card .btn-start").forEach((btn) => {
            btn.addEventListener("click", () => {
                window.location.href = "../pages/materials.html";
            });
        });
    }

    function initDropdownClose() {
        const profile = document.querySelector(".profile");
        if (!profile) return;

        const dropdown = profile.querySelector(".dropdown");

        document.addEventListener("click", (e) => {
            if (!profile.contains(e.target)) {
                dropdown.style.display = "none";
            } else {
                dropdown.style.display =
                    dropdown.style.display === "block" ? "none" : "block";
            }
        });
    }

    function initFilters() {
    const filterBtn   = document.getElementById("filter-btn");
    const filterPanel = document.getElementById("filter-panel");
    const closeFilter = document.getElementById("close-filter");

    if (filterBtn && filterPanel && closeFilter) {
        filterBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            filterPanel.classList.toggle("active");
        });

        closeFilter.addEventListener("click", () => {
            filterPanel.classList.remove("active");
        });

        document.addEventListener("click", (e) => {
            if (!filterPanel.contains(e.target) && !filterBtn.contains(e.target)) {
                filterPanel.classList.remove("active");
            }
        });
    }

    document.querySelectorAll('input[name="rating"], input[name="tema"]').forEach((input) => {
        input.addEventListener("change", () => {
            const list = getFilteredSortedCareers();
            renderCareerCards(list);
        });
    });

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            const list = getFilteredSortedCareers();
            renderCareerCards(list);
        });
    }
}

function initResponsiveNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("header nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

const initialList = getFilteredSortedCareers();
renderCareerCards(initialList);
renderModals();
initModalOutsideClose();
initModalEscClose();
initSearch();
initDropdownClose();
initFilters();
initResponsiveNav();

});
