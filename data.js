// ============================================================
// DATOS DEL JUEGO - Minijuegos, escenarios, cartas, dilemas
// La Factura de la Luz del Profe Álvaro - REDISEÑO v2
// ============================================================

const GAME_DATA = {
    config: {
        basePoints: 100,
        comboMultiplier: 50,
        totalLevels: 5,
        billAmount: 47000
    },

    // ==================== DEFINICIÓN DE NIVELES ====================
    niveles: [
        {
            id: 1,
            nombre: "EL APAGÓN",
            tema: "Clasifica la Energía",
            descripcion: "Se ha ido la luz en el Colegio Perú! Identifica cada tipo de energía para ayudar al profe.",
            color: "#3b82f6",
            bgColor: 0x0f172a,
            mecanica: "clasificación"
        },
        {
            id: 2,
            nombre: "LA CENTRAL",
            tema: "Renovable o No Renovable",
            descripcion: "Para cambiar el contrato del cole, hay que saber qué fuentes son renovables y cuáles no.",
            color: "#22c55e",
            bgColor: 0x14532d,
            mecanica: "sorting"
        },
        {
            id: 3,
            nombre: "LA CADENA",
            tema: "Transformaciones de energía",
            descripcion: "La energía se transforma. Ordena los pasos de cada cadena de transformación.",
            color: "#f59e0b",
            bgColor: 0x78350f,
            mecanica: "cadena"
        },
        {
            id: 4,
            nombre: "EL DESASTRE",
            tema: "Salva la Ciudad",
            descripcion: "La ciudad tiene problemas energéticos. Tus decisiones determinarán su futuro.",
            color: "#ef4444",
            bgColor: 0x7f1d1d,
            mecanica: "decisiones"
        },
        {
            id: 5,
            nombre: "LA FACTURA FINAL",
            tema: "Paga la Factura",
            descripcion: "Ronda final a contrarreloj! Cada acierto reduce la factura de 47.000€ del Colegio Perú.",
            color: "#a855f7",
            bgColor: 0x3b0764,
            mecanica: "speedround"
        }
    ],

    // ==================== NIVEL 1: ESCENARIOS DE CLASIFICACIÓN ====================
    // El alumno ve un escenario y pulsa el tipo de energía correcto entre 4 opciones
    // 15 escenarios, tiempo decreciente (8s -> 4s)
    nivel1Escenarios: [
        {
            texto: "Una pelota rodando cuesta abajo",
            icono: "ball",
            respuesta: "Cinética",
            opciones: ["Cinética", "Potencial", "Térmica", "Química"],
            explicacion: "Si se mueve, es cinética. Cuanto más rápido, más energía cinética tiene."
        },
        {
            texto: "Una bombilla LED encendida",
            icono: "lightbulb",
            respuesta: "Luminosa",
            opciones: ["Luminosa", "Química", "Sonora", "Nuclear"],
            explicacion: "Una bombilla emite LUZ, que es energía luminosa. También algo de térmica, pero la principal es luminosa."
        },
        {
            texto: "Un muelle comprimido",
            icono: "spring",
            respuesta: "Elástica",
            opciones: ["Elástica", "Cinética", "Térmica", "Eléctrica"],
            explicacion: "Un muelle comprimido almacena energía ELÁSTICA. Al soltarlo, se convierte en movimiento."
        },
        {
            texto: "Una olla de agua hirviendo",
            icono: "pot",
            respuesta: "Térmica",
            opciones: ["Térmica", "Química", "Cinética", "Luminosa"],
            explicacion: "El agua caliente tiene energía TÉRMICA. Cuanto más caliente, más energía térmica."
        },
        {
            texto: "Un bocadillo antes de comerlo",
            icono: "food",
            respuesta: "Química",
            opciones: ["Química", "Térmica", "Cinética", "Potencial"],
            explicacion: "Los alimentos almacenan energía QUÍMICA en sus moléculas. Tu cuerpo la libera al digerirlos."
        },
        {
            texto: "Un libro en lo alto de una estantería",
            icono: "book",
            respuesta: "Potencial",
            opciones: ["Potencial", "Cinética", "Elástica", "Química"],
            explicacion: "Un objeto elevado tiene energía POTENCIAL gravitatoria. Si cae, se convierte en cinética."
        },
        {
            texto: "Un rayo cayendo del cielo",
            icono: "lightning",
            respuesta: "Eléctrica",
            opciones: ["Eléctrica", "Luminosa", "Sonora", "Térmica"],
            explicacion: "Un rayo es una descarga de energía ELÉCTRICA brutal. También produce luz y sonido, pero su naturaleza es eléctrica."
        },
        {
            texto: "Un tambor cuando lo golpeas",
            icono: "drum",
            respuesta: "Sonora",
            opciones: ["Sonora", "Cinética", "Elástica", "Térmica"],
            explicacion: "Al golpear un tambor, vibra y produce ondas: energía SONORA. El sonido es energía que viaja por el aire."
        },
        {
            texto: "Una pila nueva sin usar",
            icono: "battery",
            respuesta: "Química",
            opciones: ["Química", "Eléctrica", "Térmica", "Nuclear"],
            explicacion: "Una pila almacena energía QUÍMICA. Cuando la conectas, la química se transforma en eléctrica."
        },
        {
            texto: "Un coche a 120 km/h en la autopista",
            icono: "car",
            respuesta: "Cinética",
            opciones: ["Cinética", "Química", "Potencial", "Térmica"],
            explicacion: "Un coche en movimiento tiene energía CINÉTICA. A más velocidad, más energía cinética. Por eso un choque a alta velocidad es más peligroso."
        },
        {
            texto: "El Sol brillando sobre la Tierra",
            icono: "sun",
            respuesta: "Luminosa",
            opciones: ["Luminosa", "Nuclear", "Térmica", "Eléctrica"],
            explicacion: "El Sol emite energía LUMINOSA (y térmica). Es la fuente de casi toda la energía en la Tierra."
        },
        {
            texto: "Una goma elástica estirada al máximo",
            icono: "rubber",
            respuesta: "Elástica",
            opciones: ["Elástica", "Potencial", "Cinética", "Química"],
            explicacion: "Una goma estirada almacena energía ELÁSTICA. Al soltarla, esa energía se libera como movimiento."
        },
        {
            texto: "Una hoguera en el campo",
            icono: "fire",
            respuesta: "Térmica",
            opciones: ["Térmica", "Luminosa", "Química", "Cinética"],
            explicacion: "Una hoguera libera energía TÉRMICA (calor). También luminosa, pero el efecto principal es el calor."
        },
        {
            texto: "Una central nuclear en funcionamiento",
            icono: "nuclear",
            respuesta: "Nuclear",
            opciones: ["Nuclear", "Térmica", "Eléctrica", "Química"],
            explicacion: "Dentro del reactor se libera energía NUCLEAR al romper átomos de uranio. Después se transforma en térmica y luego en eléctrica."
        },
        {
            texto: "Un avión volando a 10.000 metros de altura",
            icono: "plane",
            respuesta: "Potencial",
            opciones: ["Potencial", "Cinética", "Térmica", "Química"],
            explicacion: "A 10.000 metros, el avión tiene una enorme energía POTENCIAL gravitatoria. También tiene cinética por moverse, pero aquí destaca la altura."
        }
    ],

    // ==================== NIVEL 2: CARTAS RENOVABLE / NO RENOVABLE ====================
    // El alumno arrastra cartas a zona VERDE (renovable) o ROJA (no renovable)
    nivel2Cartas: [
        // === RENOVABLES (12) ===
        { nombre: "Panel Solar", icono: "solar", renovable: true,
          dato: "España tiene más de 3.000 horas de sol al año. Ideal para paneles." },
        { nombre: "Aerogenerador", icono: "wind", renovable: true,
          dato: "Un aerogenerador grande produce electricidad para unas 1.500 casas." },
        { nombre: "Central Hidroeléctrica", icono: "hydro", renovable: true,
          dato: "Las presas generan el 16% de la electricidad mundial." },
        { nombre: "Biomasa", icono: "biomass", renovable: true,
          dato: "Usa residuos agrícolas y forestales. Renovable pero emite algo de CO2." },
        { nombre: "Energía Geotérmica", icono: "geothermal", renovable: true,
          dato: "En Islandia, el 90% de las casas se calientan con geotérmica." },
        { nombre: "Energía Mareomotriz", icono: "wave", renovable: true,
          dato: "Aprovecha las mareas. Francia tiene la mayor planta del mundo." },
        { nombre: "Solar Térmica", icono: "solar_thermal", renovable: true,
          dato: "Usa espejos para concentrar el calor del sol y producir vapor." },
        { nombre: "Eólica Marina", icono: "wind_offshore", renovable: true,
          dato: "Los parques eólicos en el mar aprovechan vientos más fuertes y constantes." },
        { nombre: "Mini-Hidráulica", icono: "hydro_small", renovable: true,
          dato: "Pequeñas centrales en ríos que generan energía con bajo impacto ambiental." },
        { nombre: "Biogas", icono: "biogas", renovable: true,
          dato: "Se obtiene de la descomposición de residuos orgánicos. Reduce vertederos." },
        { nombre: "Energía de las Olas", icono: "wave2", renovable: true,
          dato: "Las olas del océano tienen una energía enorme. Tecnología en desarrollo." },
        { nombre: "Energía Solar Pasiva", icono: "solar_passive", renovable: true,
          dato: "Diseño de edificios para aprovechar la luz y el calor del sol sin paneles." },
        // === NO RENOVABLES (8) ===
        { nombre: "Central de Carbón", icono: "coal", renovable: false,
          dato: "El carbón es el combustible fósil MAS contaminante. Emite más CO2 que ningún otro." },
        { nombre: "Central de Gas Natural", icono: "gas", renovable: false,
          dato: "Contamina menos que el carbón, pero sigue emitiendo CO2. Se agotará." },
        { nombre: "Central de Petróleo", icono: "oil", renovable: false,
          dato: "El petróleo tarda millones de años en formarse. No es renovable." },
        { nombre: "Central Nuclear", icono: "nuclear", renovable: false,
          dato: "El uranio se AGOTA. Además genera residuos radiactivos que duran miles de años." },
        { nombre: "Central de Fuel-Oil", icono: "fuel", renovable: false,
          dato: "Derivado del petróleo. Muy contaminante y cada vez menos usado." },
        { nombre: "Gas de Fracking", icono: "fracking", renovable: false,
          dato: "Se extrae rompiendo rocas subterráneas. Contamina aguas y genera terremotos." },
        { nombre: "Turba", icono: "peat", renovable: false,
          dato: "Material orgánico parcialmente descompuesto. Tarda miles de años en formarse." },
        { nombre: "Ciclo Combinado (Gas)", icono: "combined", renovable: false,
          dato: "Usa gas natural en dos fases. Más eficiente que una central de gas normal, pero sigue siendo fósil." }
    ],

    // Preguntas bonus tras clasificar todas las cartas
    nivel2PreguntasBonus: [
        {
            pregunta: "De todas las fuentes, ¿cuál contamina MAS?",
            respuesta: "Carbón",
            opciones: ["Carbón", "Gas natural", "Nuclear", "Petróleo"],
            explicacion: "El carbón emite casi el DOBLE de CO2 que el gas natural por cada kWh producido."
        },
        {
            pregunta: "¿Qué fuente NO renovable produce MAS electricidad por central?",
            respuesta: "Nuclear",
            opciones: ["Nuclear", "Carbón", "Gas natural", "Petróleo"],
            explicacion: "Una central nuclear produce tanta electricidad como miles de aerogeneradores. Pero los residuos..."
        },
        {
            pregunta: "¿Qué renovable funciona de noche y sin viento?",
            respuesta: "Geotérmica",
            opciones: ["Geotérmica", "Solar", "Eólica", "Mareomotriz"],
            explicacion: "La geotérmica funciona 24/7 porque el calor de la Tierra no depende del clima."
        },
        {
            pregunta: "¿Qué porcentaje de electricidad en España es renovable (aprox)?",
            respuesta: "Más del 50%",
            opciones: ["Más del 50%", "Menos del 10%", "Exactamente 25%", "El 100%"],
            explicacion: "En 2023, más del 50% de la electricidad española vino de renovables. ¡Vamos bien!"
        },
        {
            pregunta: "¿Cuál es la PRINCIPAL desventaja de solar y eólica?",
            respuesta: "Dependen del clima (sol, viento)",
            opciones: ["Dependen del clima (sol, viento)", "Son muy caras", "Contaminan mucho", "Ocupan poco espacio"],
            explicacion: "Sin sol no hay solar, sin viento no hay eólica. Por eso necesitamos baterías y un mix de fuentes."
        }
    ],

    // ==================== NIVEL 3: CADENAS DE TRANSFORMACIÓN ====================
    cadenas: [
        {
            nombre: "Motor de un coche",
            pasos: ["Química", "Térmica", "Mecánica"],
            explicacion: "La gasolina (química) se quema produciendo calor (térmica), que empuja los pistones y mueve las ruedas (mecánica).",
            dificultad: 1
        },
        {
            nombre: "Panel solar fotovoltaico",
            pasos: ["Luminosa", "Eléctrica"],
            explicacion: "La luz del sol se convierte directamente en electricidad en las células fotovoltaicas. Cadena corta y limpia.",
            dificultad: 1
        },
        {
            nombre: "Central térmica de carbón",
            pasos: ["Química", "Térmica", "Mecánica", "Eléctrica"],
            explicacion: "El carbón se quema (química a térmica), el vapor mueve turbinas (mecánica) y el generador produce electricidad.",
            dificultad: 2
        },
        {
            nombre: "Presa hidroeléctrica",
            pasos: ["Potencial", "Cinética", "Mecánica", "Eléctrica"],
            explicacion: "El agua en la presa (potencial) cae (cinética), mueve la turbina (mecánica) y genera electricidad.",
            dificultad: 2
        },
        {
            nombre: "Aerogenerador",
            pasos: ["Cinética", "Mecánica", "Eléctrica"],
            explicacion: "El viento (cinética) mueve las aspas (mecánica), que hacen girar el generador para producir electricidad.",
            dificultad: 1
        },
        {
            nombre: "Central nuclear",
            pasos: ["Nuclear", "Térmica", "Mecánica", "Eléctrica"],
            explicacion: "La fisión del uranio (nuclear) genera calor (térmica), mueve turbinas de vapor (mecánica) y genera electricidad.",
            dificultad: 3
        },
        {
            nombre: "Cuerpo humano corriendo",
            pasos: ["Química", "Mecánica", "Térmica"],
            explicacion: "Los alimentos (química) dan energía a tus músculos (mecánica). Al correr te calientas (térmica).",
            dificultad: 2
        },
        {
            nombre: "Linterna",
            pasos: ["Química", "Eléctrica", "Luminosa"],
            explicacion: "La pila (química) genera electricidad, y la bombilla la transforma en luz (luminosa).",
            dificultad: 1
        },
        {
            nombre: "Planta haciendo fotosíntesis",
            pasos: ["Luminosa", "Química"],
            explicacion: "Las plantas capturan la luz del sol y la convierten en energía química almacenada en glucosa.",
            dificultad: 2
        },
        {
            nombre: "Coche eléctrico con panel solar",
            pasos: ["Luminosa", "Eléctrica", "Química", "Eléctrica", "Mecánica"],
            explicacion: "Sol (luminosa) genera electricidad, se almacena en batería (química), se libera como electricidad y mueve el motor (mecánica).",
            dificultad: 3
        }
    ],

    // Tipos de energía disponibles (para bloques del puzzle + distractores)
    tiposEnergia: [
        "Química", "Térmica", "Mecánica", "Eléctrica",
        "Luminosa", "Sonora", "Nuclear", "Potencial",
        "Cinética", "Elástica"
    ],

    // ==================== NIVEL 4: DILEMAS DE DECISIÓN ====================
    // La ciudad tiene problemas. El alumno elige entre opciones con consecuencias.
    // contaminación: puntos de contaminación que sube (de 0 a 100 es game over)
    // puntos: score obtenido
    nivel4Dilemas: [
        {
            situacion: "URGENCIA! El hospital necesita electricidad de emergencia. Se ha cortado la red.",
            opciones: [
                { texto: "Generador diesel de emergencia", contaminacion: 12, puntos: 40,
                  explicacion: "Funciona al instante, pero quema combustible fósil. En emergencias, a veces no hay otra opción." },
                { texto: "Conectar baterías solares de reserva", contaminacion: 0, puntos: 80,
                  explicacion: "¡Limpio y silencioso! Pero solo funciona si las baterías estaban cargadas. Planificar es clave." },
                { texto: "Esperar a que vuelva la red general", contaminacion: 0, puntos: 10,
                  explicacion: "¡En un hospital NO se puede esperar! Los pacientes dependen de la electricidad. Mala decisión." }
            ]
        },
        {
            situacion: "El colegio quiere poner aire acondicionado en todas las aulas. ¿Cómo lo alimentamos?",
            opciones: [
                { texto: "Paneles solares en el tejado", contaminacion: 0, puntos: 100,
                  explicacion: "¡Perfecto! Sol en verano = máximo rendimiento solar justo cuando más frío necesitas. Genial." },
                { texto: "Conectar a la red de gas natural", contaminacion: 10, puntos: 30,
                  explicacion: "Funciona, pero contamina y cuesta dinero cada mes. No es sostenible a largo plazo." },
                { texto: "No poner aire acondicionado", contaminacion: 0, puntos: 20,
                  explicacion: "Ahorras energía, sí... pero a 40 grados no se puede estudiar. Hay que buscar equilibrio." }
            ]
        },
        {
            situacion: "Una fábrica quiere duplicar su producción. Necesita el DOBLE de electricidad.",
            opciones: [
                { texto: "Instalar parque eólico propio", contaminacion: 0, puntos: 90,
                  explicacion: "Inversión alta pero rentable a largo plazo. Cero emisiones y factura eléctrica mínima." },
                { texto: "Comprar un generador de carbón barato", contaminacion: 20, puntos: 20,
                  explicacion: "Barato al principio, carísimo después: multas por contaminar, impuesto al CO2... y el planeta sufre." },
                { texto: "Mejorar eficiencia para no necesitar más energía", contaminacion: 0, puntos: 70,
                  explicacion: "¡Inteligente! A veces la mejor energía es la que NO se consume. Máquinas eficientes, LED, aislamiento..." }
            ]
        },
        {
            situacion: "Los autobuses de la ciudad son viejos y diesel. Hay que renovarlos.",
            opciones: [
                { texto: "Comprar autobuses eléctricos", contaminacion: -5, puntos: 100,
                  explicacion: "¡Sin emisiones en la ciudad! Más silenciosos, más baratos de mantener. El futuro del transporte urbano." },
                { texto: "Comprar autobuses diesel nuevos (más eficientes)", contaminacion: 8, puntos: 30,
                  explicacion: "Algo mejor que los viejos, pero siguen emitiendo gases. Es quedarse a medias." },
                { texto: "Comprar autobuses de gas natural", contaminacion: 5, puntos: 50,
                  explicacion: "Menos contaminantes que el diesel, pero siguen usando combustible fósil. Una solución intermedia." }
            ]
        },
        {
            situacion: "La vieja central de carbón de la ciudad cumple 40 años. ¿Qué hacemos?",
            opciones: [
                { texto: "Cerrarla y construir un parque solar", contaminacion: -10, puntos: 100,
                  explicacion: "¡La mejor decisión! Se elimina una fuente de contaminación enorme y se sustituye por energía limpia." },
                { texto: "Renovarla con filtros modernos", contaminacion: 5, puntos: 30,
                  explicacion: "Los filtros reducen ALGO la contaminación, pero sigue quemando carbón. Es poner una tirita a una herida grande." },
                { texto: "Convertirla en central de gas natural", contaminacion: 3, puntos: 50,
                  explicacion: "Mejor que el carbón, pero sigue siendo fósil. Al menos reduce las emisiones a la mitad." }
            ]
        },
        {
            situacion: "Se construye un barrio nuevo para 5.000 familias. ¿De dónde sacamos su electricidad?",
            opciones: [
                { texto: "Paneles solares en cada casa + baterías comunitarias", contaminacion: 0, puntos: 100,
                  explicacion: "¡Autoconsumo colectivo! Cada casa genera, las baterías almacenan. Un barrio del futuro." },
                { texto: "Conectar a la red existente (mix energético normal)", contaminacion: 6, puntos: 40,
                  explicacion: "Fácil y rápido, pero el mix español aún tiene fósiles. Se puede hacer mejor." },
                { texto: "Instalar calefacción central de gas", contaminacion: 12, puntos: 15,
                  explicacion: "Es 2024, no 1990. El gas es caro, contamina y se agota. Hay opciones mucho mejores." }
            ]
        },
        {
            situacion: "Sequía extrema! Los embalses están al 20%. La hidroeléctrica apenas produce.",
            opciones: [
                { texto: "Activar más parques eólicos y solares", contaminacion: 0, puntos: 90,
                  explicacion: "¡Diversificar fuentes! Si una falla, las otras compensan. Así funciona un sistema energético resiliente." },
                { texto: "Encender centrales de carbón de reserva", contaminacion: 18, puntos: 20,
                  explicacion: "Resuelve el problema inmediato pero a costa de contaminar. Es la opción fácil y cortoplacista." },
                { texto: "Pedir a la gente que consuma menos", contaminacion: 0, puntos: 60,
                  explicacion: "Reducir consumo ayuda, pero no basta en una emergencia. Hace falta combinar ahorro con fuentes alternativas." }
            ]
        },
        {
            situacion: "Ola de calor! 42 grados. Todo el mundo enciende el aire acondicionado a la vez.",
            opciones: [
                { texto: "Activar todas las renovables al máximo", contaminacion: 0, puntos: 80,
                  explicacion: "Con sol a tope, los paneles solares rinden al máximo. ¡Justo cuando más se necesita!" },
                { texto: "Encender la central de gas de emergencia", contaminacion: 10, puntos: 40,
                  explicacion: "Necesario si las renovables no cubren la demanda, pero no debería ser la primera opción." },
                { texto: "Cortar la luz por turnos en los barrios", contaminacion: 0, puntos: 30,
                  explicacion: "Evita un apagón total, pero la gente sufre. Con buena planificación se puede evitar llegar a esto." }
            ]
        },
        {
            situacion: "La fábrica de la ciudad quiere verter residuos químicos al río para ahorrar costes.",
            opciones: [
                { texto: "Prohibirlo y obligar a reciclar residuos", contaminacion: -5, puntos: 100,
                  explicacion: "Los ríos son VIDA. Contaminarlos es un desastre ecológico. Reciclar cuesta más pero es lo correcto." },
                { texto: "Permitirlo con un impuesto por contaminar", contaminacion: 10, puntos: 20,
                  explicacion: "Un impuesto no limpia el río. Pagar por contaminar no hace que sea menos dañino." },
                { texto: "Permitirlo si tratan parcialmente los residuos", contaminacion: 5, puntos: 35,
                  explicacion: "Mejor que nada, pero 'parcialmente' no es suficiente. Los ecosistemas acuáticos son muy frágiles." }
            ]
        },
        {
            situacion: "Último dilema! El alumbrado público de la ciudad consume una barbaridad.",
            opciones: [
                { texto: "Cambiar todo a LED con sensores de movimiento", contaminacion: -8, puntos: 100,
                  explicacion: "¡LEDs gastan un 80% menos! Y los sensores apagan las luces cuando no pasa nadie. Ahorro brutal." },
                { texto: "Apagar el alumbrado a partir de medianoche", contaminacion: -3, puntos: 40,
                  explicacion: "Ahorra energía pero genera inseguridad. No es la mejor solución." },
                { texto: "Dejar las farolas actuales, no es prioridad", contaminacion: 5, puntos: 10,
                  explicacion: "El alumbrado puede ser el 40% del gasto energético de un ayuntamiento. SI es prioridad." }
            ]
        }
    ],

    // ==================== NIVEL 5: DATOS SPEED ROUND ====================
    // El nivel 5 mezcla mecánicas de todos los niveles anteriores
    // Estos son retos rápidos específicos para el speed round
    nivel5Retos: [
        // Tipo 1: Clasificación rápida (como nivel 1 pero más rápido)
        { tipo: "clasificacion", texto: "Agua hirviendo en una tetera", respuesta: "Térmica",
          opciones: ["Térmica", "Química", "Cinética", "Eléctrica"] },
        { tipo: "clasificacion", texto: "Un patinador deslizándose", respuesta: "Cinética",
          opciones: ["Cinética", "Potencial", "Elástica", "Térmica"] },
        { tipo: "clasificacion", texto: "Gasolina en el depósito", respuesta: "Química",
          opciones: ["Química", "Térmica", "Cinética", "Nuclear"] },
        { tipo: "clasificacion", texto: "Un altavoz sonando", respuesta: "Sonora",
          opciones: ["Sonora", "Eléctrica", "Cinética", "Luminosa"] },
        { tipo: "clasificacion", texto: "Agua en lo alto de una cascada", respuesta: "Potencial",
          opciones: ["Potencial", "Cinética", "Térmica", "Química"] },
        // Tipo 2: Renovable o no (como nivel 2 pero decisión rápida)
        { tipo: "renovable", texto: "Energía Eólica", respuesta: true },
        { tipo: "renovable", texto: "Central de Carbón", respuesta: false },
        { tipo: "renovable", texto: "Panel Solar", respuesta: true },
        { tipo: "renovable", texto: "Gas Natural", respuesta: false },
        { tipo: "renovable", texto: "Geotérmica", respuesta: true },
        { tipo: "renovable", texto: "Petróleo", respuesta: false },
        { tipo: "renovable", texto: "Hidroeléctrica", respuesta: true },
        { tipo: "renovable", texto: "Nuclear (Uranio)", respuesta: false },
        // Tipo 3: Mini-cadena (2-3 pasos, como nivel 3 simplificado)
        { tipo: "cadena", nombre: "Bombilla LED",
          pasos: ["Eléctrica", "Luminosa"], distractores: ["Térmica", "Química"] },
        { tipo: "cadena", nombre: "Estufa eléctrica",
          pasos: ["Eléctrica", "Térmica"], distractores: ["Luminosa", "Mecánica"] },
        { tipo: "cadena", nombre: "Motor eléctrico",
          pasos: ["Eléctrica", "Mecánica"], distractores: ["Térmica", "Sonora"] },
        { tipo: "cadena", nombre: "Vela encendida",
          pasos: ["Química", "Térmica", "Luminosa"], distractores: ["Eléctrica"] },
        // Tipo 4: Pregunta rápida de conocimiento
        { tipo: "pregunta", pregunta: "¿Qué gas causa el efecto invernadero?", respuesta: "CO2",
          opciones: ["CO2", "Oxígeno", "Nitrógeno", "Helio"] },
        { tipo: "pregunta", pregunta: "Las 3R son: Reducir, Reutilizar y...", respuesta: "Reciclar",
          opciones: ["Reciclar", "Reparar", "Renovar", "Recoger"] },
        { tipo: "pregunta", pregunta: "El ODS 7 trata sobre...", respuesta: "Energía limpia",
          opciones: ["Energía limpia", "Agua potable", "Hambre cero", "Salud"] },
        { tipo: "pregunta", pregunta: "¿Qué es más eficiente: LED o incandescente?", respuesta: "LED",
          opciones: ["LED", "Incandescente", "Son iguales", "Depende del color"] },
        { tipo: "pregunta", pregunta: "Autoconsumo energético es...", respuesta: "Producir tu propia electricidad",
          opciones: ["Producir tu propia electricidad", "Gastar toda la energía", "No usar electricidad", "Comprar electricidad barata"] }
    ],

    // Cuánto resta de la factura cada tipo de acierto en nivel 5
    nivel5Recompensas: {
        clasificacion: 2000,
        renovable: 1500,
        cadena: 3000,
        pregunta: 2500
    },

    // ==================== FUENTES DE ENERGÍA (referencia general) ====================
    energySources: {
        solar: { name: 'Panel Solar', renewable: true, pollution: 0, description: 'Convierte la luz del sol en electricidad.' },
        wind: { name: 'Aerogenerador', renewable: true, pollution: 0, description: 'Usa el viento para generar electricidad.' },
        hydro: { name: 'Hidroeléctrica', renewable: true, pollution: 0, description: 'Aprovecha la fuerza del agua.' },
        biomass: { name: 'Biomasa', renewable: true, pollution: 8, description: 'Quema materia orgánica para producir energía.' },
        geothermal: { name: 'Geotérmica', renewable: true, pollution: 0, description: 'Aprovecha el calor del interior de la Tierra.' },
        coal: { name: 'Central de Carbón', renewable: false, pollution: 35, description: 'Quema carbón. Muy contaminante.' },
        gas: { name: 'Central de Gas', renewable: false, pollution: 20, description: 'Quema gas natural. Contamina bastante.' },
        nuclear: { name: 'Central Nuclear', renewable: false, pollution: 5, description: 'Fisión nuclear. Potente pero genera residuos.' },
        oil: { name: 'Central de Petróleo', renewable: false, pollution: 30, description: 'Quema derivados del petróleo.' }
    },

    // ==================== PREGUNTAS POR TEMA (para Modo Estudio y repaso) ====================
    nivel1Preguntas: [
        { pregunta: "¿Qué tipo de energía tiene un objeto en movimiento?", respuesta: "Energía cinética", opciones: ["Energía cinética", "Energía potencial", "Energía térmica", "Energía química"], explicacion: "La energía cinética es la que tiene un cuerpo por estar en movimiento. Cuanto más rápido va, más energía cinética tiene." },
        { pregunta: "¿Cómo se llama la energía almacenada en los alimentos?", respuesta: "Energía química", opciones: ["Energía química", "Energía térmica", "Energía nuclear", "Energía luminosa"], explicacion: "Los alimentos almacenan energía química en sus enlaces moleculares. Cuando comes, tu cuerpo la transforma." },
        { pregunta: "¿Qué tipo de energía produce el Sol principalmente?", respuesta: "Energía luminosa y térmica", opciones: ["Energía luminosa y térmica", "Solo energía eléctrica", "Energía mecánica", "Energía sonora"], explicacion: "El Sol emite energía luminosa (luz) y térmica (calor). Es la fuente de casi toda la energía de la Tierra." },
        { pregunta: "¿Cómo se llama la energía que tiene un objeto por su posición elevada?", respuesta: "Energía potencial gravitatoria", opciones: ["Energía potencial gravitatoria", "Energía cinética", "Energía elástica", "Energía eléctrica"], explicacion: "Un objeto elevado tiene energía potencial gravitatoria. Cuanto más alto y más pesa, más energía almacena." },
        { pregunta: "¿La energía eléctrica se puede transformar fácilmente en otras formas?", respuesta: "Sí, es muy versátil", opciones: ["Sí, es muy versátil", "No, solo produce calor", "Solo produce luz", "No se puede transformar"], explicacion: "La electricidad se transforma fácilmente: en luz, calor, movimiento, sonido... Por eso es tan útil." },
        { pregunta: "¿Qué tipo de energía tiene un muelle comprimido?", respuesta: "Energía potencial elástica", opciones: ["Energía potencial elástica", "Energía cinética", "Energía térmica", "Energía química"], explicacion: "Un muelle comprimido almacena energía potencial elástica. Al soltarlo, se convierte en movimiento." },
        { pregunta: "La energía NO se crea ni se destruye, solo se...", respuesta: "Transforma", opciones: ["Transforma", "Multiplica", "Elimina", "Congela"], explicacion: "Este es el Principio de Conservación de la Energía. La energía siempre se transforma de un tipo a otro." },
        { pregunta: "¿Qué forma de energía produce una guitarra al sonar?", respuesta: "Energía sonora", opciones: ["Energía sonora", "Energía luminosa", "Energía nuclear", "Energía química"], explicacion: "Las cuerdas vibran y producen ondas sonoras: energía sonora." },
        { pregunta: "Un ventilador transforma energía eléctrica en...", respuesta: "Energía mecánica (movimiento)", opciones: ["Energía mecánica (movimiento)", "Energía química", "Energía nuclear", "Energía potencial"], explicacion: "El motor del ventilador convierte la electricidad en movimiento de las aspas. Eso es energía mecánica." },
        { pregunta: "La energía térmica está relacionada con...", respuesta: "La temperatura y el calor", opciones: ["La temperatura y el calor", "La electricidad", "El magnetismo", "La gravedad"], explicacion: "La energía térmica es la asociada a la temperatura. Cuanto más caliente está algo, más energía térmica tiene." }
    ],

    nivel2Preguntas: [
        { pregunta: "¿Cuál de estas es una fuente de energía RENOVABLE?", respuesta: "Energía solar", opciones: ["Energía solar", "Carbón", "Petróleo", "Gas natural"], explicacion: "La energía solar es renovable porque el Sol no se va a agotar en millones de años." },
        { pregunta: "¿Qué combustible fósil es el MÁS contaminante?", respuesta: "Carbón", opciones: ["Carbón", "Gas natural", "Petróleo", "Uranio"], explicacion: "El carbón emite más CO2 por unidad de energía que cualquier otro combustible fósil." },
        { pregunta: "¿Qué fuente de energía usa el VIENTO?", respuesta: "Energía eólica", opciones: ["Energía eólica", "Energía solar", "Energía geotérmica", "Energía hidráulica"], explicacion: "Los aerogeneradores aprovechan la fuerza del viento para generar electricidad." },
        { pregunta: "Una central hidroeléctrica aprovecha...", respuesta: "La fuerza del agua en movimiento", opciones: ["La fuerza del agua en movimiento", "El calor del agua", "La evaporación", "La salinidad del mar"], explicacion: "Las centrales hidroeléctricas usan la caída del agua para mover turbinas y generar electricidad." },
        { pregunta: "La energía NUCLEAR se obtiene al...", respuesta: "Romper átomos de uranio (fisión)", opciones: ["Romper átomos de uranio (fisión)", "Quemar uranio", "Calentar agua con el sol", "Fusionar hidrógeno"], explicacion: "Las centrales nucleares usan la FISIÓN: rompen átomos de uranio y liberan energía enorme." },
        { pregunta: "La BIOMASA consiste en usar...", respuesta: "Materia orgánica como combustible", opciones: ["Materia orgánica como combustible", "Energía del viento", "Agua del mar", "Paneles solares"], explicacion: "La biomasa aprovecha restos de madera, residuos agrícolas, etc. Se considera renovable." },
        { pregunta: "¿Qué fuente aprovecha el calor del interior de la Tierra?", respuesta: "Energía geotérmica", opciones: ["Energía geotérmica", "Energía solar", "Energía eólica", "Energía de mareas"], explicacion: "La geotérmica aprovecha el calor natural del interior de la Tierra. Es limpia e inagotable." },
        { pregunta: "¿Cuál es la PRINCIPAL desventaja de las renovables?", respuesta: "Dependen de condiciones climáticas", opciones: ["Dependen de condiciones climáticas", "Contaminan más que fósiles", "Son imposibles de instalar", "No generan electricidad"], explicacion: "El sol no siempre brilla y el viento no siempre sopla. Por eso necesitamos almacenamiento y diversificación." }
    ],

    nivel3Preguntas: [
        { pregunta: "En un coche de gasolina, ¿qué cadena ocurre?", respuesta: "Química -> Térmica -> Mecánica", opciones: ["Química -> Térmica -> Mecánica", "Eléctrica -> Mecánica -> Térmica", "Nuclear -> Térmica", "Mecánica -> Química"], explicacion: "La gasolina (química) se quema (térmica), que mueve los pistones (mecánica)." },
        { pregunta: "En un panel solar, ¿qué transformación ocurre?", respuesta: "Luminosa -> Eléctrica", opciones: ["Luminosa -> Eléctrica", "Térmica -> Eléctrica", "Química -> Eléctrica", "Mecánica -> Eléctrica"], explicacion: "Los paneles fotovoltaicos convierten directamente la luz en electricidad." },
        { pregunta: "Cuando frotamos las manos, transformamos energía...", respuesta: "Mecánica en térmica", opciones: ["Mecánica en térmica", "Química en luminosa", "Eléctrica en sonora", "Térmica en mecánica"], explicacion: "El movimiento de frotar (mecánica) se convierte en calor (térmica) por la fricción." },
        { pregunta: "Una bombilla incandescente transforma electricidad en...", respuesta: "Luz (10%) y calor (90%)", opciones: ["Luz (10%) y calor (90%)", "Solo luz (100%)", "Solo calor", "Sonido y luz"], explicacion: "Las bombillas incandescentes son muy ineficientes: el 90% se pierde como calor." },
        { pregunta: "En una presa, el agua transforma energía...", respuesta: "Potencial -> Cinética -> Mecánica -> Eléctrica", opciones: ["Potencial -> Cinética -> Mecánica -> Eléctrica", "Química -> Térmica -> Eléctrica", "Luminosa -> Eléctrica", "Nuclear -> Eléctrica"], explicacion: "El agua almacenada (potencial) cae (cinética), mueve la turbina (mecánica) y genera electricidad." },
        { pregunta: "¿Por qué se calienta el cargador del móvil?", respuesta: "Parte de la energía se pierde como calor", opciones: ["Parte de la energía se pierde como calor", "Produce calor a propósito", "El teléfono envía calor", "Es un defecto"], explicacion: "Ningún proceso es 100% eficiente. Siempre se pierde algo de energía como calor." },
        { pregunta: "¿Qué pasa con la energía 'perdida' en cada transformación?", respuesta: "Se convierte en calor", opciones: ["Se convierte en calor", "Desaparece", "Se convierte en materia", "Vuelve a su forma original"], explicacion: "La energía 'perdida' se convierte en calor que se disipa. Por eso ninguna máquina es 100% eficiente." }
    ],

    nivel4Preguntas: [
        { pregunta: "¿Qué gas es el principal responsable del efecto invernadero?", respuesta: "CO2", opciones: ["CO2", "Oxígeno", "Nitrógeno", "Hidrógeno"], explicacion: "El CO2 atrapa el calor en la atmósfera. La quema de fósiles ha aumentado su concentración un 50%." },
        { pregunta: "¿Qué es el cambio climático?", respuesta: "Aumento de temperatura por gases de efecto invernadero", opciones: ["Aumento de temperatura por gases de efecto invernadero", "Cambio de estaciones", "Tormentas normales", "Solo afecta al Polo Norte"], explicacion: "El cambio climático es el aumento anormal de temperatura causado por gases como el CO2." },
        { pregunta: "¿Qué es la huella de carbono?", respuesta: "El total de CO2 que genera una persona", opciones: ["El total de CO2 que genera una persona", "Una marca en el suelo", "El color del carbón", "Un tipo de roca"], explicacion: "Tu huella de carbono es la suma de gases de efecto invernadero que produces al vivir." },
        { pregunta: "Un coche eléctrico contamina...", respuesta: "Menos que uno de gasolina", opciones: ["Menos que uno de gasolina", "Igual", "Más", "Nada en absoluto"], explicacion: "Un coche eléctrico no emite gases al circular. Si se carga con renovables, su impacto es mínimo." },
        { pregunta: "Los residuos nucleares son peligrosos porque...", respuesta: "Emiten radiación miles de años", opciones: ["Emiten radiación miles de años", "Explotan fácilmente", "Solo contaminan aire", "Se descomponen rápido"], explicacion: "Los residuos nucleares mantienen su radiactividad durante decenas de miles de años." }
    ],

    nivel5Preguntas: [
        { pregunta: "¿Qué es el desarrollo sostenible?", respuesta: "Satisfacer necesidades sin comprometer el futuro", opciones: ["Satisfacer necesidades sin comprometer el futuro", "Producir toda la energía posible", "No usar tecnología", "Volver a la Edad Media"], explicacion: "Desarrollo sostenible: progresar HOY sin destruir los recursos de las generaciones futuras." },
        { pregunta: "La Agenda 2030 es...", respuesta: "Un plan de la ONU con 17 ODS", opciones: ["Un plan de la ONU con 17 ODS", "Una marca", "Un programa de TV", "Una ley solo de España"], explicacion: "La Agenda 2030 establece 17 Objetivos de Desarrollo Sostenible para todos los países." },
        { pregunta: "¿Qué es la eficiencia energética?", respuesta: "Usar menos energía para el mismo resultado", opciones: ["Usar menos energía para el mismo resultado", "Usar más energía", "No usar electricidad", "Gastar todo"], explicacion: "Un LED ilumina igual que una incandescente usando un 80% menos de energía. Eso es eficiencia." },
        { pregunta: "Las 3R son: Reducir, Reutilizar y...", respuesta: "Reciclar", opciones: ["Reciclar", "Romper", "Renovar", "Reír"], explicacion: "Reducir, Reutilizar, Reciclar. En ese orden de prioridad." },
        { pregunta: "¿Qué es una Smart Grid?", respuesta: "Una red eléctrica inteligente", opciones: ["Una red eléctrica inteligente", "Un videojuego", "Una red social", "Una marca"], explicacion: "Las smart grids equilibran automáticamente producción y consumo de electricidad." },
        { pregunta: "¿Qué es el autoconsumo energético?", respuesta: "Producir tu propia electricidad", opciones: ["Producir tu propia electricidad", "Consumir sin límite", "No usar electricidad", "Comprar de otro país"], explicacion: "Con paneles solares en tu tejado, generas tu propia electricidad. Es el futuro." }
    ],

    // ==================== FRASES DEL PROFESOR (x10 UPGRADE) ====================
    frases: {
        intro: [
            "47.000 euros. CUARENTA Y SIETE MIL EUROS.",
            "Todo por culpa de 200 estufas. En UN mes.",
            "Pues ahora vais a aprender sobre energía... POR LAS MALAS.",
            "Si no aprendéis, os pongo a pedalear para generar electricidad.",
            "Mi mujer dice que soy un desastre. Mi banco también.",
            "El cartero lloró al entregarme la factura. LLORÓ.",
            "He considerado mudarme al Sol. Allí la energía es gratis.",
            "200 estufas. Ni el estadio Santiago Bernabéu tiene tantas."
        ],
        inicio: [
            "A ver, lumbreras, vamos allá.",
            "Espero que al menos sepáis lo que es un enchufe.",
            "Yo con la factura, vosotros con los libros. JUSTICIA.",
            "Si lo hacéis mal, otro apagón. Y esta vez SIN calefacción.",
            "Preparaos. Esto va a ser más duro que mi factura.",
            "Vamos allá. Y si suspendéis, enciendo la estufa 201.",
            "Atención máxima. Cada error mío son 235 euros más.",
            "Modo profesor ENFADADO: activado.",
            "Mis estufas creen en vosotros. Yo no tanto.",
            "Venga, demostrad que al menos servís para algo.",
            "Último aviso: si falláis, os mando la factura a casa.",
            "Allá vamos. La cuenta del colegio tiembla."
        ],
        correcta: [
            "Vaya, alguien ha estudiado... por primera vez en su vida.",
            "Correcto. Me sorprende. De verdad me sorprende.",
            "Bien. Pero no te emociones, era fácil.",
            "Anda, lo has acertado. Qué susto me has dado.",
            "Correcto. A lo mejor no necesito las 200 estufas para entrar en calor.",
            "Mira tú, un alumno que SABE algo. Tenía que verlo.",
            "¡Bien! Voy a apagar una estufa en tu honor.",
            "¡Correcto! Casi me caigo de la silla. CASI.",
            "¡Lo has clavado! Como yo clavé las 200 estufas... al enchufe.",
            "¡Impresionante! Hay esperanza para la humanidad.",
            "¡Así sí! Mi factura baja un poquito con cada acierto.",
            "¡Bien hecho! Ojalá fueras así de listo pagando facturas.",
            "¡Correcto! Me está entrando calor... de la emoción, no de las estufas.",
            "¡ESO ES! ¡Acabas de ahorrarte 0,003 céntimos de mi factura!",
            "¡Bravo! Te daría un aplauso pero tengo las manos frías. Sin estufa."
        ],
        incorrecta: [
            "MAL. Completamente MAL. Como mi factura.",
            "Incorrecto. Y luego os quejáis de los exámenes.",
            "ERROR. Por eso tenemos que pagar 47.000 euros.",
            "Ni idea. Cero. Nada. Como vuestro interés por estudiar.",
            "INCORRECTO. Me dan ganas de encender otra estufa del disgusto.",
            "Eso está peor que mi factura de la luz, y ya es decir.",
            "¡MAL! Acabo de encender la estufa 201 del DISGUSTO.",
            "Incorrecto. Voy a llorar. Con calefacción, eso sí.",
            "¡ERROR! Así no se paga ni el recibo del móvil.",
            "Eso duele. Me duele más que la factura. Bueno no, la factura duele más.",
            "Has fallado. Como yo fallé al calcular cuántas estufas necesitaba.",
            "¡INCORRECTO! Mi gato sabe más de energía que tú. Y es un gato.",
            "Mal. Tan mal que la compañía eléctrica se ha reído de ti.",
            "¡ERROR! Cada fallo tuyo es una estufa que enciendo del coraje.",
            "Incorrecto. Voy a tener que dar clases particulares... y cobrar en kilovatios."
        ],
        combo: [
            "Vale, vale, estás en racha. No te lo creas mucho.",
            "Combo impresionante... para un alumno.",
            "Estás que te sales. Literalmente. No te salgas del tema.",
            "Racha increíble. A ver cuánto duras.",
            "¡COMBO! ¡Estás más encendido que mis 200 estufas!",
            "¡Vaya racha! Casi me caes bien. CASI.",
            "¡Combo x{n}! ¡Generas más energía que un parque eólico!",
            "¡IMPARABLE! ¡La compañía eléctrica tiembla!",
            "¡Menuda racha! ¡Te contrato para pagar la factura del cole!",
            "¡COMBO LEGENDARIO! ¡Estás al rojo vivo! (como mis estufas)"
        ],
        explicacion: [
            "A ver si con esto lo entiendes...",
            "Te lo explico porque me da pena, no porque seas listo.",
            "Atención, que esto es IMPORTANTE:",
            "Apunta esto, que seguro que se te olvida:",
            "Explicación gratuita. La factura de la explicación ya la pago yo.",
            "Escucha bien, que no lo repito. Bueno sí, lo repito, pero con cara de enfadado.",
            "CLASE MAGISTRAL en 3, 2, 1...",
            "Toma nota mental. O mejor, nota real. Que la mental se te pierde."
        ],
        sorting: [
            "¡Vamos! ¡Renovable o no renovable, no es tan difícil!",
            "¡Arrastra bien, que las cartas no se clasifican solas!",
            "¡Si te equivocas, te explico por qué. Pero intenta acertar!",
            "Verde renovable, rojo no renovable. Más fácil imposible.",
            "Si mis estufas fueran renovables, no tendría este problema.",
            "¡Clasifica bien! ¡Mi futuro energético depende de esto!",
            "Renovable = bueno. No renovable = factura del cole. ¡CLASIFICA!",
            "¡Arrastra con precisión! No como yo arrastré 200 estufas al salón."
        ],
        cadena: [
            "La energía se TRANSFORMA. No aparece por arte de magia.",
            "Ordena bien la cadena o te pongo a pedalear en una bici-generador.",
            "Química, térmica, mecánica... ¡cada paso cuenta!",
            "Si no entiendes las transformaciones, no entiendes NADA.",
            "La energía es como mi humor: se transforma pero nunca desaparece.",
            "Cada transformación pierde algo. Como la cuenta del cole al pagar la factura.",
            "¡Piensa en la cadena! ¡De dónde viene y a dónde va la energía!",
            "Si ordenaras mis facturas tan bien como estas cadenas..."
        ],
        decision: [
            "¡Piensa bien antes de decidir! ¡La ciudad depende de ti!",
            "No siempre hay una respuesta perfecta. Bienvenido a la realidad.",
            "Cada decisión tiene consecuencias. Como poner 200 estufas.",
            "El medidor de contaminación no perdona. Como yo con los exámenes.",
            "¡Decide bien! Yo decidí poner 200 estufas y mira cómo acabé.",
            "La ciudad confía en ti. Más que yo, pero bueno.",
            "Una mala decisión y todo se va al garete. Lo sé por experiencia.",
            "¡Piensa como un ingeniero! No como un profe que compra 200 estufas."
        ],
        speedRound: [
            "¡RÁPIDO! ¡La factura del cole no se paga sola!",
            "¡A toda velocidad! ¡La directora mira el reloj!",
            "¡La factura del cole tiene MUCHOS ceros! ¡Date prisa!",
            "¡Más rápido! ¡Que la directora pierde la paciencia!",
            "¡VELOCIDAD! ¡Más rápido que el contador de la luz del cole!",
            "¡CORRE! ¡Cada segundo son 3 euros más en la factura del Colegio Perú!",
            "¡Tictac tictac! ¡El reloj corre como el contador del cole!",
            "¡SPRINT ENERGÉTICO! ¡Dale gas! Bueno, mejor dale solar.",
            "¡RÁPIDO! ¡La factura crece mientras lees esto!",
            "¡A TOPE! ¡Como las 200 estufas del aula de sexto!"
        ],
        pocasVidas: [
            "Uy, te quedan pocas oportunidades... como a mí para quedarme en el cole.",
            "Una vida más y se acabó. Como mi paciencia.",
            "Vas fatal. Peor que el contrato eléctrico del cole.",
            "¡Última vida! Esto es más tenso que la reunión con la directora.",
            "Te quedan menos vidas que neuronas. Y ya es decir.",
            "¡CUIDADO! Si pierdes, enciendo las 200 estufas OTRA VEZ.",
            "¡Última oportunidad! Como mi última oportunidad de quedarme en el cole."
        ],
        contaminacionAlta: [
            "¡LA CONTAMINACIÓN ESTÁ POR LAS NUBES! ¡Literalmente!",
            "¡El medidor de contaminación está al rojo!",
            "Humo, CO2, desastre... ¡cuidado con las decisiones!",
            "¡La ciudad parece mi cocina cuando encendí las 200 estufas!",
            "¡ALERTA ROJA! ¡Más humo que una central de carbón!",
            "¡La contaminación sube más rápido que mi factura!",
            "¡A este ritmo, la ciudad será inhabitable! Como el aula de sexto con las 200 estufas."
        ],
        nivelSuperado: [
            "¡Has pasado el nivel! ¡La dire me deja una semana más!",
            "Bien... el siguiente es PEOR. Como la factura del cole.",
            "¡Lo has conseguido! El Colegio Perú está orgulloso. Creo.",
            "¡Nivel superado! ¡Voy a desenchufar 5 estufas para celebrar!",
            "¡APROBADO! ¡La dire ha dejado de mirarme mal!",
            "¡Has sobrevivido! Como yo sobreviví a la reunión con la directora.",
            "¡Bien hecho! Otro nivel y quizás me dejen quedarme en el cole."
        ],
        nivelFallido: [
            "¡APAGÓN! No has podido con el nivel. La dire me mira feo...",
            "¡Corte de luz en el Colegio Perú! Directos a las velas.",
            "Has fallado. La directora está sacando mi carta de despido...",
            "¡GAME OVER! La dire ha dicho 'Álvaro, recoge tus estufas'.",
            "Has suspendido. Voy a encender una estufa del disgusto.",
            "¡FRACASO ENERGÉTICO! El cole va a tener que hacer una colecta.",
            "¡Has perdido! La compañía eléctrica ya conoce al Colegio Perú..."
        ],
        victoriaFinal: [
            "¡LO HAS CONSEGUIDO! ¡La factura del Colegio Perú tiene arreglo!",
            "¡Increíble! ¡Mis alumnos saben de energía! ¡La dire no se lo cree!",
            "¡Bien! ¡Ahora a ponerle paneles solares al Colegio Perú!",
            "¡FACTURA PAGADA! ¡La directora Paloma me ha dado un abrazo! ¡INCREÍBLE!",
            "¡VICTORIA! ¡Sois más útiles que mis 200 estufas juntas!",
            "¡LO LOGRASTEIS! ¡El Colegio Perú se salva! ¡Y yo también!",
            "¡GENIAL! ¡Me quedo en el cole! Eso sí... las estufas las quito. QUIZÁS."
        ],
        derrotaFinal: [
            "¡DESASTRE! ¡La factura del Colegio Perú sigue sin pagarse!",
            "¡APAGÓN TOTAL! ¡El cole va a dar clase con velas!",
            "¡FRACASO! ¡Otro mes pagando 47.000 euros! ¡La dire me va a matar!",
            "¡HAS PERDIDO! La directora Paloma ha dicho 'Álvaro, estás despedido'...",
            "¡DERROTA! La factura del cole llora. La dire también. Yo más.",
            "¡APAGÓN DEFINITIVO! ¡El Colegio Perú se ha quedado a oscuras!",
            "¡DESASTRE! Me van a echar del cole... ¿Alguien necesita un profe con 200 estufas?"
        ],
        tiempoAgotado: [
            "¡TIEMPO! Más lento que un molino sin viento.",
            "¡Se acabó el tiempo! Como la gasolina.",
            "¡Demasiado lento! ¡La factura no espera!",
            "¡TIEMPO AGOTADO! ¡Más lento que una placa solar de noche!",
            "¡Se acabó! ¡Tardas más que yo en pagar la factura!",
            "¡TIMEOUT! ¡Ni las energías renovables son tan lentas!"
        ],
        powerUp: [
            "¡Un power-up! Esto no estaba en el examen...",
            "¿Ayuda extra? ¿En MIS clases? Bueno, vale...",
            "¡Power-up! Como cuando enchufé 200 estufas: una ayudita extra.",
            "¡Anda, un bonus! A ver si con esto aprendes algo.",
            "¡Power-up detectado! Ojalá existieran para pagar la factura del cole.",
            "¡Extra energy! ¡Cógelo antes de que la directora me eche!"
        ],
        titular: [
            "¡EXTRA EXTRA! ¡Alumno del Colegio Perú demuestra que sabe ALGO de energía!",
            "NOTICIA: El Colegio Perú busca pagar factura de 47.000€ causada por un profesor.",
            "¡INCREÍBLE: Estudiante del Colegio Perú clasifica energía correctamente!",
            "BREAKING NEWS: ¡Profe Álvaro amenaza con enchufar la estufa 201!",
            "URGENTE: La factura de la luz del Colegio Perú bate récords mundiales.",
            "¡SENSACIONAL: Alumno del cole sabe qué es renovable y qué no!",
            "HISTÓRICO: Primera vez que un alumno del Profe Álvaro NO suspende.",
            "EN DIRECTO: La directora Paloma del Colegio Perú persigue al Profe Álvaro por los pasillos.",
            "FLASH: Las 200 estufas del aula de sexto piden derechos laborales.",
            "ÚLTIMA HORA: Compañía eléctrica nombra al Colegio Perú 'Cliente del Siglo'."
        ]
    },

    // ==================== TITULARES ENTRE NIVELES ====================
    titulares: {
        nivel1Completado: [
            "¡EXTRA! ¡Alumno del Colegio Perú supera El Apagón! ¡Profe Álvaro desenchufa UNA estufa!",
            "NOTICIA: ¡Estudiante demuestra conocer los tipos de energía! ¡La directora sonríe!",
            "FLASH: ¡El Profe Álvaro se salva del despido... de momento!"
        ],
        nivel2Completado: [
            "¡BOMBAZO! ¡Alumno del Colegio Perú distingue renovable de no renovable!",
            "URGENTE: ¡El Colegio Perú podría pasarse a renovables gracias a sus alumnos!",
            "¡INCREÍBLE: Alguien ha clasificado fuentes de energía sin llorar!"
        ],
        nivel3Completado: [
            "¡HISTÓRICO! ¡Estudiante del Colegio Perú ordena cadenas de transformación!",
            "EXTRA: ¡La energía se transforma, y también la nota: de suspenso a aprobado!",
            "¡SENSACIONAL: Alumno entiende que la energía no aparece por magia en los enchufes!"
        ],
        nivel4Completado: [
            "¡ÚLTIMO MINUTO! ¡Barrio del Colegio Perú salvado de desastre ambiental!",
            "BREAKING: ¡Contaminación reducida! ¡El Profe Álvaro promete quitar 10 estufas!",
            "NOTICIA: ¡Alumnos del Colegio Perú toman mejores decisiones que el ayuntamiento!"
        ],
        nivel5Completado: [
            "¡HISTÓRICO! ¡LA FACTURA DE 47.000€ DEL COLEGIO PERÚ HA SIDO PAGADA!",
            "¡CELEBRACIÓN! ¡La directora Paloma abraza al Profe Álvaro! ¡El cole se salva!",
            "¡INCREÍBLE! ¡Los alumnos han logrado lo imposible! ¡La factura del cole es CERO!"
        ],
        derrota: [
            "¡TRAGEDIA! ¡Alumnos no pueden con la energía! ¡Profe Álvaro enciende estufa 201!",
            "¡DESASTRE! ¡La factura del Colegio Perú sigue creciendo! ¡Directora furiosa!",
            "APAGÓN INFORMATIVO: ¡No hay luz en el cole para imprimir este periódico!"
        ]
    },

    // ==================== HISTORIA / INTRO CINEMÁTICA ====================
    historia: {
        intro: [
            { personaje: "narrador", texto: "Colegio Perú. Un lunes por la mañana..." },
            { personaje: "narrador", texto: "La directora Paloma llama al Profe Álvaro a su despacho con cara de pocos amigos..." },
            { personaje: "profesor", texto: "¡Buenos días, dire! ¿Qué pasa? ¿He hecho algo?" },
            { personaje: "narrador", texto: "La directora le enseña una factura de la luz del colegio..." },
            { personaje: "profesor", texto: "¡¿CUARENTA Y SIETE MIL EUROS?! Pero... ¿cómo...?" },
            { personaje: "narrador", texto: "'Álvaro, tus 200 estufas en el aula de sexto. DOSCIENTAS.'" },
            { personaje: "profesor", texto: "¡Es que hacía frío! Solo quería que mis alumnos estuvieran calentitos..." },
            { personaje: "narrador", texto: "'O tus alumnos pagan esa factura aprendiendo sobre energía, o estás despedido.'" },
            { personaje: "profesor", texto: "Alumnos... ¡VOSOTROS vais a sacarme de esta! ¡VAIS A APRENDER ENERGÍA!" },
            { personaje: "narrador", texto: "Así comenzó la aventura más electrizante del Colegio Perú..." }
        ],
        nivel1Intro: [
            { personaje: "profesor", texto: "¡Se ha ido la luz en todo el Colegio Perú! Por culpa de mis estufas..." },
            { personaje: "profesor", texto: "Antes de arreglar nada, necesito que sepáis QUÉ TIPOS de energía existen." },
            { personaje: "profesor", texto: "Os voy a mostrar situaciones y me decís qué energía es. ¿Fácil, no?" },
            { personaje: "profesor", texto: "Si acertáis bastantes, la dire me deja quedarme una semana más..." }
        ],
        nivel2Intro: [
            { personaje: "profesor", texto: "Bien, ya sabéis los tipos de energía. Ahora viene lo importante..." },
            { personaje: "profesor", texto: "Hay que saber DE DÓNDE viene la electricidad del colegio." },
            { personaje: "profesor", texto: "¿Renovable o no renovable? ¡Si lo sabéis, podemos cambiar el contrato del cole!" },
            { personaje: "profesor", texto: "Clasificad bien o la dire me echa. Y vosotros os quedáis sin profe majo." }
        ],
        nivel3Intro: [
            { personaje: "profesor", texto: "La energía se TRANSFORMA. No aparece por arte de magia en los enchufes." },
            { personaje: "profesor", texto: "Química a térmica, térmica a mecánica, mecánica a eléctrica..." },
            { personaje: "profesor", texto: "Ordenad las cadenas de transformación. Si entendéis esto, medio aprobado!" },
            { personaje: "profesor", texto: "Y si no... os pongo a pedalear en una bici-generador para dar luz al cole." }
        ],
        nivel4Intro: [
            { personaje: "profesor", texto: "¡MIRAD la ciudad alrededor del Colegio Perú! ¡La contaminación nos ahoga!" },
            { personaje: "profesor", texto: "Ahora VOSOTROS vais a tomar las decisiones energéticas del barrio." },
            { personaje: "profesor", texto: "Hospital, fábrica, transporte... todo depende de lo que elijáis." },
            { personaje: "profesor", texto: "Si la contaminación llega al 100%... cierran el cole. Y a mí me echan SEGURO." }
        ],
        nivel5Intro: [
            { personaje: "profesor", texto: "¡ÚLTIMO NIVEL! ¡La factura de 47.000 euros del Colegio Perú!" },
            { personaje: "profesor", texto: "Cada pregunta que acertéis RESTA euros de la factura." },
            { personaje: "profesor", texto: "Tenéis 3 minutos. Todo lo que habéis aprendido, TODO, aquí y ahora." },
            { personaje: "profesor", texto: "Si llegáis a 0 euros... la dire me perdona. Y yo os perdono el examen. ¡QUIZÁS!" }
        ]
    },

    // ==================== DATOS MODO ESTUDIO ====================
    temasModoEstudio: [
        { id: 'formas', nombre: 'Formas de Energía', icono: 'lightning', color: '#3b82f6' },
        { id: 'fuentes', nombre: 'Fuentes de Energía', icono: 'solar', color: '#22c55e' },
        { id: 'transformaciones', nombre: 'Transformaciones', icono: 'chain', color: '#f59e0b' },
        { id: 'impacto', nombre: 'Impacto Ambiental', icono: 'pollution', color: '#ef4444' },
        { id: 'sostenible', nombre: 'Desarrollo Sostenible', icono: 'leaf', color: '#10b981' }
    ],

    // ==================== HELPERS ====================
    getPreguntasNivel: function(nivel) {
        switch(nivel) {
            case 1: return this.nivel1Preguntas;
            case 2: return this.nivel2Preguntas;
            case 3: return this.nivel3Preguntas;
            case 4: return this.nivel4Preguntas;
            case 5: return this.nivel5Preguntas;
            default: return this.nivel1Preguntas;
        }
    },

    getCadenasNivel: function(nivel) {
        if (nivel === 3) return this.cadenas.filter(c => c.dificultad <= 2);
        return this.cadenas;
    },

    getRandomFrase: function(categoria) {
        const frases = this.frases[categoria];
        if (!frases || frases.length === 0) return "";
        return frases[Math.floor(Math.random() * frases.length)];
    }
};

window.GAME_DATA = GAME_DATA;
