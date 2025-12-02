const CAREERS_DATA = {
  carreras: [
    {
      id: "computacion",
      nombre: "Ciencias de la Computación",
      descripcionCorta: "Crea software, IA, sistemas inteligentes y soluciones tecnológicas.",
      imagen: "../assets/img/computacion.jpg",
      duracion: "5 años",
      modalidad: "Presencial",

    
      rating: 4.8,
      ratingCount: 1540,
      tema: "informatica",
      popularidad: 96,                 
      fechaPublicacion: "2024-08-10",  

      descripcionLarga:
        "La carrera forma profesionales capaces de diseñar, desarrollar y optimizar software, sistemas inteligentes, aplicaciones de IA, redes y soluciones tecnológicas de alto impacto. Es una de las carreras con mayor demanda y crecimiento internacional.",

      aprendizajes: [
        "Programación avanzada y estructuras de datos",
        "Inteligencia artificial y Machine Learning",
        "Bases de datos, Big Data y Cloud Computing",
        "Ciberseguridad y arquitectura de software",
        "Desarrollo web, móvil y sistemas distribuidos"
      ],

      campos: [
        "Desarrollador de Software / Full Stack",
        "Ingeniero de Datos / Científico de Datos",
        "Especialista en IA",
        "Analista de Ciberseguridad",
        "Arquitecto de soluciones Cloud"
      ],

      habilidades: [
        "Pensamiento lógico",
        "Modelado de sistemas",
        "Resolución de problemas complejos",
        "Optimización y análisis"
      ],

      link: "https://pregrado.upc.edu.pe/facultad-de-ingenieria/ciencias-de-la-computacion/"
    },

    {
      id: "medicina",
      nombre: "Medicina",
      descripcionCorta: "Aprende a cuidar la vida con ciencia, vocación y compromiso.",
      imagen: "../assets/img/medicina.jpg",
      duracion: "7 años",
      modalidad: "Presencial",

      
      rating: 4.9,
      ratingCount: 1820,
      tema: "medicina",
      popularidad: 93,
      fechaPublicacion: "2024-07-01",

      descripcionLarga:
        "La carrera de Medicina forma profesionales éticos y competentes capaces de diagnosticar, tratar y prevenir enfermedades. Incluye formación científica, práctica clínica y habilidades para la investigación médica.",

      aprendizajes: [
        "Anatomía, fisiología y bioquímica",
        "Diagnóstico clínico y tratamiento",
        "Investigación médica aplicada",
        "Urgencias y emergencias",
        "Cirugía básica"
      ],

      campos: [
        "Médico general",
        "Médico especialista",
        "Cirujano",
        "Investigador médico",
        "Emergencias"
      ],

      habilidades: [
        "Toma de decisiones críticas",
        "Empatía y comunicación",
        "Análisis clínico",
        "Manejo del estrés"
      ],

      link: "https://pregrado.upc.edu.pe/facultad-de-ciencias-de-la-salud/medicina/"
    },

    {
      id: "traduccion",
      nombre: "Traducción e Interpretación Profesional",
      descripcionCorta: "Comunica culturas y lenguas en entornos globales.",
      imagen: "../assets/img/traduccion.jpg",
      duracion: "5 años",
      modalidad: "Presencial o semipresencial",

     
      rating: 4.4,
      ratingCount: 620,
      tema: "comunicaciones",      
      popularidad: 74,
      fechaPublicacion: "2024-06-15",

      descripcionLarga:
        "Desarrolla competencias lingüísticas, comunicativas y culturales para facilitar la comunicación internacional mediante la traducción escrita y la interpretación simultánea o consecutiva.",

      aprendizajes: [
        "Traducción especializada (legal, médica, técnica)",
        "Interpretación simultánea y consecutiva",
        "Lingüística aplicada",
        "Subtitulado y localización",
        "Corrección y edición"
      ],

      campos: [
        "Traductor profesional",
        "Intérprete simultáneo",
        "Editor lingüístico",
        "Localizador de software y multimedia",
        "Consultor intercultural"
      ],

      habilidades: [
        "Escucha activa",
        "Precisión lingüística",
        "Análisis contextual",
        "Adaptación cultural"
      ],

      link: "https://pregrado.upc.edu.pe/facultad-de-ciencias-humanas/traduccion-e-interpretacion-profesional/"
    },

    {
      id: "musica",
      nombre: "Música",
      descripcionCorta: "Desarrolla talento artístico, composición y producción musical.",
      imagen: "../assets/img/musica.jpg",
      duracion: "5 años",
      modalidad: "Presencial",

    
      rating: 4.5,
      ratingCount: 780,
      tema: "artes",
      popularidad: 80,
      fechaPublicacion: "2024-09-05",

      descripcionLarga:
        "La carrera forma músicos integrales capaces de componer, interpretar, arreglar y producir música profesionalmente para diversos escenarios artísticos y medios digitales.",

      aprendizajes: [
        "Composición musical avanzada",
        "Interpretación instrumental o vocal",
        "Producción musical y mezcla",
        "Armonía y teoría musical",
        "Gestión de proyectos musicales"
      ],

      campos: [
        "Músico profesional",
        "Productor musical",
        "Compositor",
        "Arreglista",
        "Sonidista"
      ],

      habilidades: [
        "Creatividad artística",
        "Sensibilidad musical",
        "Trabajo colaborativo",
        "Expresión escénica"
      ],

      link: "https://pregrado.upc.edu.pe/facultad-de-artes-contemporaneas/carrera-de-musica/"
    },

    {
      id: "derecho",
      nombre: "Derecho",
      descripcionCorta: "Defiende la justicia con conocimientos jurídicos y ética.",
      imagen: "../assets/img/derecho.jpg",
      duracion: "5 años",
      modalidad: "Presencial",

    
      rating: 4.2,
      ratingCount: 1100,
      tema: "leyes",
      popularidad: 88,
      fechaPublicacion: "2023-11-20",

      descripcionLarga:
        "La carrera desarrolla profesionales capaces de analizar, interpretar y aplicar las leyes en distintos contextos, promoviendo la justicia, los derechos humanos y la convivencia social.",

      aprendizajes: [
        "Derecho civil, penal y constitucional",
        "Litigación oral y argumentación",
        "Investigación jurídica",
        "Negociación y conciliación",
        "Derecho empresarial"
      ],

      campos: [
        "Abogado litigante",
        "Asesor jurídico",
        "Fiscal o juez",
        "Consultor legal",
        "Defensa pública"
      ],

      habilidades: [
        "Pensamiento crítico",
        "Redacción jurídica",
        "Argumentación lógica",
        "Análisis normativo"
      ],

      link: "https://pregrado.upc.edu.pe/facultad-de-derecho/derecho/"
    },

    {
      id: "mecatronica",
      nombre: "Ingeniería Mecatrónica",
      descripcionCorta: "Combina mecánica, electrónica e informática para automatización.",
      imagen: "../assets/img/mecatronica.jpg",
      duracion: "5 años",
      modalidad: "Presencial",

      
      rating: 4.7,
      ratingCount: 990,
      tema: "ingenieria",
      popularidad: 92,
      fechaPublicacion: "2024-10-01",

      descripcionLarga:
        "Integra electrónica, diseño mecánico, control e informática para desarrollar sistemas automatizados e inteligentes utilizados en robótica, manufactura y tecnología industrial.",

      aprendizajes: [
        "Robótica y automatización industrial",
        "Electrónica digital y analógica",
        "Mecánica aplicada",
        "Control de sistemas",
        "Programación embebida"
      ],

      campos: [
        "Ingeniero de automatización",
        "Diseñador de robots",
        "Especialista en control",
        "Integrador de sistemas",
        "Industria 4.0"
      ],

      habilidades: [
        "Innovación tecnológica",
        "Creatividad técnica",
        "Diseño de soluciones",
        "Trabajo multidisciplinario"
      ],

      link: "https://pregrado.upc.edu.pe/facultad-de-ingenieria/ingenieria-mecatronica/"
    }
  ]
};
