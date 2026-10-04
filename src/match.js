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
};
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ");
// Raíz de 6 letras (solo en palabras de 7+): mantiene variantes juntas
// ("computadora"/"computador") pero evita falsos positivos tipo "progreso" vs "programar".
const stem = (w) => (w.length >= 7 ? w.slice(0, 6) : w);
const expand = (w) => (SYN[w] ? [{ s: stem(w), f: w }, { s: stem(SYN[w]), f: SYN[w] }] : [{ s: stem(w), f: w }]);
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

// Devuelve las k carreras con más coincidencias (+2 por cada cuadrante extra cubierto),
// filtrando las que no alcanzan el puntaje mínimo.
export function rank(data, k = 3) {
  const entries = {};
  QUADRANTS.forEach((q) => (entries[q.id] = data[q.id].map((w) => ({ w, t: toks(w) }))));
  const all = CAREERS.map((career) => {
    const keys = career.claves.map((k) => { const f = norm(k).trim(); return { s: stem(f), f }; });
    const hit = {};
    let n = 0;
    QUADRANTS.forEach((q) =>
      entries[q.id].forEach((e) => {
        if (e.t.some((x) => keys.some((k) => same(x, k)))) {
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
