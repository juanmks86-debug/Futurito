import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFeedbackText } from "./feedback.js";

test("el texto de feedback incluye votos, palabras sin coincidencia y el mapa", () => {
  const t = buildFeedbackText({
    data: { p: ["tiktok"], t: [], m: ["residuos"], v: [] },
    fb: { "Enfermería": 1, "Medicina": -1 },
    sinMatch: ["asdf"],
    fecha: new Date("2026-10-08T12:00:00Z"),
  });
  assert.match(t, /2026-10-08/);
  assert.match(t, /👍 Enfermería/);
  assert.match(t, /👎 Medicina/);
  assert.match(t, /Palabras sin coincidencia: asdf/);
  assert.match(t, /Lo que amo: tiktok/);
  assert.match(t, /Lo que Jujuy necesita: residuos/);
});
test("sin votos ni palabras sueltas, igual arma un texto legible", () => {
  const t = buildFeedbackText({ data: { p: [], t: [], m: [], v: [] }, fb: {} });
  assert.match(t, /\(sin votos\)/);
  assert.match(t, /Palabras sin coincidencia: -/);
});
