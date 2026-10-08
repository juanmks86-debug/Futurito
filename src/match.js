import { QUADRANTS, CAREERS } from "./data.js";

const STOP = new Set("de la el los las un una y o que con para por en me mi se lo al del a es muy mas como".split(" "));
// Sinónimos y jerga habitual -> palabra clave que usan las carreras (agregar los que vayan apareciendo).
const SYN = {
  compu: "computadora", computadoras: "computadora", pc: "computadora", notebook: "computadora", compus: "computadora",
  celular: "app", celu: "app", apps: "app", jugar: "videojuego", juegos: "videojuego", gamer: "videojuego", gaming: "videojuego",
  codigo: "programar", programacion: "programar", sistemas: "programar", wifi: "internet", red: "redes", starlink: "internet",
  plata: "dinero", ventas: "vender", venta: "vender", negocios: "negocio", cocina: "cocinar", chicos: "ninos", ninas: "ninos",
  maestra: "ensenar", maestro: "ensenar", profe: "ensenar", dibujo: "dibujar", pintar: "dibujar", fotos: "foto", fotografia: "foto",
  mascotas: "animal", animales: "animal", perros: "animal", plantas: "planta", huerta: "cultivo", basura: "residuo",
  ejercicio: "deporte", deportes: "deporte", pelota: "futbol", gente: "personas", enfermero: "enfermeria", doctor: "medicina",
  medico: "medicina", pan: "panaderia", tortas: "pasteleria", torta: "pasteleria", soldar: "soldadura", caminatas: "senderismo", trekking: "senderismo",
  autos: "mecanica", auto: "mecanica", moto: "motos", heladera: "refrigeracion", heladeras: "refrigeracion", ropa: "costura", coser: "costura", celulares: "celular", numeros: "numero", mates: "matematica", leyes: "ley", abogado: "derecho", turistas: "turismo",
  // --- Jerga y temas habituales de chicos (octubre 2026). Valor: palabra clave de la oferta o lista de ellas. ---
  // Redes, contenido y medios
  tiktok: ["contenido", "video"], reels: ["contenido", "video"], youtube: ["contenido", "video"], youtuber: ["contenido", "video"],
  streamer: ["contenido", "video", "videojuego"], streaming: ["contenido", "video"], influencer: ["contenido", "marketing"],
  videos: "video", series: ["video", "historia"], peliculas: "video", cine: "video", netflix: "video", edicion: "editar",
  periodista: "periodismo", fotografo: "foto", canva: ["disenar", "contenido"], photoshop: ["disenar", "foto"], diseno: "disenar", disenador: "disenar",
  // Juegos y tecnología
  minecraft: "videojuego", fortnite: "videojuego", roblox: "videojuego", fifa: "videojuego", free: "videojuego", consola: "videojuego",
  ia: "inteligencia", chatgpt: "inteligencia", robots: "robot", drones: "drone", hacker: ["computadora", "programar"],
  hackear: ["computadora", "programar"], ciberseguridad: ["seguridad", "computadora"], computacion: "computadora", informatica: "computadora",
  // Plata y negocios
  cripto: ["dinero", "datos"], bitcoin: ["dinero", "datos"], trading: ["dinero", "numero"], inversiones: "dinero", ahorrar: "dinero", economia: "dinero",
  tienda: ["vender", "negocio"], ecommerce: ["vender", "internet"], online: "internet", freelance: "emprender", emprendedor: "emprender", emprendimiento: "emprender",
  contador: "contabilidad", contadora: "contabilidad", calculo: "calcular", ordenar: "organizar", planificar: "organizar", 
  // Arte, música y cuerpo
  anime: ["dibujar", "historia"], manga: ["dibujar", "historia"], dibujitos: "dibujar", manualidades: ["creativo", "arte"], inventar: "creativo",
  cantar: "musica", canto: "musica", cantante: "musica", guitarra: "musica", instrumento: "musica", banda: "musica", tocar: "musica",
  bailar: ["arte", "movimiento"], baile: ["arte", "movimiento"], danza: ["arte", "movimiento"], actor: "actuar", actriz: "actuar", escritor: "escribir",
  maquillaje: ["arte", "moda"], gym: "gimnasio", crossfit: "gimnasio", running: "correr", basquet: "deporte", voley: "deporte",
  handball: "deporte", rugby: "deporte", hockey: "deporte", entrenador: "entrenar",
  // Gerundios y oficios frecuentes
  ayudando: "ayudar", cocinando: "cocinar", jugando: "videojuego", dibujando: "dibujar", programando: "programar", cantando: "musica",
  bailando: "movimiento", ensenando: "ensenar", leyendo: "leer", escribiendo: "escribir", arreglando: "arreglar", reparando: "reparar",
  viajando: "viajar", cuidando: "cuidar", vendiendo: "vender", entrenando: "entrenar", explicando: "explicar", organizando: "organizar",
  construyendo: "construir", cocinero: "cocinar", cocinera: "cocinar", mecanico: "mecanica", electricista: "electricidad", docente: "ensenar",
  profesor: "ensenar", profesora: "ensenar", psicologo: "psicologia", psicologa: "psicologia", abogada: "derecho", enfermera: "enfermeria",
  medica: "medicina", dentista: "odontologia", dientes: "diente", farmaceutico: "farmacia", veterinario: "animal", veterinaria: "animal",
  arquitecto: ["construir", "planos"], arquitectura: ["construir", "planos"], carpintero: "construir", carpinteria: "construir", madera: "construir",
  albanil: ["construir", "obra"], albanileria: ["construir", "obra"], plomeria: ["instalar", "construir"], armar: ["construir", "arreglar"], desarmar: "arreglar",
  policia: "seguridad", bombero: ["seguridad", "primeros"], camiones: "camion", manejar: "transporte", conducir: "transporte",
  // Naturaleza y campo
  caminar: "senderismo", acampar: ["aventura", "naturaleza"], camping: ["aventura", "naturaleza"], escalar: "aventura", pescar: "naturaleza",
  caballos: ["animal", "campo"], ganaderia: ["animal", "campo"], chacra: "cultivo", jardin: ["planta", "cultivo"], jardineria: ["planta", "cultivo"],
  lugares: "turismo", experimentos: "experimento", ciencias: "ciencia", idiomas: "idioma", inyecciones: "enfermeria", consejos: ["escuchar", "ayudar"],
  // Problemas del barrio (Misión)
  desempleo: "empleo", laburo: "empleo", pobreza: ["social", "comunidad"], drogas: ["prevencion", "comunidad"], adicciones: ["prevencion", "comunidad"],
  violencia: ["seguridad", "comunidad"], bullying: ["prevencion", "escuchar"], mental: "emocion", abuelos: "cuidar", ancianos: "cuidar", educacion: "escuela",
  tradiciones: "tradicion", rutas: "transporte", calles: "transporte", luz: "energia", ruralidad: "rural",
};
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ");
// Raíz de 6 letras (solo en palabras de 7+): mantiene variantes juntas
// ("computadora"/"computador") pero evita falsos positivos tipo "progreso" vs "programar".
const stem = (w) => (w.length >= 7 ? w.slice(0, 6) : w);
// Plural simple: "perros" también se prueba como "perro" (solo palabras de 5+ letras, sin "ss").
const singular = (w) => (w.length >= 5 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : null);
const expand = (w) => {
  const forms = [w];
  const sg = singular(w);
  if (sg) forms.push(sg);
  [].concat(SYN[w] || [], sg && SYN[sg] ? SYN[sg] : []).forEach((x) => forms.push(x));
  return [...new Set(forms)].map((f) => ({ s: stem(f), f }));
};
const toks = (s) => norm(s).split(/\s+/).filter((w) => w.length >= 2 && !STOP.has(w)).flatMap(expand);

