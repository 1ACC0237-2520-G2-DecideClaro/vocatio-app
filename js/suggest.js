/**
Librerías usadas:
- Chart.js - Para visualización de resultados en gráfico de pastel
- LocalStorage API (nativa) - Para recuperar datos del test y guardar evaluaciones
*/

(function() {
    'use strict';

    // ========== CONFIGURACIÓN DE CARRERAS ==========

    /**
     * Base de conocimiento: carreras y sus perfiles de respuesta
     * Cada carrera tiene pesos para diferentes tipos de respuestas
     */
    const CAREER_PROFILES = {
        'Ingeniería de Software': {
            likert: { high: [1, 2, 3, 5, 9], medium: [4, 7, 8, 10] },
            multiple: {
                preferred: { q12: 'a', q13: 'a', q16: 'c', q17: 'a', q18: 'a', q19: 'a' },
                secondary: { q11: 'a', q14: 'a', q15: 'a' }
            },
            yesno: {
                yes: [20, 21, 22, 23, 30, 32, 35],
                no: [28, 31]
            },
            weight: 1.0
        },
        'Ingeniería Industrial': {
            likert: { high: [1, 4, 7, 8], medium: [3, 6, 10] },
            multiple: {
                preferred: { q12: 'd', q14: 'c', q15: 'd', q17: 'd', q18: 'a' },
                secondary: { q11: 'a', q13: 'c', q16: 'c' }
            },
            yesno: {
                yes: [21, 23, 27, 29, 30, 34, 35],
                no: [26, 28]
            },
            weight: 0.9
        },
        'Ciencias de la Computación': {
            likert: { high: [1, 2, 3, 9], medium: [5, 10] },
            multiple: {
                preferred: { q11: 'a', q12: 'a', q13: 'a', q17: 'a', q18: 'a', q19: 'a' },
                secondary: { q14: 'a', q15: 'a', q16: 'c' }
            },
            yesno: {
                yes: [20, 21, 22, 23, 26, 29, 30, 32],
                no: [28, 31, 33]
            },
            weight: 0.95
        },
        'Diseño de Experiencia de Usuario': {
            likert: { high: [5, 6, 8], medium: [2, 4, 7] },
            multiple: {
                preferred: { q12: 'b', q13: 'b', q15: 'b', q16: 'd', q17: 'c' },
                secondary: { q11: 'b', q14: 'b', q18: 'a', q19: 'c' }
            },
            yesno: {
                yes: [20, 22, 27, 33, 34, 35],
                no: [23, 26, 28]
            },
            weight: 0.85
        },
        'Psicología': {
            likert: { high: [6, 8], medium: [4, 7, 10] },
            multiple: {
                preferred: { q11: 'b', q13: 'c', q15: 'b', q17: 'b', q18: 'c' },
                secondary: { q12: 'c', q14: 'd', q16: 'a', q19: 'b' }
            },
            yesno: {
                yes: [27, 29, 31, 34, 35],
                no: [20, 23, 26, 32]
            },
            weight: 0.8
        },
        'Medicina': {
            likert: { high: [6, 10], medium: [1, 4, 8] },
            multiple: {
                preferred: { q13: 'c', q14: 'd', q15: 'b', q16: 'a', q17: 'b', q19: 'd' },
                secondary: { q11: 'a', q12: 'd', q18: 'a' }
            },
            yesno: {
                yes: [21, 28, 29, 31, 34, 35],
                no: [20, 23, 26, 32]
            },
            weight: 0.85
        },
        'Administración de Empresas': {
            likert: { high: [4, 7, 8], medium: [3, 6, 10] },
            multiple: {
                preferred: { q11: 'b', q12: 'c', q14: 'c', q15: 'd', q17: 'd', q18: 'a' },
                secondary: { q13: 'd', q16: 'c', q19: 'a' }
            },
            yesno: {
                yes: [27, 29, 30, 34, 35],
                no: [20, 26, 28, 32]
            },
            weight: 0.8
        },
        'Comunicación Social': {
            likert: { high: [6, 8], medium: [2, 5, 7] },
            multiple: {
                preferred: { q11: 'b', q12: 'c', q13: 'd', q15: 'c', q17: 'b' },
                secondary: { q14: 'b', q16: 'b', q18: 'c', q19: 'c' }
            },
            yesno: {
                yes: [27, 31, 33, 34],
                no: [20, 21, 23, 26, 32]
            },
            weight: 0.75
        }
    };

    // ========== ESTADO Y DOM ==========

    let currentTestData = null;
    let calculatedResults = null;
    let chartInstance = null;

    const DOM = {
    mainCareer: document.getElementById('mainCareer'),
    otherCareersList: document.querySelector('.other-careers ul'),
    summaryText: document.querySelector('.summary p'),
    chartCanvas: document.getElementById('careerChart'),
    favIcon: document.querySelector('.fav-toggle'),
    deleteBtn: document.querySelector('.delete-btn'),
    deleteModal: document.getElementById('deleteModal'),
    confirmDelete: document.getElementById('confirmDelete'),
    modalCancel: document.getElementById('modalCancel'),
    profileButton: document.getElementById('profileButton'),
    dropdownMenu: document.getElementById('dropdownMenu'),
    downloadBtn: document.getElementById('downloadBtn'),
    reportContainer: document.querySelector('.suggest-container')
};


    // ========== ALGORITMO DE CÁLCULO DE AFINIDAD ==========

    /**
     * Calcula el score de afinidad para una carrera específica
     * @param {Object} answers - Respuestas del usuario
     * @param {Object} profile - Perfil de la carrera
     * @returns {number} Score de 0 a 100
     */
    function calculateCareerScore(answers, profile) {
        let totalScore = 0;
        let maxPossibleScore = 0;

        // 1. Evaluar preguntas Likert (Q1-Q10) - Peso: 35%
        const likertWeight = 35;
        let likertScore = 0;
        const likertMax = (profile.likert.high.length * 5 + profile.likert.medium.length * 3);

        profile.likert.high.forEach(qNum => {
            const answer = parseInt(answers[`q${qNum}`]) || 0;
            likertScore += answer; // Escala 1-5
        });

        profile.likert.medium.forEach(qNum => {
            const answer = parseInt(answers[`q${qNum}`]) || 0;
            likertScore += answer * 0.6; // Peso reducido
        });

        totalScore += (likertScore / likertMax) * likertWeight;
        maxPossibleScore += likertWeight;

        // 2. Evaluar opciones múltiples (Q11-Q19) - Peso: 40%
        const multipleWeight = 40;
        let multipleScore = 0;
        const preferredKeys = Object.keys(profile.multiple.preferred);
        const secondaryKeys = Object.keys(profile.multiple.secondary);
        const multipleMax = preferredKeys.length * 2 + secondaryKeys.length;

        preferredKeys.forEach(qName => {
            if (answers[qName] === profile.multiple.preferred[qName]) {
                multipleScore += 2; // Peso alto para respuestas preferidas
            }
        });

        secondaryKeys.forEach(qName => {
            if (answers[qName] === profile.multiple.secondary[qName]) {
                multipleScore += 1; // Peso medio
            }
        });

        totalScore += (multipleScore / multipleMax) * multipleWeight;
        maxPossibleScore += multipleWeight;

        // 3. Evaluar Sí/No (Q20-Q35) - Peso: 25%
        const yesnoWeight = 25;
        let yesnoScore = 0;
        const yesMax = profile.yesno.yes.length + profile.yesno.no.length;

        profile.yesno.yes.forEach(qNum => {
            if (answers[`q${qNum}`] === 'yes') {
                yesnoScore += 1;
            }
        });

        profile.yesno.no.forEach(qNum => {
            if (answers[`q${qNum}`] === 'no') {
                yesnoScore += 1;
            }
        });

        totalScore += (yesnoScore / yesMax) * yesnoWeight;
        maxPossibleScore += yesnoWeight;

        // Normalizar a 0-100 y aplicar peso de carrera
        const normalizedScore = (totalScore / maxPossibleScore) * 100 * profile.weight;

        return Math.min(100, Math.max(0, normalizedScore));
    }

    /**
     * Calcula scores para todas las carreras y las ordena
     * @param {Object} answers - Respuestas del test
     * @returns {Array} Array de {name, score} ordenado descendentemente
     */
    function calculateAllScores(answers) {
        const results = [];

        Object.keys(CAREER_PROFILES).forEach(careerName => {
            const profile = CAREER_PROFILES[careerName];
            const score = calculateCareerScore(answers, profile);

            results.push({
                name: careerName,
                score: score,
                percentage: Math.round(score)
            });
        });

        // Ordenar de mayor a menor score
        results.sort((a, b) => b.score - a.score);

        return results;
    }

    /**
     * Genera un resumen personalizado basado en las respuestas
     * @param {Object} answers - Respuestas del usuario
     * @param {string} topCareer - Carrera con mayor afinidad
     * @returns {string} Texto del resumen
     */
    function generateSummary(answers, topCareer) {
        // Analizar patrones en las respuestas
        let highLikertCount = 0;
        for (let i = 1; i <= 10; i++) {
            if (parseInt(answers[`q${i}`]) >= 4) {
                highLikertCount++;
            }
        }

        let techInterest = (answers.q20 === 'yes' && answers.q22 === 'yes') ? true : false;
        let teamwork = answers.q27 === 'yes';
        let analytical = answers.q29 === 'yes';
        let creative = answers.q33 === 'yes';
        let helpingOthers = answers.q31 === 'yes';

        // Construir resumen personalizado
        let summary = '';

        if (topCareer.includes('Ingeniería') || topCareer.includes('Computación')) {
            summary = 'Mostraste gran afinidad por la resolución de problemas, la curiosidad tecnológica y la innovación. ';
            if (analytical) {
                summary += 'Tu capacidad analítica y metódica es una fortaleza importante. ';
            }
            if (teamwork) {
                summary += 'Además, tu disposición para trabajar en equipo te permitirá colaborar efectivamente en proyectos técnicos. ';
            }
        } else if (topCareer.includes('Diseño') || topCareer.includes('Comunicación')) {
            summary = 'Tus respuestas reflejan una fuerte inclinación creativa y habilidades de comunicación. ';
            if (creative) {
                summary += 'Tu interés por el diseño y la creación visual son aspectos destacables. ';
            }
            if (helpingOthers) {
                summary += 'Tu empatía y deseo de impactar positivamente en otros complementa tu perfil profesional. ';
            }
        } else if (topCareer.includes('Psicología') || topCareer.includes('Medicina')) {
            summary = 'Demostraste una clara orientación hacia el servicio y la comprensión del ser humano. ';
            if (helpingOthers) {
                summary += 'Tu vocación por ayudar a otros es evidente en tus respuestas. ';
            }
            if (analytical) {
                summary += 'Tu capacidad de análisis te permitirá abordar casos complejos con metodología. ';
            }
        } else {
            summary = 'Tus respuestas muestran un perfil equilibrado con intereses diversos. ';
            if (highLikertCount >= 7) {
                summary += 'Tu alta motivación y compromiso son cualidades valiosas para cualquier carrera. ';
            }
        }

        summary += 'Estos resultados te orientarán en tu elección, pero recuerda explorar más sobre cada opción.';

        return summary;
    }

    // ========== VISUALIZACIÓN Y UI ==========

    /**
     * Renderiza el gráfico de pastel con Chart.js
     * @param {Array} topCareers - Top 4 carreras con scores
     */
    function renderChart(topCareers) {
        const ctx = DOM.chartCanvas;

        // Destruir gráfico previo si existe
        if (chartInstance) {
            chartInstance.destroy();
        }

        const labels = topCareers.map(c => c.name);
        const data = topCareers.map(c => c.percentage);
        const colors = ['#F29723', '#80BA23', '#1F80C1', '#0A3D66'];

        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: '#FFFFFF',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 13,
                                family: "'Roboto', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Actualiza la UI con los resultados calculados
     * @param {Array} results - Resultados ordenados
     * @param {Object} answers - Respuestas originales
     */
    function displayResults(results, answers) {
        // Top 4 para el gráfico
        const top4 = results.slice(0, 4);

        // Carrera principal
        const mainCareer = results[0];
        DOM.mainCareer.textContent = mainCareer.name;

        // Otras afinidades (posiciones 2-4)
        DOM.otherCareersList.innerHTML = '';
        results.slice(1, 4).forEach(career => {
            const li = document.createElement('li');
            li.textContent = `${career.name} (${career.percentage}%)`;
            DOM.otherCareersList.appendChild(li);
        });

        // Resumen personalizado
        const summary = generateSummary(answers, mainCareer.name);
        DOM.summaryText.textContent = summary;

        // Renderizar gráfico
        renderChart(top4);

        // Animación de entrada
        document.querySelector('.main-result').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.main-result').style.transition = 'opacity 0.6s';
            document.querySelector('.main-result').style.opacity = '1';
        }, 100);
    }

    // ========== GESTIÓN DE EVALUACIONES (HISTORIAL) ==========

    /**
     * Guarda la evaluación actual en el historial
     * @param {Object} testData - Datos del test
     * @param {Array} results - Resultados calculados
     */
    function saveToHistory(testData, results) {
        // Obtener historial existente
        const history = JSON.parse(localStorage.getItem('vocatio_history') || '[]');

        // Crear entrada de historial
        const entry = {
            id: testData.id,
            date: testData.date,
            dateFormatted: formatDate(new Date(testData.date)),
            mainCareer: results[0].name,
            mainScore: results[0].percentage,
            otherCareers: results.slice(1, 4).map(r => r.name),
            answers: testData.answers,
            results: results,
            timeSpent: testData.timeSpent,
            isFavorite: false
        };

        // Agregar al inicio del array
        history.unshift(entry);

        // Limitar a 50 evaluaciones máximo
        if (history.length > 50) {
            history.pop();
        }

        // Guardar
        localStorage.setItem('vocatio_history', JSON.stringify(history));

        console.log('✅ Evaluación guardada en historial:', entry.id);
    }

    /**
     * Formatea una fecha a formato legible
     */
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // ========== EVENT LISTENERS ==========

    /**
     * Maneja el toggle de favorito
     */
    function handleFavoriteToggle() {
        if (!currentTestData) return;

        const history = JSON.parse(localStorage.getItem('vocatio_history') || '[]');
        const entry = history.find(e => e.id === currentTestData.id);

        if (entry) {
            entry.isFavorite = !entry.isFavorite;
            localStorage.setItem('vocatio_history', JSON.stringify(history));

            // Actualizar UI
            DOM.favIcon.src = entry.isFavorite ? '../assets/img/fav.png' : '../assets/img/nofav.png';
            DOM.favIcon.setAttribute('aria-pressed', String(entry.isFavorite));
        }
    }

    /**
     * Maneja la eliminación de la evaluación
     */
    function handleDelete() {
        DOM.deleteModal.hidden = false;
    }

    function confirmDeleteEvaluation() {
        if (!currentTestData) return;

        const history = JSON.parse(localStorage.getItem('vocatio_history') || '[]');
        const filtered = history.filter(e => e.id !== currentTestData.id);

        localStorage.setItem('vocatio_history', JSON.stringify(filtered));
        localStorage.removeItem('vocatio_current_test');

        DOM.deleteModal.hidden = true;

        alert('Evaluación eliminada correctamente');
        window.location.href = 'history.html';
    }

    function cancelDelete() {
        DOM.deleteModal.hidden = true;
    }

    /**
     * Profile dropdown
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

        /**Genera un PDF del informe completo y lo descarga*/
    async function handleDownloadPdf() {
        if (!DOM.reportContainer) return;

        try {
            // Tomar el contenedor principal del informe
            const element = DOM.reportContainer;

            // Capturar como imagen (más resolución con scale:2)
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                scrollY: -window.scrollY
            });

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Ajustar la imagen para que quepa en una página manteniendo proporción
            const imgWidthPx = canvas.width;
            const imgHeightPx = canvas.height;

            const ratio = Math.min(
                pageWidth / imgWidthPx,
                pageHeight / imgHeightPx
            );

            const pdfWidth = imgWidthPx * ratio;
            const pdfHeight = imgHeightPx * ratio;

            const marginX = (pageWidth - pdfWidth) / 2;
            const marginY = (pageHeight - pdfHeight) / 2;

            pdf.addImage(
                imgData,
                'PNG',
                marginX,
                marginY,
                pdfWidth,
                pdfHeight,
                undefined,
                'FAST'
            );

            const fileName = `vocatio_informe_${currentTestData?.id || 'test'}.pdf`;
            pdf.save(fileName);
        } catch (err) {
            console.error('Error al generar el PDF:', err);
            alert('Hubo un problema al generar el PDF. Intenta nuevamente.');
        }
    }


    // ========== INICIALIZACIÓN ==========

    /**
     * Inicializa el módulo de sugerencias
     */
    function init() {
        // Cargar datos del test actual
        const testDataString = localStorage.getItem('vocatio_current_test');

        if (!testDataString) {
            alert('No se encontraron datos del test. Serás redirigido al dashboard.');
            window.location.href = 'dashboard.html';
            return;
        }

        try {
            currentTestData = JSON.parse(testDataString);

            // Calcular resultados
            calculatedResults = calculateAllScores(currentTestData.answers);

            // Mostrar resultados
            displayResults(calculatedResults, currentTestData.answers);

            // Guardar en historial
            saveToHistory(currentTestData, calculatedResults);

            // Event listeners
            if (DOM.favIcon) {
                DOM.favIcon.addEventListener('click', handleFavoriteToggle);
                DOM.favIcon.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleFavoriteToggle();
                    }
                });
            }

            if (DOM.deleteBtn) {
                DOM.deleteBtn.addEventListener('click', handleDelete);
            }

            if (DOM.confirmDelete) {
                DOM.confirmDelete.addEventListener('click', confirmDeleteEvaluation);
            }

            if (DOM.modalCancel) {
                DOM.modalCancel.addEventListener('click', cancelDelete);
            }

            if (DOM.deleteModal) {
                DOM.deleteModal.addEventListener('click', (e) => {
                    if (e.target === DOM.deleteModal) cancelDelete();
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') cancelDelete();
                });
            }

            if (DOM.profileButton && DOM.dropdownMenu) {
                DOM.profileButton.addEventListener('click', toggleProfileDropdown);
                document.addEventListener('click', closeDropdownOutside);
            }
            if (DOM.downloadBtn) {
                DOM.downloadBtn.addEventListener('click', handleDownloadPdf);
                DOM.downloadBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDownloadPdf();
                    }
                });
            }
            // Si venimos desde el historial con auto-descarga activada
            const autoDownload = localStorage.getItem('vocatio_auto_download');
            if (autoDownload === '1') {
                // Limpiamos la bandera para no repetir en futuras visitas
                localStorage.removeItem('vocatio_auto_download');

                // Pequeño delay para asegurarnos de que todo se haya renderizado
                setTimeout(() => {
                    if (typeof handleDownloadPdf === 'function') {
                        handleDownloadPdf();
                    }
                }, 400);
            }

            console.log('✅ Módulo de sugerencias inicializado');
            console.log('📊 Resultados:', calculatedResults);

        } catch (error) {
            console.error('❌ Error procesando resultados:', error);
            alert('Hubo un error al procesar tus resultados. Intenta nuevamente.');
            window.location.href = 'dashboard.html';
        }
    }

    // Ejecutar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();