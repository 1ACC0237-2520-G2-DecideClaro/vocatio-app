
document.addEventListener("DOMContentLoaded", () => {

    // ===== Obtener ID del curso desde ?id=programacion =====
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get("id");

    if (!cursoId) {
        document.querySelector("main").innerHTML =
            "<h2>Error: Curso no encontrado.</h2>";
        return;
    }

    // ===== Buscar curso en PATH_DATA =====
    const curso = PATH_DATA.find(c => c.id === cursoId);

    if (!curso) {
        document.querySelector("main").innerHTML =
            "<h2>Error: Curso no disponible.</h2>";
        return;
    }

    // ===== Verificar inscripción =====
    const inscritos = JSON.parse(localStorage.getItem("vocatio_paths_v1") || "[]");

    if (!inscritos.includes(cursoId)) {
        document.querySelector("main").innerHTML = `
            <h2>No estás inscrito en este curso</h2>
            <p>Primero debes inscribirte desde la página de Rutas.</p>
            <button onclick="window.location.href='./path.html'"
                    style="padding: 0.6rem 1rem; background:#0868A8; color:white;
                           border:none; border-radius:6px; cursor:pointer;">
                Ver rutas
            </button>
        `;
        return;
    }

    // ===== Mostrar info del curso =====
    document.getElementById("curso-titulo").textContent = curso.titulo;
    document.getElementById("curso-descripcion").textContent = curso.descripcion;

    // ===== Cargar progreso guardado =====
    let progreso = JSON.parse(localStorage.getItem(`progress_${cursoId}`) || "[]");

    const modulosList = document.getElementById("modulos-list");

    // ===== Renderizar módulos =====
    function renderModulos() {
        modulosList.innerHTML = "";

        curso.modulos.forEach(m => {
            const completado = progreso.includes(m.id);

            const item = document.createElement("div");
            item.className = "modulo-item";
            item.innerHTML = `
                <div class="modulo-info">
                    <h3>${m.titulo}</h3>
                </div>

                ${
                    completado
                        ? `<span class="modulo-completado">✔ Completado</span>`
                        : `<button class="btn-completar" data-id="${m.id}">
                                Marcar como completado
                           </button>`
                }
            `;

            modulosList.appendChild(item);
        });

        initCompletarBtns();
        updateProgressBar();
    }

    // ===== Botones completar módulo =====
    function initCompletarBtns() {
        document.querySelectorAll(".btn-completar").forEach(btn => {
            btn.addEventListener("click", () => {
                const mid = btn.dataset.id;

                if (!progreso.includes(mid)) progreso.push(mid);

                localStorage.setItem(`progress_${cursoId}`, JSON.stringify(progreso));

                renderModulos();
                updatePathPageProgress();
            });
        });
    }

    // ===== Actualizar barra de progreso (detalle) =====
    function updateProgressBar() {
        const bar = document.getElementById("progress-bar");

        const percent = (progreso.length / curso.modulos.length) * 100;

        bar.style.width = percent + "%";
    }

    // ===== Actualizar barra de path.html =====
    function updatePathPageProgress() {
    localStorage.setItem(`progress_${cursoId}`, JSON.stringify(progreso));
}


    renderModulos();
});
