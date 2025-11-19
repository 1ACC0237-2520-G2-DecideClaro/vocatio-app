/**
Librerías usadas:
- LocalStorage API (nativa) - Para persistencia y recuperación de evaluaciones
*/

(function() {
    'use strict';

    // ========== ESTADO Y REFERENCIAS DOM ==========

    let historyData = [];
    let filteredData = [];

    const DOM = {
        cardsContainer: document.getElementById('cards'),
        emptyState: document.getElementById('emptyState'),
        filterForm: document.getElementById('filterForm'),
        dateFrom: document.getElementById('dateFrom'),
        dateTo: document.getElementById('dateTo'),
        clearFilterBtn: document.getElementById('clearFilter'),
        deleteModal: document.getElementById('deleteModal'),
        modalText: document.getElementById('modalText'),
        modalCancel: document.getElementById('modalCancel'),
        confirmDelete: document.getElementById('confirmDelete'),
        profileButton: document.getElementById('profileButton'),
        dropdownMenu: document.getElementById('dropdownMenu')
    };

    let targetCardToDelete = null;

    // ========== CARGA Y FILTRADO DE DATOS ==========

    /**
     * Carga el historial desde localStorage
     */
    function loadHistory() {
        const stored = localStorage.getItem('vocatio_history');
        historyData = stored ? JSON.parse(stored) : [];
        filteredData = [...historyData];
        return historyData;
    }

    /**
     * Guarda el historial en localStorage
     */
    function saveHistory() {
        localStorage.setItem('vocatio_history', JSON.stringify(historyData));
    }

    /**
     * Aplica filtros de fecha
     * @param {Date|null} fromDate - Fecha desde
     * @param {Date|null} toDate - Fecha hasta
     */
    function applyDateFilter(fromDate, toDate) {
        filteredData = historyData.filter(entry => {
            const entryDate = new Date(entry.date);

            let passFrom = true;
            let passTo = true;

            if (fromDate) {
                passFrom = entryDate >= fromDate;
            }

            if (toDate) {
                // Incluir todo el día
                const toDateEnd = new Date(toDate);
                toDateEnd.setHours(23, 59, 59, 999);
                passTo = entryDate <= toDateEnd;
            }

            return passFrom && passTo;
        });

        renderCards();
    }

    /**
     * Limpia los filtros aplicados
     */
    function clearFilters() {
        DOM.dateFrom.value = '';
        DOM.dateTo.value = '';
        filteredData = [...historyData];
        renderCards();
    }

    // ========== RENDERIZADO DE TARJETAS ==========

    /**
     * Renderiza las tarjetas de evaluación
     */
    function renderCards() {
        DOM.cardsContainer.innerHTML = '';

        if (filteredData.length === 0) {
            DOM.emptyState.hidden = false;
            return;
        }

        DOM.emptyState.hidden = true;

        filteredData.forEach((entry, index) => {
            const card = createCard(entry, index);
            DOM.cardsContainer.appendChild(card);
        });

        // Reinicializar event listeners para iconos de favorito
        initFavoriteToggles();
    }

    /**
     * Crea el elemento HTML de una tarjeta
     * @param {Object} entry - Datos de la evaluación
     * @param {number} index - Índice en el array
     * @returns {HTMLElement}
     */
    function createCard(entry, index) {
        const article = document.createElement('article');
        article.className = 'test-card';
        article.setAttribute('data-id', entry.id);
        article.setAttribute('data-date', entry.date.split('T')[0]);
        article.setAttribute('tabindex', '0');
        article.setAttribute('role', 'link');
        article.setAttribute('aria-label', `Abrir evaluación del ${entry.dateFormatted}`);

        // Determinar número de test
        const testNumber = historyData.length - historyData.indexOf(entry);

        article.innerHTML = `
            <div class="left">
                <h2>Test #${testNumber}</h2>
                <p class="test-date">Fecha: ${entry.dateFormatted}</p>
                <p><strong>Carrera más afín:</strong> ${entry.mainCareer}</p>
            </div>
            <div class="middle">
                <p><strong>Otras afinidades:</strong></p>
                <ul>
                    ${entry.otherCareers.map(career => `<li>${career}</li>`).join('')}
                </ul>
            </div>
            <div class="right">
                <img src="../assets/img/descargar.png" 
                     class="icon-btn download-btn" 
                     alt="Descargar" 
                     data-id="${entry.id}"
                     tabindex="0"
                     role="button"
                     aria-label="Descargar evaluación">
                <img src="../assets/img/${entry.isFavorite ? 'fav' : 'nofav'}.png" 
                     class="icon-btn fav-toggle" 
                     alt="Favorito"
                     data-id="${entry.id}"
                     data-favorite="${entry.isFavorite}"
                     tabindex="0"
                     role="button"
                     aria-pressed="${entry.isFavorite}"
                     aria-label="${entry.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}">
                <img src="../assets/img/papelera.png" 
                     class="icon-btn delete-btn" 
                     alt="Eliminar"
                     data-id="${entry.id}"
                     tabindex="0"
                     role="button"
                     aria-label="Eliminar evaluación">
            </div>
        `;

        return article;
    }

    // ========== GESTIÓN DE FAVORITOS ==========

    /**
     * Inicializa los toggles de favorito
     */
    function initFavoriteToggles() {
        document.querySelectorAll('.fav-toggle').forEach(icon => {
            // Hover effect
            icon.addEventListener('mouseover', handleFavHover);
            icon.addEventListener('mouseout', handleFavOut);

            // Click/Enter
            icon.addEventListener('click', handleFavToggle);
            icon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFavToggle(e);
                }
            });
        });
    }

    function handleFavHover(e) {
        const isFav = e.target.dataset.favorite === 'true';
        if (!isFav) {
            e.target.src = '../assets/img/fav.png';
        }
    }

    function handleFavOut(e) {
        const isFav = e.target.dataset.favorite === 'true';
        if (!isFav) {
            e.target.src = '../assets/img/nofav.png';
        }
    }

    function handleFavToggle(e) {
        e.stopPropagation();
        const icon = e.currentTarget;
        const entryId = icon.dataset.id;

        // Encontrar en historyData
        const entry = historyData.find(e => e.id === entryId);

        if (entry) {
            entry.isFavorite = !entry.isFavorite;

            // Actualizar UI
            icon.src = entry.isFavorite ? '../assets/img/fav.png' : '../assets/img/nofav.png';
            icon.dataset.favorite = entry.isFavorite;
            icon.setAttribute('aria-pressed', String(entry.isFavorite));
            icon.setAttribute('aria-label', entry.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito');

            // Guardar
            saveHistory();

            console.log(`${entry.isFavorite ? '⭐' : '☆'} Favorito actualizado:`, entryId);
        }
    }

    /**
     * Prepara la evaluación para descargar el PDF en suggest.html
     */
    function downloadEvaluation(entryId) {
        const entry = historyData.find(e => e.id === entryId);

        if (!entry) {
            alert('No se encontró la evaluación.');
            return;
        }

        // Armar el objeto que suggest.html espera como "vocatio_current_test"
        const testData = {
            id: entry.id,
            date: entry.date,
            answers: entry.answers,
            timeSpent: entry.timeSpent
        };

        localStorage.setItem('vocatio_current_test', JSON.stringify(testData));

        // Bandera para que suggest genere el PDF automáticamente al cargar
        localStorage.setItem('vocatio_auto_download', '1');
        window.location.href = 'suggest.html';
    }

    // ========== ELIMINACIÓN DE EVALUACIONES ==========

    /**
     * Muestra el modal de confirmación
     */
    function showDeleteModal(entryId) {
        targetCardToDelete = entryId;
        DOM.deleteModal.hidden = false;
        DOM.deleteModal.style.display = 'flex';

        // Focus en botón cancelar
        setTimeout(() => DOM.modalCancel?.focus(), 100);
    }

    /**
     * Cierra el modal
     */
    function closeDeleteModal() {
        DOM.deleteModal.hidden = true;
        DOM.deleteModal.style.display = 'none';
        targetCardToDelete = null;
    }

    /**
     * Confirma y ejecuta la eliminación
     */
    function confirmDeleteEntry() {
        if (!targetCardToDelete) return;

        // Eliminar del array
        historyData = historyData.filter(e => e.id !== targetCardToDelete);

        // Guardar
        saveHistory();

        // Recargar datos filtrados
        loadHistory();
        applyCurrentFilter();

        closeDeleteModal();

        console.log('🗑️ Evaluación eliminada:', targetCardToDelete);
    }

    /**
     * Aplica el filtro actual después de modificar datos
     */
    function applyCurrentFilter() {
        const fromVal = DOM.dateFrom.value ? new Date(DOM.dateFrom.value) : null;
        const toVal = DOM.dateTo.value ? new Date(DOM.dateTo.value) : null;

        if (fromVal || toVal) {
            applyDateFilter(fromVal, toVal);
        } else {
            filteredData = [...historyData];
            renderCards();
        }
    }

    // ========== NAVEGACIÓN A DETALLES ==========

    /**
     * Navega a la página de detalles de una evaluación
     */
    function navigateToDetails(entryId) {
        const entry = historyData.find(e => e.id === entryId);

        if (!entry) {
            alert('No se encontró la evaluación.');
            return;
        }

        // Guardar como "current test" para que suggest.html la muestre
        const testData = {
            id: entry.id,
            date: entry.date,
            answers: entry.answers,
            timeSpent: entry.timeSpent
        };

        localStorage.setItem('vocatio_current_test', JSON.stringify(testData));
        window.location.href = 'suggest.html';
    }

    // ========== EVENT LISTENERS ==========

    /**
     * Inicializa todos los event listeners
     */
    function initEventListeners() {
        // Filtro de fechas
        DOM.filterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fromVal = DOM.dateFrom.value ? new Date(DOM.dateFrom.value) : null;
            const toVal = DOM.dateTo.value ? new Date(DOM.dateTo.value) : null;

            // Validación
            if (fromVal && toVal && fromVal > toVal) {
                alert('La fecha "Desde" no puede ser posterior a la fecha "Hasta".');
                return;
            }

            applyDateFilter(fromVal, toVal);
        });

        // Limpiar filtros
        DOM.clearFilterBtn.addEventListener('click', clearFilters);

        // Clicks en el contenedor de tarjetas (delegación de eventos)
        DOM.cardsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.test-card');
            if (!card) return;

            const entryId = card.dataset.id;

            // Verificar si clickeó un botón de acción
            if (e.target.closest('.delete-btn')) {
                e.stopPropagation();
                showDeleteModal(entryId);
                return;
            }

            if (e.target.closest('.download-btn')) {
                e.stopPropagation();
                downloadEvaluation(entryId);
                return;
            }

            if (e.target.closest('.fav-toggle')) {
                e.stopPropagation();
                // Ya manejado por handleFavToggle
                return;
            }

            // Click en cualquier otra parte: navegar
            navigateToDetails(entryId);
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            const active = document.activeElement;

            if (active && active.classList.contains('test-card')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigateToDetails(active.dataset.id);
                }
            }

            // ESC para cerrar modal
            if (e.key === 'Escape' && !DOM.deleteModal.hidden) {
                closeDeleteModal();
            }
        });

        // Modal de eliminación
        DOM.modalCancel.addEventListener('click', closeDeleteModal);
        DOM.confirmDelete.addEventListener('click', confirmDeleteEntry);

        DOM.deleteModal.addEventListener('click', (e) => {
            if (e.target === DOM.deleteModal) {
                closeDeleteModal();
            }
        });

        // Profile dropdown
        if (DOM.profileButton && DOM.dropdownMenu) {
            DOM.profileButton.addEventListener('click', toggleProfileDropdown);
            document.addEventListener('click', closeDropdownOutside);
        }

        // Cambios en inputs de fecha
        DOM.dateFrom.addEventListener('change', validateDateRange);
        DOM.dateTo.addEventListener('change', validateDateRange);
    }

    /**
     * Valida el rango de fechas en tiempo real
     */
    function validateDateRange() {
        const fromVal = DOM.dateFrom.value;
        const toVal = DOM.dateTo.value;

        if (fromVal && toVal) {
            const from = new Date(fromVal);
            const to = new Date(toVal);

            if (from > to) {
                DOM.dateTo.setCustomValidity('La fecha final debe ser posterior a la inicial');
                DOM.dateTo.reportValidity();
            } else {
                DOM.dateTo.setCustomValidity('');
            }
        }
    }

    /**
     * Profile dropdown toggle
     */
    function toggleProfileDropdown(e) {
        e.stopPropagation();
        const expanded = DOM.profileButton.getAttribute('aria-expanded') === 'true';
        DOM.profileButton.setAttribute('aria-expanded', String(!expanded));
        DOM.dropdownMenu.classList.toggle('show');
        const arrow = document.querySelector('.arrow-down');
        if (arrow) arrow.classList.toggle('rotate');
    }

    function closeDropdownOutside(e) {
        if (!DOM.profileButton.contains(e.target) && !DOM.dropdownMenu.contains(e.target)) {
            DOM.dropdownMenu.classList.remove('show');
            DOM.profileButton.setAttribute('aria-expanded', 'false');
            const arrow = document.querySelector('.arrow-down');
            if (arrow) arrow.classList.remove('rotate');
        }
    }

    // ========== ORDENAMIENTO Y BÚSQUEDA ==========

    /**
     * Ordena el historial por fecha (más reciente primero)
     */
    function sortByDate() {
        historyData.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredData = [...historyData];
        renderCards();
    }

    /**
     * Ordena por favoritos primero
     */
    function sortByFavorites() {
        historyData.sort((a, b) => {
            if (a.isFavorite === b.isFavorite) {
                return new Date(b.date) - new Date(a.date);
            }
            return b.isFavorite ? 1 : -1;
        });
        filteredData = [...historyData];
        renderCards();
    }

    // ========== ESTADÍSTICAS (OPCIONAL) ==========

    /**
     * Calcula estadísticas del historial
     */
    function calculateStats() {
        const totalTests = historyData.length;
        const favorites = historyData.filter(e => e.isFavorite).length;

        const careerCounts = {};
        historyData.forEach(entry => {
            const career = entry.mainCareer;
            careerCounts[career] = (careerCounts[career] || 0) + 1;
        });

        const mostCommon = Object.keys(careerCounts).reduce((a, b) =>
            careerCounts[a] > careerCounts[b] ? a : b, null
        );

        return {
            total: totalTests,
            favorites: favorites,
            mostCommonCareer: mostCommon,
            occurrences: careerCounts[mostCommon] || 0
        };
    }

    // ========== INICIALIZACIÓN ==========

    /**
     * Inicializa el módulo de historial
     */
    function init() {
        // Cargar datos
        loadHistory();

        // Renderizar
        renderCards();

        // Event listeners
        initEventListeners();

        // Ordenar por defecto
        sortByDate();

        // Log de estadísticas
        const stats = calculateStats();
        console.log('📊 Estadísticas del historial:', stats);
        console.log('✅ Módulo de historial inicializado');
    }

    // Ejecutar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();