// Cuadrantes del mapa de Ikigai
const BASE = [
 {id:"p",t:"Lo que amo",s:"Pasión: ¿qué temas o tecnologías te apasionan?",k:"var(--c1)"},
 {id:"t",t:"En lo que soy bueno",s:"Talento: ¿cuáles son tus habilidades naturales?",k:"var(--c2)"},
 {id:"m",t:"Lo que Jujuy necesita",s:"Misión: ¿qué desafío de tu localidad querés resolver?",k:"var(--c3)"},
 {id:"v",t:"Mi modelo de valor",s:"Viabilidad: ¿por qué solución pagarían o invertirían en vos?",k:"var(--c4)"}];

// Oferta de Jujuy, agrupada por áreas. Fuente: listado aportado por el autor; confirmar cupos y requisitos en cada institución.
// [área, carreras, palabras clave (separadas por espacio, sin tildes), dónde estudiarla]
const RAW = [
["Informática y programación","Ingeniería Informática, Licenciatura en Sistemas, Analista Programador Universitario, Tecnicatura Superior en Desarrollo de Software","computadora programar videojuego internet tecnologia app logica software pagina web codigo algoritmo conectividad","UNJu · Facultad de Ingeniería; IES (Tecnicatura Superior)"],
["Ciencia de datos e IA","Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial","datos numero estadistica inteligencia matematica grafico prediccion analisis excel python","IES (Tecnicatura Superior)"],
["Videojuegos y diseño digital","Tecnicatura Universitaria en Diseño Integral de Videojuegos","videojuego juego disenar 3d arte creativo dibujar modelado historia","UNJu · Facultad de Ingeniería"],
["Soporte, redes e infraestructura TI","Tecnicatura Superior en Soporte de Infraestructura de TI","redes internet computadora reparar instalar servidor soporte hardware wifi camaras","IES (Tecnicatura Superior)"],
["Robótica, automatización y mecatrónica","Tecnicaturas Superiores en Automatización y Robótica y en Mecatrónica","robot automatizar mecanica electronica circuito drone arduino motor placa arreglar electricidad","IES (Tecnicaturas Superiores)"],
["Ingeniería civil e industrial","Ingeniería Civil, Ingeniería Industrial","construir obra casa edificio planos autocad maquina produccion fabrica industria calcular puente","UNJu · Facultad de Ingeniería"],
["Minería, geología y energías","Ingeniería de Minas, Licenciatura en Ciencias Geológicas, Tecnicatura Universitaria en Perforaciones, Tecnicatura Superior en Gestión de Energías Renovables","mineria litio geologia piedra minerales perforar energia solar renovable","UNJu · Facultad de Ingeniería; IES (Tecnicatura Superior)"],
["Química y alimentos","Ingeniería Química, Licenciaturas en Tecnología de los Alimentos y en Bromatología, Tecnicatura Superior en Química Agroindustrial","quimica laboratorio alimento comida experimento calidad sabor industria","UNJu · Facultades de Ingeniería y de Ciencias Agrarias; IES (Tecnicatura Superior)"],
["Agro y producción agropecuaria","Ingeniería Agronómica, Licenciatura en Desarrollo Rural, Tecnicaturas en Producción de Animales de Granja, Mecanización Agrícola, Transformación de la Producción Agropecuaria y Forestal, Tecnicatura Superior en Gestión de la Producción Agropecuaria","campo cultivo animal planta huerta agricultura tractor granja rural bosque","UNJu · Facultad de Ciencias Agrarias; IES (Tecnicatura Superior)"],
["Ambiente y biología","Licenciaturas en Gestión Ambiental y en Ciencias Biológicas, Tecnicatura Superior en Gestión e Impacto Ambiental, Profesorado de Biología","ambiente naturaleza agua residuo reciclar biologia animal ecologia contaminacion clima","UNJu · Facultad de Ciencias Agrarias; IES (Tecnicatura y profesorado)"],
["Medicina","Medicina","medicina salud hospital paciente curar cuerpo biologia diagnostico cirugia","UNJu · Escuela de Ciencias de la Salud"],
["Enfermería","Enfermería Universitaria, Tecnicatura Superior en Enfermería","cuidar enfermeria salud ayudar hospital paciente primeros auxilios bienestar","UNJu · Escuela de Ciencias de la Salud; IES (Tecnicatura Superior)"],
["Laboratorio, farmacia y odontología","Tecnicaturas Superiores en Laboratorio de Análisis Clínicos, Farmacia, Hemoterapia y Asistencia Odontológica","laboratorio farmacia analisis muestras microscopio quimica diente odontologia sangre","IES (Tecnicaturas Superiores)"],
["Salud pública y acompañamiento","Licenciatura y Profesorado en Educación para la Salud, Tecnicaturas Superiores en Agente Sanitario y Promotor de la Salud, Acompañamiento Terapéutico y Administración de Servicios de Salud","prevencion salud comunidad acompanar ayudar escuchar promover charlas bienestar","UNJu · Facultad de Humanidades y Ciencias Sociales; IES (Tecnicaturas Superiores)"],
["Educación inicial, primaria y especial","Profesorados de Educación Inicial, Primaria (con orientaciones) y Especial; Ciencias de la Educación","ninos ensenar explicar paciencia escuela cuentos inclusion discapacidad ayudar apoyo clases","IES (Profesorados); UNJu · Facultad de Humanidades y Ciencias Sociales"],
["Profesorados de ciencias exactas y tecnología","Profesorados de Matemática, Física, Química, Biología, Informática/TICs y Educación Tecnológica","ensenar explicar matematica fisica quimica biologia numero ciencia clases jovenes tecnologia","IES (Profesorados de Educación Secundaria)"],
["Humanidades y lenguas","Profesorados y licenciaturas en Letras, Historia, Geografía, Filosofía, Sociología, Psicología, Inglés, Francés, Portugués y Ciencias Sagradas","leer escribir libro historia idioma ingles portugues frances ensenar filosofia literatura geografia lengua","IES (Profesorados); UNJu · Facultad de Humanidades y Ciencias Sociales"],
["Psicología, trabajo social y familia","Licenciatura en Trabajo Social, Tecnicatura Superior en Niñez, Adolescencia y Familia","escuchar personas emocion comunidad ayudar conversar jovenes familia social psicologia","UNJu · Facultad de Humanidades y Ciencias Sociales; IES (Tecnicatura Superior)"],
["Antropología, historia y cultura","Licenciaturas en Antropología e Historia, Tecnicaturas Superiores en Museología y Gestión Socio Cultural","cultura historia museo tradicion pueblos arqueologia patrimonio investigar comunidad","UNJu · Facultad de Humanidades y Ciencias Sociales; IES (Tecnicaturas Superiores)"],
["Comunicación y edición","Licenciaturas en Comunicación Social, Comunicación Digital Convergente y Gestión y Producción Editorial","video foto redes contenido periodismo radio escribir editar medios entrevistar comunicar libro musica","UNJu · Facultad de Humanidades y Ciencias Sociales"],
["Arte y expresión","Profesorados de Teatro y de Artes Visuales (Cerámica, Escultura, Pintura, Grabado)","arte dibujar pintar teatro actuar escultura ceramica musica creativo escenario","IES (Profesorados de Lenguas y Artes)"],
["Deporte y educación física","Profesorado de Educación Física (Tiempo Libre y Recreación), Tecnicatura Superior en Entrenamiento Deportivo","deporte entrenar cuerpo futbol movimiento recreacion gimnasio correr ejercicio","IES (Profesorado y Tecnicatura Superior)"],
["Administración, contabilidad y economía","Contador Público, Licenciaturas en Administración y en Economía Política, Tecnicaturas Superiores en Administración de Empresas (PyMEs / RR. HH.) y Comercialización, Profesorados de Economía y Ciencias de la Administración","vender negocio emprender organizar dinero liderar comercio marketing cuentas stock contabilidad impuestos empresa numero","UNJu · Facultad de Ciencias Económicas; IES (Tecnicaturas y profesorados)"],
["Logística, mantenimiento y seguridad industrial","Tecnicaturas Superiores en Logística Empresarial, Mantenimiento Industrial e Higiene y Seguridad en el Trabajo","logistica transporte camion almacen mantenimiento seguridad industria maquina prevenir riesgo stock","IES (Tecnicaturas Superiores)"],
["Turismo, hotelería y gastronomía","Licenciatura en Turismo, Tecnicaturas Superiores en Turismo, Hotelería y Cocinas Regionales y Cultura Alimentaria","turismo viajar hotel cocinar comida guia cultura tradicion cocina gastronomia turistas atender","UNJu · Facultad de Humanidades y Ciencias Sociales; IES (Tecnicaturas Superiores)"],
["Derecho, política y gestión pública","Abogacía, Licenciatura y Profesorado en Ciencia Política, Tecnicaturas Superiores en Administración Pública y Gestión Jurídica","justicia ley debatir politica derecho defender gobierno leyes publico tramites ciudadania argumentar","UNJu · Escuela Superior de Ciencias Jurídicas y Políticas; IES (Tecnicaturas y profesorado)"],
["Reparación de PC y celulares","Curso de formación profesional: Reparación de PC y dispositivos móviles","reparar arreglar computadora celular hardware tecnico electronica pantalla bateria","Instituto de capacitación (oferta provincial)",true],
["Redes y cámaras de seguridad (oficio)","Curso de formación profesional: Instalación de redes y cámaras de seguridad","redes camaras instalar seguridad wifi internet cableado vigilancia","Instituto de capacitación (oferta provincial)",true],
["Marketing digital para emprendedores","Curso de formación profesional: Marketing digital y gestión de redes para emprendedores","marketing redes contenido vender emprender instagram publicidad negocio foto video","Instituto de capacitación (oferta provincial)",true],
["Electricidad domiciliaria e industrial","Curso de formación profesional: Electricidad domiciliaria e industrial","electricidad instalar arreglar cables luz circuito industrial","Instituto de capacitación (oferta provincial)",true],
["Refrigeración y aire acondicionado","Curso de formación profesional: Refrigeración y aire acondicionado","refrigeracion aire acondicionado heladera frio clima arreglar instalar","Instituto de capacitación (oferta provincial)",true],
["Mecánica de motos y automotores","Curso de formación profesional: Mecánica de motos y automotores","mecanica motos autos motor arreglar taller vehiculos","Instituto de capacitación (oferta provincial)",true],
["Durlock y soldadura","Cursos de formación profesional: Durlock y Soldadura","durlock soldadura construir obra casa metal herreria","Instituto de capacitación (oferta provincial)",true],
["Cocina regional, pastelería y panadería","Cursos de formación profesional: Cocina regional, Pastelería y Panadería","cocinar cocina pasteleria panaderia torta pan comida postres regional","Instituto de capacitación (oferta provincial)",true],
["Turismo local: baqueano y senderismo","Cursos de formación profesional: Emprendimientos turísticos, Baqueano local y Senderismo","turismo baqueano senderismo guia caminata montana naturaleza aventura emprender","Instituto de capacitación (oferta provincial)",true],
["Corte y confección / textil","Curso de formación profesional: Corte y confección / Textil","coser costura ropa disenar textil moda tejer confeccion","Instituto de capacitación (oferta provincial)",true],
];

