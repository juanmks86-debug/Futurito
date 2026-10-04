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
