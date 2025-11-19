(function () {
    'use strict';

    const DOM = {
        selectLeft: document.getElementById('selectLeft'),
        selectRight: document.getElementById('selectRight'),
        chartLeft: document.getElementById('chartLeft'),
        chartRight: document.getElementById('chartRight'),
        careersLeft: document.getElementById('careersLeft'),
        careersRight: document.getElementById('careersRight'),
        summaryLeft: document.getElementById('summaryLeft'),
        summaryRight: document.getElementById('summaryRight'),
        answersLeft: document.getElementById('answersLeft'),
        answersRight: document.getElementById('answersRight'),
        profileButton: document.getElementById('profileButton'),
        dropdownMenu: document.getElementById('dropdownMenu')
    };

    let historyData = [];
    let chartLeftInstance = null;
    let chartRightInstance = null;


    const QUESTIONS = {
        1:  'Me gusta resolver problemas lógicos o de cálculo.',
        2:  'Disfruto aprender cómo funcionan las tecnologías que uso.',
        3:  'Me siento cómodo trabajando con datos o información numérica.',
        4:  'Prefiero entender la causa de un problema antes de buscar una solución rápida.',
        5:  'Me entusiasma la idea de crear algo nuevo usando software o herramientas digitales.',
        6:  'Me interesa aplicar la tecnología para mejorar la calidad de vida de las personas.',
        7:  'Me considero una persona metódica y organizada al trabajar.',
        8:  'Me motiva participar en proyectos colaborativos donde cada integrante cumple un rol técnico.',
        9:  'Siento curiosidad por los avances en inteligencia artificial, robótica o biotecnología.',
        10: 'Puedo mantener la calma y analizar una situación cuando algo falla o no funciona como esperaba.',

        11: 'Cuando enfrento un problema difícil, suelo:',
        12: 'En un proyecto, prefiero encargarme de:',
        13: '¿Qué actividad te resulta más atractiva?',
        14: '¿Qué tipo de entorno laboral prefieres?',
        15: '¿Qué habilidad valoras más en ti mismo?',
        16: 'Si pudieras desarrollar una app, ¿qué tipo harías?',
        17: '¿Qué te motiva más en una carrera?',
        18: '¿Cómo manejas los errores en tu trabajo o estudios?',
        19: 'Si tuvieras que elegir un proyecto universitario, sería:',

        20: '¿Te gusta trabajar con computadoras o dispositivos tecnológicos?',
        21: '¿Te resulta fácil entender conceptos científicos o matemáticos?',
        22: '¿Te interesa saber cómo se construyen los programas o aplicaciones?',
        23: '¿Te atrae la idea de estudiar una carrera en ingeniería?',
        24: '¿Consideras que tienes buena memoria para datos o fórmulas?',
        25: '¿Te gustaría trabajar en un laboratorio o entorno técnico?',
        26: '¿Prefieres los trabajos individuales antes que los grupales?',
        27: '¿Te sientes cómodo comunicando tus ideas frente a otras personas?',
        28: '¿Te llama la atención la biología o la medicina?',
        29: '¿Sueles analizar tus decisiones antes de tomarlas?',
        30: '¿Crees tener una buena capacidad para detectar errores o inconsistencias?',
        31: '¿Disfrutas ayudar a otros a resolver problemas personales o emocionales?',
        32: '¿Tienes interés en aprender sobre inteligencia artificial o robótica?',
        33: '¿Te atrae diseñar o crear productos visuales?',
        34: '¿Consideras importante el impacto social de tu trabajo futuro?',
        35: '¿Sueles estar motivado cuando las cosas se vuelven difíciles?'
    };

    const MULTIPLE_OPTIONS = {
        11: {
            a: 'Buscar información y analizarla paso a paso',
            b: 'Consultar a otras personas para decidir juntos',
            c: 'Actuar rápidamente por intuición',
            d: 'Evitarlo hasta tener más claridad'
        },
        12: {
            a: 'La parte técnica o de programación',
            b: 'El diseño y la presentación visual',
            c: 'La comunicación y organización del equipo',
            d: 'La planificación estratégica y decisiones finales'
        },
        13: {
            a: 'Programar o automatizar tareas',
            b: 'Diseñar interfaces o productos',
            c: 'Investigar comportamientos humanos',
            d: 'Redactar contenidos o presentaciones'
        },
        14: {
            a: 'Laboratorio o entorno tecnológico',
            b: 'Espacio creativo con dinámicas de grupo',
            c: 'Oficina con tareas estructuradas',
            d: 'Trabajo en campo o con personas'
        },
        15: {
            a: 'Análisis lógico',
            b: 'Empatía',
            c: 'Comunicación',
            d: 'Liderazgo'
        },
        16: {
            a: 'Una que resuelva un problema de salud o bienestar',
            b: 'Una que enseñe o difunda conocimiento',
            c: 'Una herramienta de productividad',
            d: 'Un juego o experiencia interactiva'
        },
        17: {
            a: 'Innovar con tecnología',
            b: 'Ayudar a las personas directamente',
            c: 'Comprender cómo piensan los demás',
            d: 'Lograr estabilidad económica'
        },
        18: {
            a: 'Los analizo y aprendo del fallo',
            b: 'Me frustro pero busco solucionarlo',
            c: 'Pido ayuda inmediatamente',
            d: 'Suelo evitarlos cambiando de tarea'
        },
        19: {
            a: 'Un sistema informático que automatice procesos',
            b: 'Un estudio sobre comportamiento humano',
            c: 'Una campaña de comunicación visual',
            d: 'Un dispositivo o prototipo biomédico'
        }
    };

    function generateSummary(answers, topCareer) {
        let highLikertCount = 0;
        for (let i = 1; i <= 10; i++) {
            if (parseInt(answers[`q${i}`]) >= 4) {
                highLikertCount++;
            }
        }

        const techInterest = (answers.q20 === 'yes' && answers.q22 === 'yes');
        const teamwork = answers.q27 === 'yes';
        const analytical = answers.q29 === 'yes';
        const creative = answers.q33 === 'yes';
        const helpingOthers = answers.q31 === 'yes';

        let summary = '';

        if (topCareer.includes('Ingeniería') || topCareer.includes('Computación')) {
            summary = 'Mostraste gran afinidad por la resolución de problemas, la curiosidad tecnológica y la innovación. ';
            if (analytical) summary += 'Tu capacidad analítica y metódica es una fortaleza importante. ';
            if (teamwork) summary += 'Además, tu disposición para trabajar en equipo te permitirá colaborar efectivamente en proyectos técnicos. ';
            if (techInterest) summary += 'Tu interés por la tecnología refuerza este perfil profesional. ';
        } else if (topCareer.includes('Diseño') || topCareer.includes('Comunicación')) {
            summary = 'Tus respuestas reflejan una fuerte inclinación creativa y habilidades de comunicación. ';
            if (creative) summary += 'Tu interés por el diseño y la creación visual son aspectos destacables. ';
            if (helpingOthers) summary += 'Tu empatía y deseo de impactar positivamente en otros complementa tu perfil profesional. ';
        } else if (topCareer.includes('Psicología') || topCareer.includes('Medicina')) {
            summary = 'Demostraste una clara orientación hacia el servicio y la comprensión del ser humano. ';
            if (helpingOthers) summary += 'Tu vocación por ayudar a otros es evidente en tus respuestas. ';
            if (analytical) summary += 'Tu capacidad de análisis te permitirá abordar casos complejos con metodología. ';
        } else {
            summary = 'Tus respuestas muestran un perfil equilibrado con intereses diversos. ';
            if (highLikertCount >= 7) {
                summary += 'Tu alta motivación y compromiso son cualidades valiosas para cualquier carrera. ';
            }
        }

        summary += 'Estos resultados te orientan, pero siempre es buena idea seguir explorando opciones.';
        return summary;
    }

    function renderChart(canvas, chartInstanceRef, entry, side) {
        const results = (entry && entry.results) ? entry.results.slice() : [];
        if (!results.length || !canvas) return null;

        const top4 = results.sort((a, b) => b.percentage - a.percentage).slice(0, 4);
        const labels = top4.map(r => r.name);
        const data = top4.map(r => r.percentage);

        if (chartInstanceRef.instance) {
            chartInstanceRef.instance.destroy();
        }

        const colors = ['#F29723', '#80BA23', '#1F80C1', '#0A3D66'];

        chartInstanceRef.instance = new Chart(canvas, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderColor: '#FFFFFF',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: { size: 11, family: "'Roboto', sans-serif" }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.label}: ${ctx.parsed}%`
                        }
                    }
                }
            }
        });

        return top4;
    }

    function renderCareerList(container, topResults) {
        if (!container) return;
        container.innerHTML = '';
        (topResults || []).forEach(r => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="name">${r.name}</span>
                <span class="percent">${r.percentage}%</span>
            `;
            container.appendChild(li);
        });
    }

    function renderAnswers(container, answers) {
        if (!container) return;
        container.innerHTML = '';
        if (!answers) return;

        for (let i = 1; i <= 10; i++) {
            const val = answers[`q${i}`];
            if (!val) continue;
            const block = document.createElement('div');
            block.className = 'answer-block';
            block.innerHTML = `
                <div class="answer-question">P${i}. ${QUESTIONS[i] || ''}</div>
                <div class="answer-value">Respuesta: <strong>${val}</strong> (escala 1 a 5)</div>
            `;
            container.appendChild(block);
        }

        for (let i = 11; i <= 19; i++) {
            const val = answers[`q${i}`];
            if (!val) continue;
            const textOpt = MULTIPLE_OPTIONS[i] && MULTIPLE_OPTIONS[i][val]
                ? MULTIPLE_OPTIONS[i][val]
                : `Opción ${val.toUpperCase()}`;
            const block = document.createElement('div');
            block.className = 'answer-block';
            block.innerHTML = `
                <div class="answer-question">P${i}. ${QUESTIONS[i] || ''}</div>
                <div class="answer-value">Elegiste: <strong>${textOpt}</strong></div>
            `;
            container.appendChild(block);
        }

        for (let i = 20; i <= 35; i++) {
            const val = answers[`q${i}`];
            if (!val) continue;
            const label = val === 'yes' ? 'Sí' : 'No';
            const block = document.createElement('div');
            block.className = 'answer-block';
            block.innerHTML = `
                <div class="answer-question">P${i}. ${QUESTIONS[i] || ''}</div>
                <div class="answer-value">Respuesta: <strong>${label}</strong></div>
            `;
            container.appendChild(block);
        }
    }

    function loadSide(entryId, side) {
        const entry = historyData.find(e => e.id === entryId);
        if (!entry) return;

        const chartRef = side === 'left' ? { instance: chartLeftInstance } : { instance: chartRightInstance };
        const canvas = side === 'left' ? DOM.chartLeft : DOM.chartRight;
        const careersContainer = side === 'left' ? DOM.careersLeft : DOM.careersRight;
        const summaryContainer = side === 'left' ? DOM.summaryLeft : DOM.summaryRight;
        const answersContainer = side === 'left' ? DOM.answersLeft : DOM.answersRight;

        const topResults = renderChart(canvas, chartRef, entry, side);
        if (side === 'left') chartLeftInstance = chartRef.instance;
        else chartRightInstance = chartRef.instance;

        renderCareerList(careersContainer, topResults);

        const mainCareer = entry.mainCareer || (entry.results && entry.results[0] && entry.results[0].name) || 'tu perfil';
        const summary = generateSummary(entry.answers || {}, mainCareer);
        summaryContainer.textContent = summary;

        renderAnswers(answersContainer, entry.answers || {});
    }

    function setupProfileMenu() {
        if (!DOM.profileButton || !DOM.dropdownMenu) return;

        DOM.profileButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = DOM.profileButton.getAttribute('aria-expanded') === 'true';
            DOM.profileButton.setAttribute('aria-expanded', String(!expanded));
            DOM.dropdownMenu.classList.toggle('show');
            const arrow = document.querySelector('.arrow-down');
            if (arrow) arrow.classList.toggle('rotate');
        });

        document.addEventListener('click', (e) => {
            if (!DOM.profileButton.contains(e.target) && !DOM.dropdownMenu.contains(e.target)) {
                DOM.dropdownMenu.classList.remove('show');
                DOM.profileButton.setAttribute('aria-expanded', 'false');
                const arrow = document.querySelector('.arrow-down');
                if (arrow) arrow.classList.remove('rotate');
            }
        });
    }

    function init() {
        historyData = JSON.parse(localStorage.getItem('vocatio_history') || '[]');

        if (!historyData.length) {
            alert('Aún no tienes evaluaciones para comparar.');
            window.location.href = 'test.html';
            return;
        }

        // Opciones de los selects (más reciente primero)
        const total = historyData.length;

        function fillSelect(selectEl) {
            selectEl.innerHTML = '';
            historyData.forEach((entry, idx) => {
                const option = document.createElement('option');
                const num = total - idx; // Test #N
                const label = `Test #${num} – ${entry.dateFormatted || ''} (${entry.mainCareer})`;
                option.value = entry.id;
                option.textContent = label;
                selectEl.appendChild(option);
            });
        }

        fillSelect(DOM.selectLeft);
        fillSelect(DOM.selectRight);

        // Por defecto: izquierda = más antiguo, derecha = más reciente si hay 2+
        DOM.selectLeft.value = historyData[historyData.length - 1].id;
        DOM.selectRight.value = historyData[0].id;

        loadSide(DOM.selectLeft.value, 'left');
        loadSide(DOM.selectRight.value, 'right');

        DOM.selectLeft.addEventListener('change', () => {
            loadSide(DOM.selectLeft.value, 'left');
        });

        DOM.selectRight.addEventListener('change', () => {
            loadSide(DOM.selectRight.value, 'right');
        });

        setupProfileMenu();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
