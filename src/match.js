import { QUADRANTS, CAREERS } from "./data.js";

const STOP = new Set("de la el los las un una y o que con para por en me mi se lo al del a es muy mas como".split(" "));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ");
const stem = (w) => (w.length >= 6 ? w.slice(0, 5) : w);
const toks = (s) => norm(s).split(/\s+/).filter((w) => w.length >= 3 && !STOP.has(w));

// Devuelve las 3 carreras con más coincidencias (+2 por cada cuadrante extra cubierto).
export function rank(data) {
  const entries = {};
  QUADRANTS.forEach((q) => (entries[q.id] = data[q.id].map((w) => ({ w, t: toks(w).map(stem) }))));
  return CAREERS.map((career) => {
    const keys = career.claves.map((k) => stem(norm(k).trim()));
    const hit = {};
    let n = 0;
    QUADRANTS.forEach((q) =>
      entries[q.id].forEach((e) => {
        if (keys.some((k) => e.t.includes(k))) {
          (hit[q.id] = hit[q.id] || []).push(e.w);
          n++;
        }
      })
    );
    const cov = Object.keys(hit).length;
    return { career, hit, score: n + (cov > 1 ? 2 * (cov - 1) : 0) };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