const PASOS = [
  "Mirá el plan de estudios y los requisitos de ingreso de las carreras de esta área.",
  "Hablá con alguien que ejerza esta profesión y preguntale cómo es su día a día.",
  "Probá un curso corto, una clase abierta o un proyecto chico del tema para ver si te gusta de cerca.",
];

// Palabras de problemas locales (Misión) y de salida laboral (Valor) por área.
const EXTRA = {
  "Ambiente y biología": "basural contaminado rios sustentable",
  "Turismo, hotelería y gastronomía": "visitantes artesanias",
  "Minería, geología y energías": "puna salares",
  "Salud pública y acompañamiento": "rural",
  "Soporte, redes e infraestructura TI": "conectividad",
  "Agro y producción agropecuaria": "sequia riego produccion",
  "Administración, contabilidad y economía": "empleo emprendimiento pymes",
  "Logística, mantenimiento y seguridad industrial": "empleo",
  "Derecho, política y gestión pública": "seguridad derechos",
};

// Datos prácticos opcionales por área (se muestran en los resultados cuando existen). Ejemplo:
// "Enfermería": { duracion: "3 años", modalidad: "Presencial", ingreso: "Secundario completo", becas: "Consultar" }
const INFO = {};

// Fecha de carga de la oferta (se muestra en los resultados).
export const OFERTA_FECHA = "octubre de 2026";

