import { test } from "node:test";
import assert from "node:assert/strict";
import { rank } from "./match.js";
import { CAREERS, EMOJI } from "./data.js";

const map = (p = [], t = [], m = [], v = []) => ({ p, t, m, v });
const names = (d, k = 3) => rank(d, k).map((r) => r.career.nombre);

test("compus + juegos + programación → Informática primero", () => {
  assert.equal(names(map(["compus", "juegos"], [], [], ["programación"]))[0], "Informática y programación");
});
test("tolera errores de tipeo", () => {
  assert.equal(names(map(["computadra"], ["logica"]))[0], "Informática y programación");
});
test("cuidar + enfermero → Enfermería primero", () => {
  assert.equal(names(map(["cuidar a la gente"], ["enfermero"]))[0], "Enfermería");
});
test("tortas → Cocina regional, pastelería y panadería primero", () => {
  assert.equal(names(map(["tortas", "cocinar"]))[0], "Cocina regional, pastelería y panadería");
});
test("motos aparece entre los 3 primeros", () => {
  assert.ok(names(map(["motos"], ["arreglar objetos"])).includes("Mecánica de motos y automotores"));
});
test("sin coincidencias devuelve lista vacía", () => {
  assert.deepEqual(names(map(["xyzqw"])), []);
});
test("una sola palabra débil no alcanza el mínimo", () => {
  assert.deepEqual(names(map(["musica"])), []);
  assert.deepEqual(names(map(["futbol"])), []);
});
test("raíces parecidas no son falsos positivos", () => {
  // "progreso" no debe matchear con "programar" (Informática).
  assert.deepEqual(names(map(["progreso"], ["organizar"])), []);
});
test("variantes de la misma raíz sí matchean", () => {
  assert.equal(names(map(["computador"], ["logica"]))[0], "Informática y programación");
});
test("pide hasta 6 opciones sin repetir", () => {
  const r = names(map(["videojuegos", "tecnología", "arreglar objetos", "redes", "dibujar", "computadora"], [], ["conectividad"]), 6);
  assert.equal(new Set(r).size, r.length);
  assert.ok(r.length > 3);
});
test("todas las áreas tienen datos completos", () => {
  for (const c of CAREERS) {
    assert.ok(c.nombre && c.tipo && c.donde, c.nombre);
    assert.ok(EMOJI[c.nombre], `${c.nombre}: falta ícono`);
    assert.ok(c.claves.length >= 3, `${c.nombre}: pocas palabras clave`);
  }
});

// --- Jerga de chicos, coincidencia débil y feedback ---
import { isWeak, unmatched } from "./match.js";

test("jerga de redes: tiktok + streamer → Comunicación o Marketing", () => {
  const r = names(map(["tiktok", "streamer"], ["editar videos"], [], ["contenido"]), 2);
  assert.ok(r.includes("Comunicación y edición"));
  assert.ok(r.includes("Marketing digital para emprendedores"));
});
test("cripto + trading → Administración y economía primero", () => {
  assert.equal(names(map(["cripto", "trading"], ["calcular"], ["desempleo"], ["inversiones"]))[0], "Administración, contabilidad y economía");
});
test("plural simple: 'los perros' matchea animal", () => {
  assert.equal(names(map(["los perros", "caballos"], ["cuidar"], ["salud rural"], ["veterinaria"]))[0], "Agro y producción agropecuaria");
});
test("gerundios y oficios: entrenando + entrenador → Deporte", () => {
  assert.equal(names(map(["gym", "futbol"], ["entrenando"], [], ["entrenador"]))[0], "Deporte y educación física");
});
test("coincidencia baja: puntaje < 4 se marca débil", () => {
  assert.equal(isWeak(2), true);
  assert.equal(isWeak(4), false);
  const r = rank(map(["series", "anime"], ["dibujar"]), 6);
  assert.ok(r.some((x) => isWeak(x.score)), "debería haber al menos una débil");
});
test("unmatched devuelve solo las palabras sin ninguna coincidencia", () => {
  assert.deepEqual(unmatched(map(["asdf", "tiktok"], ["qwerty"])), ["asdf", "qwerty"]);
});
test("las carreras con 👎 se excluyen del ranking", () => {
  const d = map(["compus", "juegos"], [], [], ["programación"]);
  assert.equal(names(d)[0], "Informática y programación");
  const sin = rank(d, 3, { "Informática y programación": -1 }).map((r) => r.career.nombre);
  assert.ok(!sin.includes("Informática y programación"));
  const con = rank(d, 3, { "Informática y programación": 1 }).map((r) => r.career.nombre);
  assert.ok(con.includes("Informática y programación"));
});
