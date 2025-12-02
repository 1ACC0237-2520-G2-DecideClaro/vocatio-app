(function () {
    'use strict';

    const DOM = {
        avgChartCanvas: document.getElementById('avgCareerChart'),
        avgCareerList: document.getElementById('avgCareerList'),
        recommendedContainer: document.getElementById('recommendedCareers'),
        lastTestsList: document.getElementById('lastTestsList'),
        profileButton: document.getElementById('profileButton'),
        dropdownMenu: document.getElementById('dropdownMenu')
    };

    let avgChart = null;

    const CAREER_DESCRIPTIONS = {
        'Ingeniería de Software': 'Alta afinidad con el razonamiento lógico y la creación de soluciones tecnológicas.',
        'Ciencias de la Computación': 'Te interesa entender cómo funcionan los sistemas y desarrollar tecnología innovadora.',
        'Psicología': 'Te motiva comprender el comportamiento humano y acompañar procesos emocionales.',
        'Ingeniería Industrial': 'Buen equilibrio entre análisis, organización y mejora de procesos.',
        'Diseño de Experiencia de Usuario': 'Combinas sensibilidad visual con interés por las personas y los productos digitales.',
        'Medicina': 'Tienes vocación de servicio, interés por la salud y capacidad para afrontar retos exigentes.',
        'Administración de Empresas': 'Te atrae coordinar equipos, tomar decisiones y gestionar recursos.',
        'Comunicación Social': 'Disfrutas comunicar ideas, crear contenidos y conectar con audiencias.'
    };

    /** Agrupa el historial por carrera y calcula promedio */
    function calculateCareerAverages(history) {
        const totals = {};

        history.forEach(entry => {
            (entry.results || []).forEach(r => {
                if (!totals[r.name]) {
                    totals[r.name] = { sum: 0, count: 0 };
                }
                totals[r.name].sum += r.percentage;
                totals[r.name].count += 1;
            });
        });

        const averages = Object.keys(totals).map(name => ({
            name,
            avg: totals[name].sum / totals[name].count
        }));

        averages.sort((a, b) => b.avg - a.avg);
        return averages;
    }

    /** Render radar de promedios */
    function renderAvgChart(averages) {
        if (!DOM.avgChartCanvas) return;

        const top = averages.slice(0, 8);
        const labels = top.map(c => c.name);
        const data = top.map(c => Math.round(c.avg));

        if (avgChart) avgChart.destroy();

        avgChart = new Chart(DOM.avgChartCanvas, {
            type: 'radar',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: 'rgba(242,151,35,0.15)',
                    borderColor: '#F29723',
                    borderWidth: 2,
                    pointBackgroundColor: '#F29723',
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { stepSize: 20, showLabelBackdrop: false },
                        grid: { color: '#E5E7EB' },
                        angleLines: { color: '#E5E7EB' },
                        pointLabels: { font: { size: 11 } }
                    }
                }
            }
        });
    }

    /** Lista de promedios al lado del gráfico */
    function renderAvgList(averages) {
        if (!DOM.avgCareerList) return;
        DOM.avgCareerList.innerHTML = '';

        averages.slice(0, 10).forEach(c => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="name">${c.name}</span>
                <span class="percent">${Math.round(c.avg)}%</span>
            `;
            DOM.avgCareerList.appendChild(li);
        });
    }

    /** Carreras recomendadas usando top 3 promedios */
    function renderRecommended(averages) {
        if (!DOM.recommendedContainer) return;
        DOM.recommendedContainer.innerHTML = '';

        averages.slice(0, 3).forEach(c => {
            const div = document.createElement('div');
            div.className = 'recommended-item';

            const desc = CAREER_DESCRIPTIONS[c.name] ||
                'Tienes una afinidad consistente con esta área a lo largo de tus evaluaciones.';

            div.innerHTML = `
                <h3>${c.name}</h3>
                <p>${desc}
                    <a href="#" class="see-more"><strong>Ver más</strong></a>
                </p>
            `;
            DOM.recommendedContainer.appendChild(div);
        });
    }

    /** Lista de últimos tests */
    function renderLastTests(history) {
        if (!DOM.lastTestsList) return;
        DOM.lastTestsList.innerHTML = '';

        history.slice(0, 3).forEach((entry, idx) => {
            const li = document.createElement('li');

            const label = `Test #${history.length - idx} – ${entry.dateFormatted || ''}`;
            li.innerHTML = `
                <span class="test-title">${label}</span>
                <span class="test-meta">Afinidad más alta: <strong>${entry.mainCareer}</strong></span>
                <span class="test-score">Puntaje: <strong>${entry.mainScore}%</strong></span>
            `;
            DOM.lastTestsList.appendChild(li);
        });
    }

    /** Dropdown perfil */
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
        const history = JSON.parse(localStorage.getItem('vocatio_history') || '[]');

        if (!history.length) {
            alert('Aún no tienes evaluaciones para mostrar informes.');
            return;
        }

        const averages = calculateCareerAverages(history);

        renderAvgChart(averages);
        renderAvgList(averages);
        renderRecommended(averages);
        renderLastTests(history);
        setupProfileMenu();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