const PASOS_FP = [
  "Averiguá fechas de inscripción, duración y requisitos del curso.",
  "Hablá con alguien que trabaje de este oficio y preguntale cómo empezó.",
  "Probá hacer un trabajo chico del oficio para ver si te gusta de cerca.",
];

export const CAREERS = RAW.map(([nombre, tipo, claves, donde, fp]) => ({ nombre, tipo, fp, info: INFO[nombre], claves: (claves + " " + (EXTRA[nombre] || "")).trim().split(/\s+/), pasos: fp ? PASOS_FP : PASOS, donde }));

// Ayudas para quien no sabe qué escribir.
const EJ = {
  p: ["videojuegos", "animales", "cocinar", "música", "deporte", "tecnología", "ayudar a otros", "dibujar"],
  t: ["explicar cosas", "arreglar objetos", "organizar", "escuchar", "dibujar", "hablar en público", "matemática", "liderar"],
  m: ["falta de empleo joven", "residuos", "turismo", "conectividad", "salud rural", "minería", "cuidado del agua", "seguridad"],
  v: ["reparar cosas", "clases particulares", "vender productos", "hacer páginas web", "cuidar personas", "arte por encargo", "comida casera", "fotos y videos"],
};
const PREG = {
  p: "¿Qué hacés cuando nadie te obliga?",
  t: "¿Qué te piden siempre tus amigos o tu familia?",
  m: "¿Qué te molesta o te gustaría arreglar en tu barrio?",
  v: "¿Qué servicio pagaría alguien de tu zona?",
};
// w: peso en el puntaje (Misión y Valor cuentan más que gustos y habilidades).
export const QUADRANTS = BASE.map((q) => ({ ...q, ej: EJ[q.id], pregunta: PREG[q.id], w: { p: 1, t: 1, m: 1.5, v: 1.5 }[q.id] }));

