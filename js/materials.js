document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vocatio_materials_v1";

  const getFavorites = () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  const saveFavorites = (arr) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

  function renderMaterials() {
    const docsGrid = document.getElementById("docs-grid");
    const videosGrid = document.getElementById("videos-grid");
    const cursosGrid = document.getElementById("cursos-grid");

    if (!docsGrid || !videosGrid || !cursosGrid) {
      console.error("No se encontraron los contenedores de grid.");
      return;
    }

    if (
      typeof MATERIALS_DATA === "undefined" ||
      !Array.isArray(MATERIALS_DATA.materiales)
    ) {
      console.error(
        "MATERIALS_DATA no está definido o no tiene el formato esperado."
      );
      return;
    }

    docsGrid.innerHTML = "";
    videosGrid.innerHTML = "";
    cursosGrid.innerHTML = "";

    MATERIALS_DATA.materiales.forEach((m) => {
      const card = document.createElement("article");
      card.className = "career-card";
      card.dataset.id = m.id;
      card.dataset.area = m.area;

      const modalHref = m.modalId ? `#${m.modalId}` : "#";

      card.innerHTML = `
        <a href="${modalHref}" class="card-link">
          <img src="${m.imagen}" alt="${m.titulo}" />
          <div class="career-info">
            <h2>${m.titulo}</h2>
            <p>${m.descripcion}</p>
          </div>
        </a>
        <div class="card-actions">
          <button class="favorite-btn" aria-label="Agregar a favoritos">
            <img src="../assets/img/heart-empty.webp" alt="No favorito">
          </button>
          <button class="btn-start">${m.accion}</button>
        </div>
      `;

      if (m.tipo === "documento") {
        docsGrid.appendChild(card);
      } else if (m.tipo === "video") {
        videosGrid.appendChild(card);
      } else if (m.tipo === "curso") {
        cursosGrid.appendChild(card);
      }
    });

    console.log("Materiales renderizados:", MATERIALS_DATA.materiales.length);
  }

  // Crear todos los modales dinámicamente
  function renderModals() {
    const body = document.body;

    // Elimina modales dinámicos anteriores si recargamos la vista
    document.querySelectorAll(".modal.dynamic-material").forEach((m) => m.remove());

    MATERIALS_DATA.materiales.forEach((m) => {
      if (!m.modalId) return;

      const modal = document.createElement("div");
      modal.className = "modal dynamic-material";
      modal.id = m.modalId;

      modal.innerHTML = `
        <div class="modal-content">
          <a href="#" class="close">&times;</a>
          <img src="${m.imagen}" alt="${m.titulo}" />
          <h2>${m.titulo}</h2>
          <div class="career-details">
            <p><strong>Tipo:</strong> ${m.detalleTipo || ""}</p>
            ${m.duracion ? `<p><strong>Duración:</strong> ${m.duracion}</p>` : ""}
            ${m.extra ? `<p><strong>Información:</strong> ${m.extra}</p>` : ""}
            <p><strong>Descripción:</strong> ${m.descripcionModal || m.descripcion}</p>
          </div>
          <div class="card-actions modal-buttons">
            
            ${
              m.url
                ? `<button class="btn-start" data-id="${m.id}">${m.accion}</button>`
                : ""
            }
          </div>
        </div>
      `;

      body.appendChild(modal);
    });
  }

  function initFavorites() {
    const favs = getFavorites();

    document.querySelectorAll(".career-card").forEach((card) => {
      const id = card.dataset.id;
      const btnWrapper = card.querySelector(".favorite-btn");
      const img = btnWrapper ? btnWrapper.querySelector("img") : null;
      if (!id || !img) return;

      img.src = favs.includes(id)
        ? "../assets/img/heart-filled.webp"
        : "../assets/img/heart-empty.webp";

      btnWrapper.addEventListener("click", (e) => {
        e.preventDefault();

        let current = getFavorites();

        if (current.includes(id)) {
          current = current.filter((f) => f !== id);
          img.src = "../assets/img/heart-empty.webp";
        } else {
          current.push(id);
          img.src = "../assets/img/heart-filled.webp";
        }

        saveFavorites(current);
      });
    });
  }

  // Hace que todos los botones "Descargar / Ver / Ir al Curso" funcionen
  function initButtons() {
    // Botones en las tarjetas
    document.querySelectorAll(".career-card .btn-start").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".career-card");
        if (!card) return;
        const id = card.dataset.id;
        const material = MATERIALS_DATA.materiales.find((m) => m.id === id);
        if (material && material.url) {
          window.open(material.url, "_blank");
        } else if (material && material.modalId) {
          window.location.hash = `#${material.modalId}`;
        }
      });
    });

    // Botones dentro de los modales
    document.querySelectorAll(".modal-buttons .btn-start").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        const material = MATERIALS_DATA.materiales.find((m) => m.id === id);
        if (material && material.url) {
          window.open(material.url, "_blank");
        }
      });
    });
  }

  function initSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();

      document.querySelectorAll(".career-card").forEach((card) => {
        const title = card.querySelector("h2").textContent.toLowerCase();
        const desc = card.querySelector("p").textContent.toLowerCase();
        const matchesText = title.includes(q) || desc.includes(q);

        const careerFilter = document.getElementById("career-filter");
        const selected = careerFilter ? careerFilter.value : "todos";
        const area = card.dataset.area;
        const matchesArea = selected === "todos" || area === selected;

        card.style.display = matchesText && matchesArea ? "" : "none";
      });
    });
  }

  function initCareerFilter() {
    const careerFilter = document.getElementById("career-filter");
    if (!careerFilter) return;

    careerFilter.addEventListener("change", (e) => {
      const selected = e.target.value;
      const q = (document.getElementById("search-input")?.value || "")
        .trim()
        .toLowerCase();

      document.querySelectorAll(".career-card").forEach((card) => {
        const area = card.dataset.area;
        const title = card.querySelector("h2").textContent.toLowerCase();
        const desc = card.querySelector("p").textContent.toLowerCase();

        const matchesArea = selected === "todos" || area === selected;
        const matchesText = title.includes(q) || desc.includes(q);

        card.style.display = matchesArea && matchesText ? "" : "none";
      });
    });
  }

  function initProfileDropdown() {
    const profile = document.querySelector(".profile");
    if (!profile) return;

    const dropdown = profile.querySelector(".dropdown");
    if (!dropdown) return;

    document.addEventListener("click", (e) => {
      if (!profile.contains(e.target)) {
        dropdown.style.display = "none";
        return;
      }

      if (e.target.closest(".profile")) {
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      }
    });
  }

function initResponsiveNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("header nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}


  renderMaterials();
  renderModals();
  initFavorites();
  initButtons();
  initSearch();
  initCareerFilter();
  initProfileDropdown();
  initResponsiveNav();
});
