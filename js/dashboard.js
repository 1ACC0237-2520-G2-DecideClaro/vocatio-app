/**
 * dashboard.js - Módulo 2: Evaluación de Intereses Vocacionales
 * Funcionalidades del Dashboard: mostrar último test, gestión de perfil
 * Autor: DecideClaro - Vocatio
 *
 * Librerías usadas:
 * - LocalStorage API (nativa) - Para recuperar datos de evaluaciones
 */

(function() {
    'use strict';

    // ========== REFERENCIAS DOM ==========

    const DOM = {
        resultsCard: document.querySelector('.card.results'),
        resultsImage: document.querySelector('.results img'),
        resultsText: document.querySelector('.results p'),
        profileButton: document.getElementById('profileButton'),
        dropdownMenu: document.getElementById('dropdownMenu'),
        arrow: document.querySelector('.arrow-down')
    };

    // ========== GESTIÓN DE ÚLTIMOS RESULTADOS ==========

    /**
     * Carga y muestra el último test realizado
     */
    function loadLastTestResults() {
        const history = JSON.parse(localStorage.getItem('vocatio_history') || '[]');

        if (history.length === 0) {
            // No hay tests, mostrar estado vacío (ya está en HTML)
            showEmptyState();
            return;
        }

        // Obtener el más reciente
        const lastTest = history[0];
        showLastTestResults(lastTest);
    }

    /**
     * Muestra el estado vacío (sin tests realizados)
     */
    function showEmptyState() {
        if (DOM.resultsImage) {
            DOM.resultsImage.src = '../assets/img/realiza-un-test.png';
            DOM.resultsImage.alt = 'Realiza un test';
        }

        if (DOM.resultsText) {
            DOM.resultsText.textContent = 'Realiza un test para mostrar tus resultados';
        }

        // Hacer la tarjeta clickeable para ir al test
        if (DOM.resultsCard) {
            DOM.resultsCard.style.cursor = 'pointer';
            DOM.resultsCard.addEventListener('click', () => {
                window.location.href = '../pages/test.html';
            });
        }
    }

    /**
     * Muestra los resultados del último test
     * @param {Object} testData - Datos del último test
     */
    function showLastTestResults(testData) {
        if (!DOM.resultsCard) return;

        // Cambiar contenido
        DOM.resultsCard.innerHTML = `
            <h2>Resultados del último test</h2>
            <div class="last-test-content">
                <div class="career-badge">
                    <span class="dot"></span>
                    Carrera más afín
                </div>
                <h3 class="main-career">${testData.mainCareer}</h3>
                <p class="test-date">Realizado el ${testData.dateFormatted}</p>
                <div class="other-careers-preview">
                    <p><strong>Otras afinidades:</strong></p>
                    <ul>
                        ${testData.otherCareers.slice(0, 2).map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
                <button class="btn-view-details">Ver detalles completos</button>
            </div>
        `;

        // Agregar estilos inline para los nuevos elementos
        addLastTestStyles();

        // Hacer clickeable
        const viewBtn = DOM.resultsCard.querySelector('.btn-view-details');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateToLastTest(testData.id);
            });
        }

        // También hacer toda la tarjeta clickeable
        DOM.resultsCard.style.cursor = 'pointer';
        DOM.resultsCard.addEventListener('click', () => {
            navigateToLastTest(testData.id);
        });
    }

    /**
     * Navega a los detalles del último test
     */
    function navigateToLastTest(testId) {
        const history = JSON.parse(localStorage.getItem('vocatio_history') || '[]');
        const test = history.find(t => t.id === testId);

        if (!test) {
            alert('No se encontró el test.');
            return;
        }

        // Preparar datos para suggest.html
        const testData = {
            id: test.id,
            date: test.date,
            answers: test.answers,
            timeSpent: test.timeSpent
        };

        localStorage.setItem('vocatio_current_test', JSON.stringify(testData));
        window.location.href = '../pages/suggest.html';
    }

    /**
     * Agrega estilos CSS para los resultados del último test
     */
    function addLastTestStyles() {
        if (document.getElementById('last-test-styles')) return;

        const style = document.createElement('style');
        style.id = 'last-test-styles';
        style.textContent = `
            .last-test-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 1rem 0;
            }

            .career-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: rgba(242, 151, 35, 0.12);
                color: #F29723;
                border: 1px solid rgba(242, 151, 35, 0.35);
                border-radius: 999px;
                padding: 6px 12px;
                font-weight: 700;
                font-size: 0.85rem;
                margin-bottom: 0.5rem;
            }

            .career-badge .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #F29723;
                box-shadow: 0 0 0 3px rgba(242, 151, 35, 0.18) inset;
            }

            .main-career {
                font-size: 1.5rem;
                font-weight: 800;
                color: #0A3D66;
                margin: 0.5rem 0;
                line-height: 1.2;
            }

            .test-date {
                color: #5f6b7a;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }

            .other-careers-preview {
                width: 100%;
                margin-bottom: 1rem;
            }

            .other-careers-preview p {
                color: #5f6b7a;
                font-size: 0.95rem;
                margin-bottom: 0.5rem;
            }

            .other-careers-preview ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .other-careers-preview li {
                margin-bottom: 0.25rem;
                padding-left: 12px;
                position: relative;
                color: #000;
            }

            .other-careers-preview li::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0.55em;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #80BA23;
            }

            .btn-view-details {
                background: #0868A8;
                color: #FFF;
                border: none;
                border-radius: 6px;
                padding: 0.7rem 1.2rem;
                font-weight: 700;
                font-family: 'Roboto', sans-serif;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                margin-top: 0.5rem;
            }

            .btn-view-details:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(8, 104, 168, 0.2);
            }

            .btn-view-details:active {
                transform: translateY(0);
            }

            @media (max-width: 768px) {
                .main-career {
                    font-size: 1.3rem;
                }

                .btn-view-details {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // ========== PROFILE DROPDOWN ==========

    /**
     * Toggle del menú de perfil
     */
    function toggleProfileDropdown(e) {
        e.stopPropagation();
        DOM.dropdownMenu.classList.toggle('show');
        if (DOM.arrow) {
            DOM.arrow.classList.toggle('rotate');
        }
    }

    /**
     * Cierra el dropdown al hacer click fuera
     */
    function closeDropdownOutside(e) {
        if (!DOM.profileButton.contains(e.target) && !DOM.dropdownMenu.contains(e.target)) {
            DOM.dropdownMenu.classList.remove('show');
            if (DOM.arrow) {
                DOM.arrow.classList.remove('rotate');
            }
        }
    }

    // ========== FAVORITOS (si se implementan en el futuro) ==========

    /**
     * Maneja el toggle de favoritos en materiales
     * NOTA: Esta funcionalidad está comentada en el HTML, lista para futura implementación
     */
    function initFavoriteIcons() {
        const favIcons = document.querySelectorAll('.fav-icon');

        if (favIcons.length === 0) return;

        favIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const material = e.target.closest('.material');
                const materialId = getMaterialId(material);

                toggleMaterialFavorite(materialId, icon);
            });
        });
    }

    /**
     * Obtiene un ID único para un material
     */
    function getMaterialId(materialElement) {
        // Usar el src de la imagen como identificador
        const img = materialElement.querySelector('img[alt]');
        return img ? img.alt : 'unknown';
    }

    /**
     * Toggle de favorito para un material
     */
    function toggleMaterialFavorite(materialId, icon) {
        const favorites = JSON.parse(localStorage.getItem('vocatio_favorites') || '[]');

        const index = favorites.indexOf(materialId);

        if (index > -1) {
            // Quitar de favoritos
            favorites.splice(index, 1);
            icon.src = '../assets/img/nofav.png';
        } else {
            // Agregar a favoritos
            favorites.push(materialId);
            icon.src = '../assets/img/fav.png';
        }

        localStorage.setItem('vocatio_favorites', JSON.stringify(favorites));
    }

    /**
     * Restaura el estado de favoritos al cargar
     */
    function restoreFavorites() {
        const favorites = JSON.parse(localStorage.getItem('vocatio_favorites') || '[]');

        document.querySelectorAll('.material').forEach(material => {
            const materialId = getMaterialId(material);
            const icon = material.querySelector('.fav-icon');

            if (icon && favorites.includes(materialId)) {
                icon.src = '../assets/img/fav.png';
            }
        });
    }

    // ========== ESTADÍSTICAS DEL DASHBOARD ==========

    /**
     * Muestra estadísticas rápidas en consola (útil para debugging)
     */
    function logDashboardStats() {
        const history = JSON.parse(localStorage.getItem('vocatio_history') || '[]');
        const favorites = JSON.parse(localStorage.getItem('vocatio_favorites') || '[]');

        console.log('📊 Estadísticas del Dashboard:');
        console.log(`   - Tests realizados: ${history.length}`);
        console.log(`   - Materiales favoritos: ${favorites.length}`);

        if (history.length > 0) {
            const lastTest = history[0];
            console.log(`   - Último test: ${lastTest.dateFormatted}`);
            console.log(`   - Carrera recomendada: ${lastTest.mainCareer}`);
        }
    }

    // ========== VALIDACIÓN Y HELPERS ==========

    /**
     * Verifica si hay datos corruptos y los limpia
     */
    function validateLocalStorage() {
        try {
            const history = localStorage.getItem('vocatio_history');
            if (history) {
                JSON.parse(history);
            }

            const favorites = localStorage.getItem('vocatio_favorites');
            if (favorites) {
                JSON.parse(favorites);
            }

            const tempAnswers = localStorage.getItem('vocatio_temp_answers');
            if (tempAnswers) {
                JSON.parse(tempAnswers);
            }

        } catch (error) {
            console.error('❌ Datos corruptos detectados, limpiando...', error);

            // Backup antes de limpiar
            const backup = {
                history: localStorage.getItem('vocatio_history'),
                favorites: localStorage.getItem('vocatio_favorites'),
                timestamp: new Date().toISOString()
            };

            console.log('💾 Backup creado:', backup);

            // Limpiar datos corruptos
            if (error.message.includes('history')) {
                localStorage.removeItem('vocatio_history');
            }
            if (error.message.includes('favorites')) {
                localStorage.removeItem('vocatio_favorites');
            }
        }
    }

    // ========== INICIALIZACIÓN ==========

    /**
     * Inicializa el dashboard
     */
    function init() {
        // Validar localStorage
        validateLocalStorage();

        // Cargar último test
        loadLastTestResults();

        // Profile dropdown
        if (DOM.profileButton && DOM.dropdownMenu) {
            DOM.profileButton.addEventListener('click', toggleProfileDropdown);
            document.addEventListener('click', closeDropdownOutside);
        }

        // Favoritos (si están habilitados)
        // initFavoriteIcons();
        // restoreFavorites();

        // Log de estadísticas
        logDashboardStats();

        console.log('✅ Dashboard inicializado correctamente');
    }

    // Ejecutar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();