/**
 * test.js - Módulo 2: Evaluación de Intereses Vocacionales
 * Funcionalidad 1: Test vocacional interactivo con validaciones
 * Autor: DecideClaro - Vocatio
 *
 * Librerías usadas:
 * - Google Analytics (gtag.js) - Para tracking de interacciones del usuario
 * - LocalStorage API (nativa) - Para guardar respuestas temporales
 */

(function() {
    'use strict';

    // ========== CONFIGURACIÓN Y ESTADO ==========
    const STATE = {
        currentSection: 0,
        totalSections: 3,
        answers: {},
        startTime: null,
        sectionTimes: [0, 0, 0]
    };

    // Referencias del DOM
    const DOM = {
        sections: Array.from(document.querySelectorAll('.section')),
        btnPrev: document.getElementById('btnPrev'),
        btnNext: document.getElementById('btnNext'),
        btnFinish: document.getElementById('btnFinish'),
        sectionNumber: document.getElementById('currentSectionNumber'),
        sectionType: document.getElementById('sectionType'),
        profileButton: document.getElementById('profileButton'),
        dropdownMenu: document.getElementById('dropdownMenu'),
        arrow: document.querySelector('.arrow-down'),
        form: document.getElementById('vocationalTest')
    };

    // Configuración de secciones
    const SECTION_CONFIG = [
        {
            name: 'Escala Likert (1 a 5)',
            questions: Array.from({length: 10}, (_, i) => `q${i + 1}`),
            type: 'likert'
        },
        {
            name: 'Opción múltiple',
            questions: Array.from({length: 9}, (_, i) => `q${i + 11}`),
            type: 'multiple'
        },
        {
            name: 'Preguntas de Sí / No',
            questions: Array.from({length: 16}, (_, i) => `q${i + 20}`),
            type: 'yesno'
        }
    ];

    // ========== FUNCIONES DE VALIDACIÓN ==========

    /**
     * Valida si todas las preguntas de una sección están respondidas
     * @param {number} sectionIndex - Índice de la sección a validar
     * @returns {Object} {isValid: boolean, missing: Array}
     */
    function validateSection(sectionIndex) {
        const config = SECTION_CONFIG[sectionIndex];
        const missing = [];

        config.questions.forEach(qName => {
            const answered = isQuestionAnswered(qName, config.type);
            if (!answered) {
                missing.push(qName);
            }
        });

        return {
            isValid: missing.length === 0,
            missing: missing
        };
    }

    /**
     * Verifica si una pregunta específica ha sido respondida
     * @param {string} questionName - Nombre de la pregunta (ej: 'q1')
     * @param {string} type - Tipo de pregunta
     * @returns {boolean}
     */
    function isQuestionAnswered(questionName, type) {
        if (type === 'likert' || type === 'multiple') {
            const input = document.querySelector(`input[name="${questionName}"]:checked`);
            return input !== null;
        }
        if (type === 'yesno') {
            const hidden = document.querySelector(`input[name="${questionName}"]`);
            return hidden && hidden.value !== '';
        }
        return false;
    }

    /**
     * Muestra mensaje de error visual en preguntas no respondidas
     * @param {Array} missingQuestions - Array de nombres de preguntas faltantes
     */
    function highlightMissingQuestions(missingQuestions) {
        // Remover highlights previos
        document.querySelectorAll('.question-error').forEach(el => {
            el.classList.remove('question-error');
        });

        missingQuestions.forEach(qName => {
            const qNum = qName.replace('q', '');
            const questionElement = document.querySelector(`[data-q="${qNum}"]`)?.closest('.question, .qblock');
            if (questionElement) {
                questionElement.classList.add('question-error');
                // Agregar estilo temporal si no existe
                if (!document.getElementById('error-style')) {
                    const style = document.createElement('style');
                    style.id = 'error-style';
                    style.textContent = `
                        .question-error { 
                            animation: shake 0.3s; 
                            border-left: 3px solid #FF383C; 
                            padding-left: 8px;
                        }
                        @keyframes shake {
                            0%, 100% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            75% { transform: translateX(5px); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        });

        // Scroll a la primera pregunta no respondida
        const firstError = document.querySelector('.question-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // ========== NAVEGACIÓN ENTRE SECCIONES ==========

    /**
     * Muestra una sección específica del test
     * @param {number} index - Índice de la sección a mostrar
     */
    function showSection(index) {
        // Guardar tiempo de la sección anterior
        if (STATE.startTime) {
            STATE.sectionTimes[STATE.currentSection] += Date.now() - STATE.startTime;
        }

        DOM.sections.forEach((section, i) => {
            section.hidden = i !== index;
        });

        STATE.currentSection = index;
        STATE.startTime = Date.now();

        // Actualizar UI
        DOM.sectionNumber.textContent = index + 1;
        DOM.sectionType.textContent = SECTION_CONFIG[index].name;

        // Botones de navegación
        DOM.btnPrev.style.display = index === 0 ? 'none' : 'inline-block';
        DOM.btnNext.style.display = index === STATE.totalSections - 1 ? 'none' : 'inline-block';
        DOM.btnFinish.hidden = index !== STATE.totalSections - 1;

        // Scroll suave al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Google Analytics: track cambio de sección
        trackSectionChange(index);
    }

    /**
     * Guarda las respuestas actuales en el estado
     */
    function saveCurrentAnswers() {
        const config = SECTION_CONFIG[STATE.currentSection];

        config.questions.forEach(qName => {
            if (config.type === 'likert' || config.type === 'multiple') {
                const checked = document.querySelector(`input[name="${qName}"]:checked`);
                if (checked) {
                    STATE.answers[qName] = checked.value;
                }
            } else if (config.type === 'yesno') {
                const hidden = document.querySelector(`input[name="${qName}"]`);
                if (hidden && hidden.value) {
                    STATE.answers[qName] = hidden.value;
                }
            }
        });

        // Guardar en localStorage como respaldo temporal
        localStorage.setItem('vocatio_temp_answers', JSON.stringify(STATE.answers));
    }

    /**
     * Restaura respuestas guardadas temporalmente
     */
    function restoreAnswers() {
        const saved = localStorage.getItem('vocatio_temp_answers');
        if (saved) {
            try {
                STATE.answers = JSON.parse(saved);

                // Restaurar en el DOM
                Object.keys(STATE.answers).forEach(qName => {
                    const value = STATE.answers[qName];
                    const input = document.querySelector(`input[name="${qName}"][value="${value}"]`);

                    if (input) {
                        input.checked = true;
                        // Trigger visual feedback
                        const span = input.nextElementSibling;
                        if (span && span.classList.contains('likert-btn')) {
                            span.classList.add('selected');
                        }
                    } else {
                        // Para yes/no
                        const hidden = document.querySelector(`input[name="${qName}"]`);
                        if (hidden) {
                            hidden.value = value;
                            const btn = document.querySelector(`.yn-btn[data-q="${qName.replace('q', '')}"][data-val="${value}"]`);
                            if (btn) btn.classList.add('active');
                        }
                    }
                });
            } catch (e) {
                console.error('Error restaurando respuestas:', e);
            }
        }
    }

    // ========== EVENT LISTENERS ==========

    /**
     * Inicializa todos los event listeners del test
     */
    function initEventListeners() {
        // Botón Siguiente
        DOM.btnNext.addEventListener('click', handleNextClick);

        // Botón Atrás
        DOM.btnPrev.addEventListener('click', handlePrevClick);

        // Botón Finalizar
        DOM.btnFinish.addEventListener('click', handleFinishClick);

        // Likert buttons - click en el span visual
        document.querySelectorAll('.likert label').forEach(label => {
            label.addEventListener('click', handleLikertClick);
        });

        // Yes/No buttons
        document.querySelectorAll('.yn-btn').forEach(btn => {
            btn.addEventListener('click', handleYesNoClick);
        });

        // Multiple choice - tracking de cambios
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', handleRadioChange);
        });

        // Profile dropdown
        if (DOM.profileButton && DOM.dropdownMenu) {
            DOM.profileButton.addEventListener('click', toggleProfileDropdown);
            document.addEventListener('click', closeDropdownOutside);
        }

        // Prevenir pérdida de datos al salir
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Teclado para navegación
        document.addEventListener('keydown', handleKeyboardNav);
    }

    // ========== HANDLERS DE EVENTOS ==========

    function handleNextClick(e) {
        e.preventDefault();

        // Validar sección actual
        const validation = validateSection(STATE.currentSection);

        if (!validation.isValid) {
            const questionCount = validation.missing.length;
            alert(`Por favor responde ${questionCount === 1 ? 'la pregunta faltante' : `las ${questionCount} preguntas faltantes`} antes de continuar.`);
            highlightMissingQuestions(validation.missing);

            // Google Analytics: track error de validación
            trackValidationError(STATE.currentSection, questionCount);
            return;
        }

        // Guardar respuestas y avanzar
        saveCurrentAnswers();
        showSection(STATE.currentSection + 1);

        // Google Analytics: track progreso
        trackProgress(STATE.currentSection + 1);
    }

    function handlePrevClick(e) {
        e.preventDefault();
        saveCurrentAnswers();
        showSection(STATE.currentSection - 1);
    }

    function handleFinishClick(e) {
        e.preventDefault();

        // Validar todas las secciones
        let allValid = true;
        let firstInvalidSection = -1;

        for (let i = 0; i < STATE.totalSections; i++) {
            const validation = validateSection(i);
            if (!validation.isValid) {
                allValid = false;
                if (firstInvalidSection === -1) {
                    firstInvalidSection = i;
                }
            }
        }

        if (!allValid) {
            alert('Por favor completa todas las preguntas antes de finalizar el test.');
            showSection(firstInvalidSection);
            return;
        }

        // Guardar última sección
        saveCurrentAnswers();

        // Calcular tiempo total
        const totalTime = STATE.sectionTimes.reduce((a, b) => a + b, 0) + (Date.now() - STATE.startTime);

        // Preparar datos para guardar
        const testData = {
            id: 'test_' + Date.now(),
            date: new Date().toISOString(),
            answers: STATE.answers,
            timeSpent: totalTime,
            sectionTimes: STATE.sectionTimes
        };

        // Guardar en localStorage (se procesará en suggest.js)
        localStorage.setItem('vocatio_current_test', JSON.stringify(testData));
        localStorage.removeItem('vocatio_temp_answers');

        // Google Analytics: track finalización
        trackTestCompletion(totalTime);

        // Redirigir a página de resultados
        window.location.href = 'suggest.html';
    }

    function handleLikertClick(e) {
        const label = e.currentTarget;
        const container = label.closest('.likert');

        setTimeout(() => {
            const checked = container.querySelector('input:checked');
            if (checked) {
                // Remover selección visual previa
                container.querySelectorAll('.likert-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });

                // Agregar a la nueva
                const span = checked.nextElementSibling;
                if (span) {
                    span.classList.add('selected');
                }

                // Remover error si existía
                const question = container.closest('.question');
                if (question) {
                    question.classList.remove('question-error');
                }
            }
        }, 10);
    }

    function handleYesNoClick(e) {
        const btn = e.currentTarget;
        const qNum = btn.dataset.q;
        const val = btn.dataset.val;

        // Actualizar input hidden
        const hidden = document.querySelector(`input[name="q${qNum}"]`);
        if (hidden) {
            hidden.value = val;
        }

        // Actualizar estilos visuales
        const group = btn.parentElement;
        group.querySelectorAll('.yn-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // Remover error
        const question = btn.closest('.qblock');
        if (question) {
            question.classList.remove('question-error');
        }

        // Google Analytics: track respuesta yes/no
        trackAnswer('yesno', qNum, val);
    }

    function handleRadioChange(e) {
        const radio = e.target;
        const qName = radio.name;
        const value = radio.value;

        // Remover error
        const question = radio.closest('.question, .multi');
        if (question) {
            question.classList.remove('question-error');
        }

        // Google Analytics
        const qNum = qName.replace('q', '');
        const type = parseInt(qNum) <= 10 ? 'likert' : 'multiple';
        trackAnswer(type, qNum, value);
    }

    function toggleProfileDropdown(e) {
        e.stopPropagation();
        const expanded = DOM.profileButton.getAttribute('aria-expanded') === 'true';
        DOM.profileButton.setAttribute('aria-expanded', String(!expanded));
        DOM.dropdownMenu.classList.toggle('show');
        if (DOM.arrow) {
            DOM.arrow.classList.toggle('rotate');
        }
    }

    function closeDropdownOutside(e) {
        if (!DOM.profileButton.contains(e.target) && !DOM.dropdownMenu.contains(e.target)) {
            DOM.dropdownMenu.classList.remove('show');
            DOM.profileButton.setAttribute('aria-expanded', 'false');
            if (DOM.arrow) {
                DOM.arrow.classList.remove('rotate');
            }
        }
    }

    function handleBeforeUnload(e) {
        // Si hay respuestas sin guardar, advertir
        const hasAnswers = Object.keys(STATE.answers).length > 0;
        const hasTemp = localStorage.getItem('vocatio_temp_answers');

        if (hasAnswers || hasTemp) {
            e.preventDefault();
            e.returnValue = '¿Estás seguro? Tus respuestas se perderán si abandonas esta página.';
            return e.returnValue;
        }
    }

    function handleKeyboardNav(e) {
        // Solo si no está escribiendo en un input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowRight' && !DOM.btnNext.hidden) {
            DOM.btnNext.click();
        }
        if (e.key === 'ArrowLeft' && DOM.btnPrev.style.display !== 'none') {
            DOM.btnPrev.click();
        }
    }

    // ========== GOOGLE ANALYTICS TRACKING ==========

    /**
     * Track cambio de sección
     */
    function trackSectionChange(sectionIndex) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'section_view', {
                event_category: 'test_navigation',
                event_label: `section_${sectionIndex + 1}`,
                section_name: SECTION_CONFIG[sectionIndex].name
            });
        }
    }

    /**
     * Track error de validación
     */
    function trackValidationError(sectionIndex, missingCount) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'validation_error', {
                event_category: 'test_errors',
                event_label: `section_${sectionIndex + 1}`,
                missing_questions: missingCount
            });
        }
    }

    /**
     * Track progreso del test
     */
    function trackProgress(sectionIndex) {
        const progress = Math.round((sectionIndex / STATE.totalSections) * 100);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'test_progress', {
                event_category: 'test_engagement',
                event_label: `${progress}%`,
                value: progress
            });
        }
    }

    /**
     * Track respuesta individual
     */
    function trackAnswer(type, questionNum, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'question_answered', {
                event_category: 'test_interaction',
                event_label: `${type}_q${questionNum}`,
                answer_value: value
            });
        }
    }

    /**
     * Track finalización del test
     */
    function trackTestCompletion(totalTime) {
        const timeInSeconds = Math.round(totalTime / 1000);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'test_completed', {
                event_category: 'test_completion',
                event_label: 'vocational_test',
                value: timeInSeconds,
                time_spent: timeInSeconds
            });
        }
    }

    // ========== INICIALIZACIÓN ==========

    /**
     * Inicializa el módulo del test
     */
    function init() {
        // Restaurar respuestas previas si existen
        restoreAnswers();

        // Mostrar primera sección
        showSection(0);

        // Inicializar eventos
        initEventListeners();

        // Marcar inicio
        STATE.startTime = Date.now();

        // Google Analytics: track inicio del test
        if (typeof gtag !== 'undefined') {
            gtag('event', 'test_started', {
                event_category: 'test_engagement',
                event_label: 'vocational_test'
            });
        }

        console.log('✅ Test vocacional inicializado correctamente');
    }

    // Ejecutar al cargar el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();