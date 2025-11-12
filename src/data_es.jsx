const initialData = {
  header: {
    name: 'Daniel Tarazona',
    title: 'Desarrollador Móvil / Tirador / Artista Marcial',
    location: 'Medellín, Colombia',
    email: 'shiftcipher@hotmail.com',
    phone: '+57 315 837 5156',
    github: 'https://github.com/danieltarazona',
    summary: 'Desarrollador, Tirador y Artista Marcial con más de 8 años de experiencia en desarrollo en iOS y 6 años de experiencia en multiples artes marciales. Historial comprobado de entrega de aplicaciones móviles de alto impacto que aumentaron la retención de usuarios, redujeron el fraude y aceleraron el despliegue. Experto en integración de IA para soluciones escalables y centradas en el usuario.',
  },
  education: [
    {
      institution: 'LIGA ANTIOQUEÑA DE TIRO DEPORTIVO',
      location: 'Medellin, Colombia',
      degree: 'Riflero',
      date: '2025',
      coursework: 'Practicante de Tiro Deportivo con enfoque en precisión y control bajo presión. Competidor en eventos nacionales, demostrando disciplina y enfoque mental. Habilidades transferibles a desarrollo de software, incluyendo atención al detalle y gestión del estrés en entornos de alta presión.',
    },
    {
      institution: 'GLOBALOCK TRAINING - AGLOSS',
      location: 'Palmira, Colombia',
      degree: 'Curso de Escolta VIP',
      date: '2023',
      coursework: 'Curso de Escolta VIP que abarca tácticas de protección personal, evaluación de amenazas y protocolos de seguridad.',
    },
    {
      institution: 'UNIVERSIDAD DEL VALLE',
      location: 'Cali, Colombia',
      degree: 'Licenciatura en Ingeniería de Software (Cursada; En Progreso)',
      date: '2017 - 2021',
      coursework: 'Dominé estructuras de datos avanzadas e intérpretes en Scheme (Lisp) y C++, procesadores y arquitectura de computadoras, programación interactiva en Java, cálculo, álgebra lineal, física, aprendizaje automático, inteligencia artificial, y diseño y desarrollo de juegos en Unity. Tecnologías: Scheme (Lisp), Racket (Lisp), C/C++, Java, Python, Jupyter, y LaTeX. Completé cursos equivalentes a un título completo, desarrollando 5+ proyectos que demostraron competencia en algoritmos, IA, y desarrollo de juegos, preparándome para liderazgo en soluciones de software escalables.',
    },
    {
      institution: 'SERVICIO NACIONAL DE APRENDIZAJE (SENA)',
      location: 'Cali, Colombia',
      degree: 'Técnico en Análisis y Desarrollo de Sistemas de Información',
      date: '2015 - 2018',
      coursework: 'Cursos Relevantes: SQL, SDK de Node.js para Oracle, Oracle, MySQL, PostgreSQL, Android, C#, y PHP. Desarrollé 3 aplicaciones basadas en bases de datos, ganando experiencia en desarrollo backend e integración de aplicaciones móviles, directamente aplicable a roles de ingeniería full-stack.',
    },
    {
      institution: 'MASSACHUSETTS INSTITUTE OF TECHNOLOGY - UNIVERSIDAD ICESI',
      location: 'Cali, Colombia',
      degree: 'MIT - Global Startup Labs Emprendimiento en Tecnología Móvil',
      date: '2013',
      coursework: 'Inmerso en Django, Python, Java, Android, HTML, CSS3, SASS, Bootstrap, Emmet, fomentando el ingenio emprendedor en tecnología móvil. Exploré metodologías innovadoras de startups en gsl.mit.edu, combinando destreza técnica con innovación empresarial para lanzar emprendimientos digitales escalables. Contribuí a 2 proyectos de startups, aplicando habilidades de desarrollo móvil para prototipar aplicaciones centradas en el usuario.',
    },
    {
      institution: 'UNIVERSIDAD DEL VALLE',
      location: 'Cali, Colombia',
      degree: 'Licenciatura en Arquitectura (Cursos Parcialmente Completados)',
      date: '2009 - 2013',
      coursework: 'Exploré el color y la luz en arquitectura junto con múltiples técnicas de expresión. Utilicé tecnologías como Autodesk Revit, Autodesk AutoCAD, Autodesk 3D Max, Rhinoceros 3D, Grasshopper 3D, Blender, Cycles, Lumion, Adobe Illustrator, Adobe Photoshop. Diseñé 10+ modelos arquitectónicos, mejorando habilidades de visualización transferibles a UI/UX y desarrollo de juegos 3D.',
    },
    {
      institution: 'COLEGIO PARROQUIAL SANTIAGO APÓSTOL',
      location: 'Cali, Colombia',
      degree: 'Bachillerato Técnico en Diseño Industrial',
      date: '1999 - 2009',
      coursework: 'Adquirí habilidades fundamentales en diseño industrial, utilizando Corel Draw, Microsoft Office y Wix.com para cultivar experiencia temprana en comunicación visual y técnica. Creé 5+ proyectos de diseño, construyendo una base sólida para principios de UI/UX en desarrollo de software.',
    },
  ],
  skills: {
    programming: 'Swift, Objective-C, C, C++, C#, Solidity, JavaScript, Node.js, React Native, Python, Java, PHP, Laravel, GraphQL, HTML5, CSS3, SASS, Bootstrap, TypeScript, Redux, Firebase, SQLite.',
    design: 'Adobe XD, Figma, Sketch 3, Adobe Comp CC, Autodesk Revit, Autodesk AutoCAD, Rhinoceros 3D, Blender, Lumion, V-Ray, Grasshopper 3D.',
    tools: 'Xcode, Android Studio, Unity, VS Code, Git, Jenkins, Fastlane, CocoaPods, Carthage, SPM.',
    projects: [
      {
        "name": "Idiomas Hablados:",
        "date": "",
        "description": "Español (Nativo), Inglés (C1 Competencia Profesional Completa), Francés (B1 Competencia Profesional Laboral), Japonés (A2 Competencia Laboral Limitada), Alemán (A1 Competencia Elemental). Habilidades multilingües permiten comunicación efectiva en equipos diversos."
      },
      // {
      //   "name": "DataKit - Suite de Productividad Sigilosa - App iOS/macOS",
      //   "date": "Mayo 2021 - En Curso",
      //   "description": "Desarrollé suite de productividad impulsada por IA para iOS, iPadOS y macOS con módulos DataCapture y DataProfile, permitiendo gestión y automatización inteligente de datos. Contribuí a código abierto: agregué características iOS a Lumos Engine, soporte iOS/Xcode para SDL, código Python para Overpass, mejoras SDK para CouchBase Lite Swift Coder, soporte C e iOS para Raylib, y mejoras basadas en Windows para Racket. Mejoré el rendimiento en un 40% mediante algoritmos optimizados."
      // },
      {
        "name": "Lululemon Athletica - GuestApp - App iOS",
        "date": "Abril 2022 - En Curso",
        "description": "Desarrollé SDK con seguimiento Awin y Adobe Analytics para insights de conversión y ventas. Rediseñé notificaciones usando Genéricos (+25% reutilización) y reduje fraude en un 35%. Utilicé Contentful, Splunk y pruebas rigurosas para calidad. Propuse mejoras en código legacy durante Semana de Innovación, mejorando mantenibilidad."
      },
      {
        "name": "GSS Gyro Stabilized Systems - Orion - App macOS",
        "date": "Abril 2024 - Agosto 2024",
        "description": "Arquitecté app Linux para control de cámara giroestabilizada 4K en controladores portátiles usando C/C++/C# con FFmpeg, GStreamer, Blackmagic SDI y DirectLink. Integré navegación global, AR con capas interactivas y soporte multilingüe. Logré 60+ FPS y reduje tiempo de despliegue en un 40% multiplataforma."
      },
      {
        "name": "Líder de Comunidad Móvil Colombia - Voluntario - App iOS",
        "date": "Noviembre 2023 - Abril 2024",
        "description": "Construí Sistema de Diseño iOS con Figma y Endava BeeQ. Integré AWS Amplify/Cognito con automatización CLI. Certificado en IA, RAG y LLMs. Contribuí a SDL3 con soporte Metal y aumenté inicio de proyectos en un 30% vía SDKs colaborativos."
      },
      {
        "name": "GeoPortal para PopuLab - Sitio Web React",
        "date": "Agosto 2021 - Agosto 2022",
        "description": "Diseñé y construí GeoPortal para PopuLab (financiado por Lancaster University), permitiendo análisis en tiempo real de datos GeoJSON/JSONB. Integré Node.js, GraphQL, PostgreSQL 14, Prisma, Hasura y CSVKIT para visualización dinámica de geodatos. Apoyé investigación de Bienes Raíces sobre poblaciones vulnerables, contribuyendo a publicaciones académicas y alcance comunitario."
      },
      // {
      //   "name": "Itau Uruguay - App Empresarial iOS",
      //   "date": "Junio 2021 - Junio 2022",
      //   "description": "Lideré desarrollo de app empresarial segura de nómina usando arquitectura MVP con Face ID, Touch ID, iToken y OAuth 2.0. Mejoré autenticación y transferencias de fondos, reduciendo fraude en un 40% para más de 100K usuarios. Aseguré cumplimiento total con estándares bancarios, mejorando seguridad y eficiencia operativa."
      // },
      {
        name: 'Pineapel - App iOS',
        date: 'Marzo 2022 - Marzo 2022',
        description: 'Rescaté y modernicé proyecto legacy actualizando a Xcode 13, aprovechando Swift, Texture y SwiftUI. Optimizé métricas de rendimiento y eliminé obstáculos de compatibilidad, facilitando despliegue impecable y fortaleciendo estabilidad de aplicación en entornos de producción.',
      },
      {
        name: 'Trainerz Health - App iOS',
        date: 'Enero 2022 - Marzo 2022',
        description: 'Dirigí innovación UI/UX usando SwiftUI para aplicación de salud adaptada a madres gestantes. Integré Firebase para autenticación fluida, orquestación de datos y sincronización en tiempo real, aumentando retención de usuarios en un 35% vía interfaces intuitivas e infraestructura backend confiable.',
      },
      {
        name: 'Transcard - SDK iOS y App iOS',
        date: 'Junio 2021 - Diciembre 2021',
        description: 'Forjé SDK versátil basado en Swift Package Manager para ecosistemas financieros, complementado por aplicación demo integrando Mastercard, Apple Pay y OAuth 2.0. Agilicé flujos de pago, reduciendo duraciones de integración en un 50% y permitiendo transacciones seguras y eficientes para empresas fintech.',
      },
      {
        name: 'CreditSesame - App iOS',
        date: 'Septiembre 2020 - Mayo 2021',
        description: 'Pionereé desarrollo con arquitecturas VIPER/SwiftUI y metaprogramación Sourcery, optimizando procesos de construcción vía CocoaPods. Implementé pruebas A/B a través de Optimize.ly/Mixpanel, reduciendo tiempos de construcción en un 50% y fortaleciendo confiabilidad con frameworks completos XCTest/XCUITests.',
      },
      {
        name: 'Cropswap - App React Native',
        date: 'Junio 2020 - Septiembre 2020',
        description: 'Construí aplicación React Native para intercambios de cultivos orgánicos, incorporando capacidades avanzadas de mapeo. Mejoré experiencias de usuario con Redux, catalizando un aumento del 25% en adopción de plataforma en el mercado de Los Ángeles.',
      },
      {
        name: 'Boxia - App React Native',
        date: 'Enero 2020 - Junio 2020',
        description: 'Ingenié aplicación React Native con integración Mapbox para funcionalidad geoespacial superior. Prioricé rendimiento y usabilidad, ganando elogios y calificaciones altas en AppAdvice mediante diseño y optimización meticulosos.',
      },
      {
        name: 'Swiftli App iOS',
        date: 'Agosto 2019 - Diciembre 2019',
        description: 'Arquitecté plataforma social de coworking iOS/React Native con búsqueda Algolia, navegación Mapbox y pagos Stripe. Amplifiqué engagement de usuario vía patrones MVVM e interacciones en tiempo real, fomentando conexiones comunitarias vibrantes.',
      },
      {
        name: 'Blockchain - Minería y Aprendizaje',
        date: 'Marzo 2017 - Mayo 2018',
        description: 'Dirigí operaciones expansivas de minería Ethereum desde 2017, autorizando contratos inteligentes e integrando APIs como CoinGate. Logré reducciones de costo del 30% mediante avances innovadores en Solidity y Node.js, solidificando experiencia en escalabilidad blockchain.',
      },
      {
        name: 'Posesionclo.com - Sitio Web WordPress',
        date: 'Abril 2017 - Marzo 2018',
        description: 'Desarrollé sitio web dinámico de e-commerce de moda para Manufacturas Economicas usando temas WordPress, plugins, webhooks y filtros. Elevé ventas en línea en un 20% mediante funcionalidad mejorada y diseño centrado en el usuario.',
      },
      {
        name: 'Hyperspace VR - Juego Unity',
        date: 'Agosto 2017 - Diciembre 2017',
        description: 'Creé de manera individual juego cautivador de nave espacial VR en Unity 5 con C#, enfatizando diseño modular y rendimiento sostenido a 60+ FPS. Soporté dispositivos iOS 7+, mostrando maestría en interfaces de usuario VR y mecánicas de juego inmersivas.',
      },
      {
        name: 'Vitral Studio - Sitio Web WordPress',
        date: 'Agosto 2017 - Octubre 2017',
        description: 'Supervisé desarrollo WordPress utilizando herramientas CLI para crear sitio web dinámico para el estudio, mejorando presencia digital y experiencias de usuario interactivas.',
      },
      {
        name: 'TCC Shipping - Plugin WordPress',
        date: 'Junio 2017 - Julio 2017',
        description: 'Ingenié plugin a medida para seguimiento y etiquetado de envíos en TCC Colombia, aprovechando API WordPress, SOAP y PHP 7. Agilicé operaciones logísticas, reduciendo tiempos de procesamiento en un 25% y aumentando eficiencia.',
      },
      {
        name: 'Invisible to the Eye - Sitio Web WordPress',
        date: 'Enero 2017 - Abril 2017',
        description: 'Creé diseños innovadores UI/UX/UIX en Medellín usando Adobe Comp CC, XD y Sketch 3, entregando interfaces intuitivas y atractivas que priorizan satisfacción del usuario.',
      },
      {
        name: 'MiCosechApp - App iOS',
        date: 'Diciembre 2016 - Marzo 2017',
        description: 'Desarrollé aplicación robusta iOS 9-10 con Alamofire, Siesta, Sourcery, SwiftGen y Fastlane. Incorporé Nuke, Cache y Hue para rendimiento optimizado, asegurando despliegue fluido y experiencias de usuario superiores.',
      },
      {
        name: 'InventAR.io - App Laravel',
        date: 'Julio 2016 - Marzo 2017',
        description: 'Innové plataforma de análisis de envíos y compras impulsada por AR con características de gestión de inventario. Utilicé Laravel, Node.js, Three.js y Bootstrap para mejorar eficiencias minoristas en un 35%, transformando flujos operativos.',
      },
      {
        name: 'BabyMoon - Diseño UX',
        date: 'Enero 2017',
        description: 'Concepto digital usando Adobe Comp CC en iPad, demostrando creatividad excepcional y competencia en herramientas de diseño modernas.',
      },
      {
        name: 'PizzaApp - App iOS',
        date: 'Julio 2016',
        description: 'Construí aplicación iOS impulsada por Swift, enfatizando características amigables para pedido de comida sin esfuerzo y satisfacción mejorada del cliente.',
      },
    ],
  },
  experience: [
    {
      company: 'ENDAVA',
      role: 'Ingeniero Senior iOS',
      date: 'Marzo 2022 - Presente',
      description: 'Ingenié soluciones avanzadas iOS para clientes globales, integrando SwiftUI, Combine y Core Data para apps escalables. Lideré desarrollo de SDK de autenticación y análisis, reduciendo tiempo de integración en un 40% y aumentando rendimiento de app en un 25%. Colaboré con equipos multifuncionales para entregar aplicaciones móviles de alta calidad, impulsando adopción de características impulsadas por IA y arquitecturas modernas.',
      location: 'Remoto / Medellín, Antioquia, Colombia',
    },
    {
      company: '',
      role: 'Líder de Comunidad Móvil Colombia',
      date: 'Febrero 2023 - Presente',
      description: 'Fundé y lideré la Comunidad Móvil Colombia, fomentando colaboración e intercambio de conocimientos entre 50+ ingenieros móviles. Organicé 10+ sesiones técnicas, promoví alianzas LATAM y aceleré entrega de proyectos en un 30% mediante SDKs compartidos y mejores prácticas. Impulsé crecimiento exponencial de comunidad e innovación dentro de la red LATAM de Endava.',
      location: 'Remoto / Medellín, Antioquia, Colombia',
    },
    {
      company: 'KOOMBEA',
      role: 'Ingeniero Senior iOS para Trainerz',
      date: 'Enero 2022 - Marzo 2022',
      description: 'Lideré avances UI/UX en SwiftUI para aplicación especializada en salud sirviendo a madres gestantes. Integré Firebase para autenticación, manejo de datos y actualizaciones en tiempo real, elevando retención de usuarios mediante diseños ergonómicos y capacidades backend sólidas. Asegurando cumplimiento con estándares de datos de salud.',
      location: 'Remoto / Barranquilla, Atlántico, Colombia',
    },
    {
      company: '',
      role: 'Ingeniero Senior iOS para Transcard',
      date: 'Junio 2021 - Diciembre 2021',
      description: 'Arquitecté aplicación con patrón VIPER usando Swift Package Manager para integraciones Apple Pay y Mastercard. Optimizé gestión de tarjetas prepagas y virtuales, reduciendo esfuerzos de integración y mejorando fluidez operativa fintech. Mejorando seguridad de transacciones y experiencia de usuario.',
      location: 'Remoto / Barranquilla, Atlántico, Colombia',
    },
    // {
    //   company: 'APPLICA',
    //   role: 'Ingeniero Senior iOS para Itau Uruguay',
    //   date: 'Junio 2021 - Junio 2022',
    //   description: 'Arquitecté aplicación empresarial segura de nómina usando Swift, UIKit, Fingerprint, FaceID, iToken y OAuth 2.0. Mejoré protocolos de seguridad e interfaces de usuario para clientela corporativa, disminuyendo ocurrencias de fraude en un 40% en entorno bancario de alto riesgo manejando 100,000 usuarios concurrentes. Aseguré cumplimiento total con estándares bancarios, mejorando eficiencia operativa.',
    //   location: 'Remoto / Montevideo, Uruguay',
    // },
    {
      company: 'PINEAPEL™',
      role: 'Ingeniero Senior iOS',
      date: 'Marzo 2022 - Marzo 2022',
      description: 'Revitalicé proyecto legacy migrando a Xcode 13 con integraciones Swift, Texture y SwiftUI. Eliminé obstáculos de compatibilidad, garantizando despliegue robusto en producción y estándares de rendimiento elevados. Completé migración en 1 mes, asegurando experiencia de usuario fluida para 50K+ usuarios activos.',
      location: 'Remoto / Miami, Florida, Estados Unidos',
    },
    {
      company: 'ENCORA (FORMERLY AVANTICA)',
      role: 'Ingeniero Senior iOS para CreditSesame',
      date: 'Septiembre 2020 - Mayo 2021',
      description: 'Aproveché frameworks VIPER/SwiftUI y Sourcery para metaprogramación avanzada. Agilicé pipelines de construcción y pruebas con CocoaPods y Fastlane, reduciendo tiempos de procesamiento en un 50% y reforzando integridad de aplicación vía XCTest/XCUITests. Implementé pruebas A/B, mejorando adopción de características en un 20%.',
      location: 'Remoto / Cali, Valle del Cauca, Colombia',
    },
    {
      company: 'CAFETO SOFTWARE',
      role: 'Ingeniero Senior JavaScript para Cropswap',
      date: 'Junio 2020 - Septiembre 2020',
      description: 'Desarrollé plataforma React Native para intercambios orgánicos, incorporando Mapbox para herramientas de mapeo sofisticadas. Aumenté penetración de mercado en un 25% en Los Ángeles mediante experiencias de usuario refinadas y gestión de estado Redux. Lancé app con 5K+ descargas en 3 meses.',
      location: 'Presencial / Cali, Colombia',
    },
    {
      company: '',
      role: 'Ingeniero Senior JavaScript para Boxia',
      date: 'Enero 2020 - Junio 2020',
      description: 'Creé aplicación React Native con Mapbox para características geoespaciales mejoradas. Enfatizé optimización y diseño centrado en usuario, asegurando calificaciones de 4.8 estrellas y reconocimiento en AppAdvice. Logré 10K+ instalaciones mediante UI/UX intuitiva.',
      location: 'Presencial / Cali, Colombia',
    },
    {
      company: '',
      role: 'Ingeniero iOS e Ingeniero React Native para Swiftli',
      date: 'Agosto 2019 - Diciembre 2019',
      description: 'Diseñé red social híbrida de coworking iOS/React Native integrando búsqueda Algolia, navegación Mapbox y pagos Stripe. Aumenté engagement con arquitectura MVVM y capacidades dinámicas en tiempo real, cultivando comunidades de usuarios activos de 2K+ miembros.',
      location: 'Presencial / Cali, Colombia',
    },
    {
      company: 'CODEAPPS',
      role: 'Director Ejecutivo',
      date: 'Marzo 2017 - Octubre 2018',
      description: 'Dirigí operaciones de compañía, alcanzando objetivos fiscales vía implementaciones estratégicas en blockchain, desarrollo web y tecnologías VR. Alineé equipos multidisciplinarios para crecimiento sostenido, navegando desafíos con liderazgo visionario. Logré crecimiento de ingresos del 50% mediante soluciones tecnológicas innovadoras.',
      location: 'Presencial / Cali, Colombia',
    },
    {
      company: '',
      role: 'Arquitecto Blockchain',
      date: 'Marzo 2017 - Mayo 2018',
      description: 'Supervisé iniciativas extensas de minería Ethereum desde 2010 en adelante, desarrollando contratos inteligentes e integraciones API como CoinGate. Realicé eficiencias de costo del 30% mediante soluciones pioneras en Solidity y Node.js, avanzando infraestructura blockchain para aplicaciones descentralizadas escalables.',
      location: 'Presencial / Cali, Colombia',
    },
    {
      company: 'TELEVOIP',
      role: 'Desarrollador Back End',
      date: 'Febrero 2014 - Marzo 2015',
      description: 'Ingenié soluciones backend para TeleVoip, integrando servicios MailChimp/Mandrill. Mantuve repositorios GitHub multilingües, optimizando comunicación y estrategias operativas para alcance global. Mejoré tasas de entrega de email en un 40% mediante integraciones API.',
      location: 'Islas Canarias, España',
    },
    {
      company: '',
      role: 'Desarrollador Javascript',
      date: 'Marzo 2011 - Marzo 2015',
      description: 'Construí aplicaciones web de alta eficiencia usando Node.js, npm, Gulp y Express.js. Entregué soluciones escalables de calidad premium a diversos clientes internacionales, enfatizando innovación y rendimiento. Reduje tiempos de carga en un 30% mediante código optimizado y procesos de construcción.',
      location: 'Islas Canarias, España',
    },
    {
      company: 'WEB ARCHITECTURE ROBOTICS (WAR)',
      role: 'Diseñador Freelance',
      date: 'Febrero 2010 - Febrero 2014',
      description: 'Especializado en programación web, visualización arquitectónica y robótica. Empleé Rhinoceros, V-Ray y scripting Python para producir modelos 3D innovadores, superando restricciones económicas con enfoques de diseño ingeniosos. Entregué 15+ proyectos, mejorando presentaciones de clientes con visualizaciones de alta fidelidad.',
      location: 'Cali, Colombia',
    },
  ],
  leadership: [
    {
      organization: 'MeetUp Vapor, Swift y SwiftConf',
      role: 'Fundador y Líder',
      date: '2015 - Presente',
      description: 'Fundé y lideré una comunidad próspera dedicada a colaboración en desarrollo móvil e intercambio de conocimientos. Entregué sesiones expertas en SwiftUI, forjé alianzas LATAM. Aceleré entregas de proyectos mediante ecosistemas SDK compartidos, prosperando en medio de un renacimiento tecnológico regional. Organicé 10+ eventos, fomentando innovación entre 200+ desarrolladores.',
      location: 'Cali, Colombia',
    },
    {
      organization: 'MINISTERIO DE EDUCACIÓN NACIONAL (MEN)',
      role: 'Mejores Puntajes Nacionales Saber Pro 2017 – Tecnólogo en IT',
      date: 'Diciembre 2018',
      description: 'Honrado por lograr los mejores puntajes nacionales en la evaluación Saber Pro de IT, demostrando resiliencia excepcional y competencia en ingeniería de software a pesar de adversidades personales. Clasificado en el top 1% nacional, validando experiencia en tecnologías IT.',
      location: 'Bogotá, Colombia',
    },
    {
      organization: 'INNPULSA - ECOPETROL - ARGOS',
      role: 'Programa de Innovación Abierta en Hidrocarburos y Minería',
      date: 'Junio 03, 2014',
      description: 'Premiado por excelencia en INNPULSA Innovación Abierta, reconociendo contribuciones innovadoras a iniciativas de innovación abierta. Desarrollé soluciones prototipo para desafíos del sector energético, demostrando habilidades emprendedoras.',
      location: 'Medellín, Colombia',
    },
  ],
  certificates: [
    {
      name: 'República de Colombia Pistolas y Rifles 2025',
      issuer: 'Fedetiro',
      date: 'Octubre 29 - Noviembre 02, 2025',
      description: 'Equipo Mixto Rifle 10m: 548, Individual Rifle 10m: 486, Rifle 3x20: 416, Tendido 50m: 512',
    },
    {
      name: 'Requisitos BSA',
      issuer: 'Bankers Academy',
      date: 'Diciembre 04, 2020',
      description: 'Ganó Certificado de Logro por dominar criterios de evaluación en Requisitos BSA (Ley de Secreto Bancario), asegurando cumplimiento en operaciones financieras.',
    },
    {
      name: 'Requisitos AML',
      issuer: 'Bankers Academy',
      date: 'Diciembre 04, 2020',
      description: 'Obtuvo Certificado de Logro por sobresalir en Requisitos AML (Anti-Lavado de Dinero), fortaleciendo experiencia en adhesión regulatoria.',
    },
    {
      name: 'Membresía Profesional',
      issuer: 'Association for Computing Machinery (ACM)',
      date: 'Mayo 20',
      description: 'Admitido como Miembro Profesional de la Association for Computing Machinery, promoviendo la computación como ciencia y profesión mediante contribuciones continuas.',
    },
    {
      name: 'EF SET Inglés C1 Avanzado',
      issuer: 'EF Standard English Test',
      date: 'Junio 10, 2020',
      description: 'Logró certificación de Nivel C1 Avanzado en Inglés.',
    },
    {
      name: 'AWS Cloud Practitioner',
      issuer: 'AWS Training & Certification',
      date: 'Diciembre 07, 2023',
      description: 'Completó certificación AWS Cloud Practitioner, demostrando experiencia fundamental en computación en la nube esencial para diseño de infraestructura escalable.',
    },
    {
      name: 'Desarrollo de Bases de Datos con SQL',
      issuer: 'SENA',
      date: 'Abril 17, 2017',
      description: 'Certificado en Desarrollo de Bases de Datos con SQL (40 horas), equipando con habilidades avanzadas de desarrollo de bases de datos para gestión robusta de datos.',
    },
    {
      name: 'Diseño de Imagen Corporativa',
      issuer: 'SENA',
      date: 'Octubre 12, 2016',
      description: 'Certificado en Diseño de Imagen Corporativa, perfeccionando habilidades en diseño de imagen corporativa para estrategias de branding impactantes.',
    },
    {
      name: 'Carrera de Apple Fullstack',
      issuer: 'Platzi',
      date: 'Marzo 09, 2023',
      description: 'Ganó diploma en Carrera de Apple Fullstack, dominando desarrollo full-stack dentro del ecosistema Apple para creación innovadora de apps.',
    },
    {
      name: 'Desarrollo de Competencias en Gerencia y Gestión Empresarial',
      issuer: 'SENA',
      date: 'Noviembre 08, 2017',
      description: 'Certificado en Desarrollo de Competencias en Gerencia y Gestión Empresarial (128 horas), desarrollando competencias de liderazgo y gestión para éxito empresarial.',
    },
    {
      name: 'Curso de Programación de Apps Móviles',
      issuer: 'Universidad Complutense de Madrid',
      date: 'Noviembre, 2015',
      description: 'Completó Curso de Programación de Apps Móviles (40 horas), ganando habilidades especializadas en programación de aplicaciones móviles.',
    },
    {
      name: 'Estructura del Lenguaje de Programación C++',
      issuer: 'SENA',
      date: 'Marzo 31, 2011',
      description: 'Certificado en Estructura del Lenguaje de Programación C++, construyendo bases sólidas en programación orientada a objetos.',
    },
    {
      name: 'HTML y Javascript',
      issuer: 'SENA',
      date: 'Marzo 24, 2011',
      description: 'Certificado en HTML y Javascript, estableciendo habilidades básicas de desarrollo web para experiencias en línea dinámicas.',
    },
    
    {
      name: 'Generative AI for Developers',
      issuer: 'O\'Reilly',
      date: 'Mayo 2024',
      description: 'Completó certificación en Generative AI for Developers, desbloqueando técnicas avanzadas en creación de contenido impulsado por IA y desarrollo de aplicaciones.',
    },
    {
      name: 'RAG',
      issuer: 'O\'Reilly',
      date: 'Mayo 2024',
      description: 'Certificado en RAG (Retrieval-Augmented Generation), mejorando capacidades en integración de modelos IA y sistemas de recuperación de conocimiento.',
    },
    {
      name: 'LLMs Operation',
      issuer: 'O\'Reilly',
      date: 'Abril 2024',
      description: 'Logró certificación en LLMs Operation, dominando aspectos operativos de Large Language Models para despliegue y gestión eficientes.',
    },
  ],
};

export default initialData;