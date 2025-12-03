document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "vocatio_paths_v1";

    function getInscritos() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }

    function saveInscritos(arr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }

    const grid = document.getElementById("path-grid");

    function renderPaths() {
        const inscritos = getInscritos();

        grid.innerHTML = "";

        PATH_DATA.forEach(p => {
            const isInscrito = inscritos.includes(p.id);
            const progresoGuardado = JSON.parse(localStorage.getItem(`progress_${p.id}`) || "[]");
            const progress = progresoGuardado.length;

            const totalModulos = p.modulos.length;
            const percent = (progress / totalModulos) * 100;

            const card = document.createElement("article");
            card.className = "career-card path-card";
            card.dataset.id = p.id;

            card.innerHTML = `
                <a class="card-link" href="#modal-${p.id}">
                    <img src="${p.imagen}" alt="${p.titulo}">
                    <div class="career-info">
                        <h2>${p.titulo}</h2>
                        <p>${p.descripcion}</p>
                    </div>
                </a>

                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percent}%"></div>
                </div>

                <div class="card-actions">
                    <button class="btn-start" data-id="${p.id}">
                        Ver ruta
                    </button>

                    ${
                        isInscrito
                            ? `<span class="inscrito-tag">✔ Inscrito</span>`
                            : `<button class="btn-inscribir" data-id="${p.id}">Inscribirme</button>`

                    }
                </div>
            `;

            grid.appendChild(card);
        });

        initButtons();
    }

    function initButtons() {
        document.querySelectorAll(".btn-start").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const inscritos = getInscritos();

                if (!inscritos.includes(id)) {
                    alert("Debes inscribirte antes de ver la ruta.");
                    return;
                }

                window.location.href = `path-detail.html?id=${id}`;
            });

        });

        document.querySelectorAll(".btn-inscribir").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                let inscritos = getInscritos();

                if (!inscritos.includes(id)) {
                    inscritos.push(id);
                    saveInscritos(inscritos);
                }

                renderPaths();
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
function renderModals() {
    const body = document.body;

    document.querySelectorAll(".modal.dynamic-path").forEach(m => m.remove());

    PATH_DATA.forEach(p => {
        const modal = document.createElement("div");
        modal.className = "modal dynamic-path";
        modal.id = `modal-${p.id}`;

        modal.innerHTML = `
        <div class="modal-content">
            <a href="#" class="close">&times;</a>

            <img src="${p.imagen}" alt="${p.titulo}" />

            <h2>${p.titulo}</h2>

            <div class="career-details">
                <p><strong>Descripción:</strong> ${p.descripcion}</p>
                <p><strong>Módulos:</strong> ${p.modulos}</p>
            </div>

            <div class="card-actions modal-buttons">
                <button class="btn-start" data-id="${p.id}">
                    Ver ruta
                </button>
            </div>
        </div>
        `;

        body.appendChild(modal);
    });
}
    renderModals();
    renderPaths();
    initProfileDropdown();
});