// Ícono por área (emoji: simple y cercano, aunque se ve distinto según el celular).
export const EMOJI = {
  "Informática y programación": "💻", "Ciencia de datos e IA": "📊", "Videojuegos y diseño digital": "🎮",
  "Soporte, redes e infraestructura TI": "🛜", "Robótica, automatización y mecatrónica": "🤖", "Ingeniería civil e industrial": "🏗️",
  "Minería, geología y energías": "⛏️", "Química y alimentos": "🧪", "Agro y producción agropecuaria": "🌾",
  "Ambiente y biología": "🌿", "Medicina": "🩺", "Enfermería": "💉", "Laboratorio, farmacia y odontología": "🔬",
  "Salud pública y acompañamiento": "🤝", "Educación inicial, primaria y especial": "🍎", "Profesorados de ciencias exactas y tecnología": "📐",
  "Humanidades y lenguas": "📚", "Psicología, trabajo social y familia": "🧠", "Antropología, historia y cultura": "🏺",
  "Comunicación y edición": "🎙️", "Arte y expresión": "🎨", "Deporte y educación física": "⚽",
  "Administración, contabilidad y economía": "📈", "Logística, mantenimiento y seguridad industrial": "🚚",
  "Turismo, hotelería y gastronomía": "🧳", "Derecho, política y gestión pública": "⚖️",
  "Reparación de PC y celulares": "🔧", "Redes y cámaras de seguridad (oficio)": "📹", "Marketing digital para emprendedores": "📣",
  "Electricidad domiciliaria e industrial": "⚡", "Refrigeración y aire acondicionado": "❄️", "Mecánica de motos y automotores": "🏍️",
  "Durlock y soldadura": "🧱", "Cocina regional, pastelería y panadería": "🥖", "Turismo local: baqueano y senderismo": "🥾",
  "Corte y confección / textil": "🧵",
};
