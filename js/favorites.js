document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ favorites.js cargado");

  // 🔑 Claves de localStorage
  const CAREER_STORAGE_KEY = "vocatio_favorites_v1";
  const MATERIAL_STORAGE_KEY = "vocatio_materials_v1";

  const getCareerFavs = () =>
    JSON.parse(localStorage.getItem(CAREER_STORAGE_KEY) || "[]");
  const saveCareerFavs = (arr) =>
    localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(arr));

  const getMaterialFavs = () =>
    JSON.parse(localStorage.getItem(MATERIAL_STORAGE_KEY) || "[]");
  const saveMaterialFavs = (arr) =>
    localStorage.setItem(MATERIAL_STORAGE_KEY, JSON.stringify(arr));

  // 🧠 Datos de carreras
  const CAREERS_DATA = {
    computacion: {
      nombre: "Ciencias de la Computación",
      img: "../assets/img/computacion.jpg",
      duracion: "5 años",
      modalidad: "Presencial",
      descripcion:
        "Desarrolla software e innova con inteligencia artificial, big data y tecnología avanzada."
    },
    medicina: {
      nombre: "Medicina",
      img: "../assets/img/medicina.jpg",
      duracion: "7 años",
      modalidad: "Presencial",
      descripcion:
        "Aprende a cuidar la vida con ciencia, vocación y compromiso humano."
    },
    traduccion: {
      nombre: "Traducción e Interpretación Profesional",
      img: "../assets/img/traduccion.jpg",
      duracion: "5 años",
      modalidad: "Presencial o semipresencial",
      descripcion:
        "Vive tu pasión por los idiomas y la comunicación global."
    },
    musica: {
      nombre: "Música",
      img: "../assets/img/musica.jpg",
      duracion: "5 años",
      modalidad: "Presencial",
      descripcion:
        "Desarrolla tu talento artístico y técnico en los escenarios."
    },
    derecho: {
      nombre: "Derecho",
      img: "../assets/img/derecho.jpg",
      duracion: "5 años",
      modalidad: "Presencial",
      descripcion:
        "Defiende la justicia con ética, conocimiento y liderazgo."
    },
    mecatronica: {
      nombre: "Ingeniería Mecatrónica",
      img: "../assets/img/mecatronica.jpg",
      duracion: "5 años",
      modalidad: "Presencial",
      descripcion:
        "Diseña sistemas automatizados e inteligentes que mejoran la calidad de vida."
    }
  };

  const careersGrid = document.getElementById("favorites-careers-grid");
  const materialsGrid = document.getElementById("favorites-materials-grid");

  if (!careersGrid || !materialsGrid) {
    console.warn("⚠️ No se encontraron los grids de favoritos");
    return;
  }

  initDropdown();
  initResponsiveNav();
  const careerFavIds = getCareerFavs();
  const materialFavIds = getMaterialFavs();

  console.log("🎓 careerFavIds:", careerFavIds);
  console.log("📚 materialFavIds:", materialFavIds);
  console.log(
    "📦 MATERIALS_DATA existe?",
    typeof MATERIALS_DATA !== "undefined"
  );

  if (careerFavIds.length === 0) {
    careersGrid.innerHTML = `
      <p class="empty-msg">No tienes carreras en favoritos aún.</p>
    `;
  } else {
    careerFavIds.forEach((id) => {
      const c = CAREERS_DATA[id];
      if (!c) return;

      const card = document.createElement("article");
      card.className = "career-card";
      card.dataset.type = "career";
      card.dataset.id = id;

      card.innerHTML = `
        <img src="${c.img}" alt="${c.nombre}">
        <div class="career-info">
          <h2>${c.nombre}</h2>
          <p><strong>Duración:</strong> ${c.duracion}</p>
          <p><strong>Modalidad:</strong> ${c.modalidad}</p>
          <p>${c.descripcion}</p>
        </div>
        <div class="card-actions">
          <button class="favorite-btn" aria-label="Quitar de favoritos">
            <img src="../assets/img/heart-filled.webp" alt="Favorito">
          </button>
          <button class="btn-start">Ver más</button>
        </div>
      `;

      careersGrid.appendChild(card);

      const favBtn = card.querySelector(".favorite-btn");
      favBtn.addEventListener("click", () => {
        let updated = getCareerFavs().filter((f) => f !== id);
        saveCareerFavs(updated);
        card.remove();

        if (!careersGrid.querySelector(".career-card")) {
          careersGrid.innerHTML = `
            <p class="empty-msg">No tienes carreras en favoritos aún.</p>
          `;
        }
      });

      // Botón "Ver más"
      const startBtn = card.querySelector(".btn-start");
      startBtn.addEventListener("click", () => {
        window.location.href = "../pages/explore.html";
      });
    });
  }

  // 🟥 2) Materiales favoritos
  if (typeof MATERIALS_DATA === "undefined") {
    console.warn(
      "⚠️ MATERIALS_DATA no está definido. ¿Cargaste materiales-recomendados.js en favorites.html?"
    );
    materialsGrid.innerHTML = `
      <p class="empty-msg">No se pudieron cargar los materiales favoritos.</p>
    `;
  } else if (materialFavIds.length === 0) {
    materialsGrid.innerHTML = `
      <p class="empty-msg">No tienes materiales en favoritos aún.</p>
    `;
  } else {
    materialFavIds.forEach((id) => {
      const m = MATERIALS_DATA.materiales.find((item) => item.id === id);
      if (!m) return;

      const card = document.createElement("article");
      card.className = "career-card";
      card.dataset.type = "material";
      card.dataset.id = id;

      const tipoLabel =
        m.tipo === "documento"
          ? "Documento"
          : m.tipo === "video"
          ? "Video"
          : "Curso";

      const areaLabel = formatearArea(m.area);

      card.innerHTML = `
        <img src="${m.imagen}" alt="${m.titulo}">
        <div class="career-info">
          <h2>${m.titulo}</h2>
          <p><strong>Tipo:</strong> ${tipoLabel}</p>
          <p><strong>Área:</strong> ${areaLabel}</p>
          <p>${m.descripcion}</p>
        </div>
        <div class="card-actions">
          <button class="favorite-btn" aria-label="Quitar de favoritos">
            <img src="../assets/img/heart-filled.webp" alt="Favorito">
          </button>
          <button class="btn-start">${m.accion}</button>
        </div>
      `;

      materialsGrid.appendChild(card);

      const favBtn = card.querySelector(".favorite-btn");
      favBtn.addEventListener("click", () => {
        let updated = getMaterialFavs().filter((f) => f !== id);
        saveMaterialFavs(updated);
        card.remove();

        if (!materialsGrid.querySelector(".career-card")) {
          materialsGrid.innerHTML = `
            <p class="empty-msg">No tienes materiales en favoritos aún.</p>
          `;
        }
      });

      const startBtn = card.querySelector(".btn-start");
      if (startBtn && m.modalId) {
        startBtn.addEventListener("click", () => {
          window.location.href = `../pages/materials.html#${m.modalId}`;
        });
      }
    });
  }


  function formatearArea(area) {
    switch (area) {
      case "computacion":
        return "Ciencias de la Computación";
      case "robotica":
        return "Robótica";
      case "marketing":
        return "Marketing";
      case "etica":
        return "Ética y Humanidades";
      case "idiomas":
        return "Idiomas";
      default:
        return area;
    }
  }

  function initDropdown() {
    const profile = document.querySelector(".profile");
    if (!profile) return;
    const dropdown = profile.querySelector(".dropdown");
    document.addEventListener("click", (e) => {
      if (!profile.contains(e.target)) {
        dropdown.style.display = "none";
      } else if (e.target.closest(".profile")) {
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

});