// Distancia de edición (tolera errores de tipeo de 1 letra en palabras completas de 6+).
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
// Orden de pruebas: palabra completa > raíz compartida > typo de 1 letra.
const same = (x, k) =>
  x.f === k.f ||
  x.s === k.s ||
  (x.f.length >= 6 && k.f.length >= 6 && lev(x.f, k.f) <= 1);

// Una carrera entra solo con puntaje mínimo: evita que una palabra suelta y débil
// ("musica") llene los resultados con propuestas sin sustento.
const MIN_SCORE = 2;

// Elige 3 resultados bajando el puntaje de los que repiten palabras ya explicadas por otro elegido.
function diversify(pool, k) {
  const words = (r) => new Set(Object.values(r.hit).flat());
  const out = [];
  while (out.length < k && pool.length) {
    const best = pool
      .map((r) => ({ r, s: r.score * Math.pow(0.6, out.filter((o) => [...words(o)].some((w) => words(r).has(w))).length) }))
      .sort((a, b) => b.s - a.s)[0];
    out.push(best.r);
    pool = pool.filter((r) => r !== best.r);
  }
  return out;
}

const keysOf = (career) => career.claves.map((k) => { const f = norm(k).trim(); return { s: stem(f), f }; });
const buildEntries = (data) => {
  const entries = {};
  QUADRANTS.forEach((q) => (entries[q.id] = (data[q.id] || []).map((w) => ({ w, t: toks(w) }))));
  return entries;
};
const hits = (e, keys) => e.t.some((x) => keys.some((k) => same(x, k)));

// Puntaje por debajo de este valor = coincidencia baja (se avisa en pantalla).
export const WEAK_SCORE = 4;
export const isWeak = (score) => score < WEAK_SCORE;

// Devuelve las k carreras con más coincidencias (+2 por cada cuadrante extra cubierto),
// filtrando las que no alcanzan el puntaje mínimo y las que la persona marcó con 👎 (fb[nombre] === -1).
export function rank(data, k = 3, fb = {}) {
  const entries = buildEntries(data);
  const all = CAREERS.filter((c) => fb[c.nombre] !== -1)
    .map((career) => {
      const keys = keysOf(career);
      const hit = {};
      let n = 0;
      QUADRANTS.forEach((q) =>
        entries[q.id].forEach((e) => {
          if (hits(e, keys)) {
            (hit[q.id] = hit[q.id] || []).push(e.w);
            n += q.w;
          }
        })
      );
      const cov = Object.keys(hit).length;
      return { career, hit, score: n + (cov > 1 ? 2 * (cov - 1) : 0) };
    })
    .filter((r) => r.score >= MIN_SCORE);
  return diversify(all, k);
}

// Palabras escritas que no coinciden con ninguna carrera (sirve para avisar y para ampliar SYN con casos reales).
export function unmatched(data) {
  const entries = buildEntries(data);
  const allKeys = CAREERS.map(keysOf);
  const out = [];
  QUADRANTS.forEach((q) =>
    entries[q.id].forEach((e) => {
      if (!allKeys.some((keys) => hits(e, keys)) && !out.includes(e.w)) out.push(e.w);
    })
  );
  return out;
}
