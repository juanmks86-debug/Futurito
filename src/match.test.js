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
  assert.equal(names(map(["computadra"]))[0], "Informática y programación");
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
test("pide hasta 6 opciones sin repetir", () => {
  const r = names(map(["videojuegos", "tecnología", "arreglar objetos", "redes"], [], ["conectividad"]), 6);
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
