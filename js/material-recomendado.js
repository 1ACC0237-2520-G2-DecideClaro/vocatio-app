const MATERIALS_DATA = {
  materiales: [
    {
      id: "robotica",
      area: "robotica",
      tipo: "documento",
      titulo: "Guía de Robótica Educativa",
      descripcion: "Manual descargable sobre automatización, sensores y robótica básica.",
      imagen: "../assets/img/material-robotica.png",
      accion: "Descargar PDF",
      modalId: "modal-robotica",
      detalleTipo: "Documento PDF",
      duracion: "",
      extra: "Tamaño: 4 MB",
      descripcionModal:
        "Esta guía introduce los conceptos básicos de robótica educativa: tipos de sensores, actuadores, lógica de programación y ejemplos de proyectos para el aula.",
      url: "../assets/pdf/guia-robotica.pdf" 
    },
    {
      id: "etica",
      area: "etica",
      tipo: "documento",
      titulo: "Manual de Ética Profesional",
      descripcion: "Principios y valores éticos aplicados en entornos laborales modernos.",
      imagen: "../assets/img/material-etica.jpg",
      accion: "Descargar PDF",
      modalId: "modal-etica",
      detalleTipo: "Documento PDF",
      duracion: "",
      extra: "Enfoque: Ética y Humanidades",
      descripcionModal:
        "Revisa los principios de ética profesional, responsabilidad, integridad y toma de decisiones éticas en distintos contextos laborales.",
      url: "../assets/pdf/manual-etica.pdf"
    },
    {
      id: "proyectos",
      area: "computacion",
      tipo: "documento",
      titulo: "Gestión de Proyectos Tecnológicos",
      descripcion: "Guía para estructurar proyectos de innovación en tecnología e ingeniería.",
      imagen: "../assets/img/material-proyectos.webp",
      accion: "Descargar PDF",
      modalId: "modal-proyectos",
      detalleTipo: "Documento PDF",
      duracion: "",
      extra: "Incluye plantillas de planificación",
      descripcionModal:
        "Aprende a planificar, ejecutar y controlar proyectos tecnológicos usando buenas prácticas de gestión, cronogramas y control de riesgos.",
      url: "../assets/pdf/gestion-proyectos-tec.pdf"
    },

    {
      id: "ia",
      area: "computacion",
      tipo: "video",
      titulo: "Introducción a la Inteligencia Artificial",
      descripcion: "Video educativo sobre los fundamentos de la IA y su impacto profesional.",
      imagen: "../assets/img/material-ia.webp",
      accion: "Ver Video",
      modalId: "modal-ia",
      detalleTipo: "Video",
      duracion: "15 min",
      extra: "Nivel: introductorio",
      descripcionModal:
        "Conoce qué es la IA, sus principales aplicaciones en la vida diaria y cuáles son los desafíos éticos y profesionales que plantea.",
      url: "https://www.youtube.com/watch?v=JMUxmLyrhSk"
    },
    {
      id: "marketing",
      area: "marketing",
      tipo: "video",
      titulo: "Marketing Digital para Principiantes",
      descripcion: "Conceptos básicos del marketing moderno y cómo aplicarlos en redes sociales.",
      imagen: "../assets/img/material-marketing.webp",
      accion: "Ver Video",
      modalId: "modal-marketing",
      detalleTipo: "Video",
      duracion: "20 min",
      extra: "Incluye ejemplos en redes sociales",
      descripcionModal:
        "Aprende qué es el marketing digital, qué tipos de campañas existen y cómo se mide el impacto de una estrategia online.",
      url: "https://www.youtube.com/results?search_query=marketing+digital+para+principiantes"
    },
    {
      id: "innovacion",
      area: "robotica",
      tipo: "video",
      titulo: "Innovación y Creatividad Aplicada",
      descripcion: "Video que enseña cómo fomentar la creatividad en proyectos tecnológicos.",
      imagen: "../assets/img/material-innovacion.jpg",
      accion: "Ver Video",
      modalId: "modal-innovacion",
      detalleTipo: "Video",
      duracion: "18 min",
      extra: "Ejemplos de proyectos reales",
      descripcionModal:
        "Descubre técnicas para generar ideas innovadoras y aplicarlas en soluciones tecnológicas y proyectos de robótica.",
      url: "https://www.youtube.com/results?search_query=innovacion+y+creatividad"
    },

    {
      id: "programacion",
      area: "computacion",
      tipo: "curso",
      titulo: "Curso: Programación desde Cero",
      descripcion: "Aprende los fundamentos de la programación con ejemplos en Python.",
      imagen: "../assets/img/material-programacion.jpg",
      accion: "Ir al Curso",
      modalId: "modal-programacion",
      detalleTipo: "Curso online",
      duracion: "6 semanas",
      extra: "Incluye proyectos prácticos",
      descripcionModal:
        "Empieza desde cero en programación: variables, estructuras de control, funciones y creación de pequeños programas en Python.",
      url: "https://www.coursera.org/specializations/python"
    },
    {
      id: "ingles",
      area: "idiomas",
      tipo: "curso",
      titulo: "Curso: Inglés Técnico",
      descripcion: "Fortalece tu comprensión del inglés aplicado al mundo profesional y tecnológico.",
      imagen: "../assets/img/material-ingles.jpg",
      accion: "Ir al Curso",
      modalId: "modal-ingles",
      detalleTipo: "Curso online",
      duracion: "4 semanas",
      extra: "Enfoque en vocabulario profesional",
      descripcionModal:
        "Mejora tu vocabulario y comprensión lectora en inglés técnico usado en manuales, documentación y entornos laborales.",
      url: "https://www.coursera.org/search?query=technical%20english"
    },
    {
      id: "gestion",
      area: "marketing",
      tipo: "curso",
      titulo: "Curso: Gestión de Empresas",
      descripcion: "Aprende sobre liderazgo, productividad y estrategias empresariales modernas.",
      imagen: "../assets/img/material-gestion.jpg",
      accion: "Ir al Curso",
      modalId: "modal-gestion",
      detalleTipo: "Curso online",
      duracion: "5 semanas",
      extra: "Incluye casos de negocio",
      descripcionModal:
        "Revisa conceptos clave de administración, liderazgo, toma de decisiones y herramientas para gestionar equipos y proyectos.",
      url: "https://www.coursera.org/search?query=business%20management"
    }
  ]
};
