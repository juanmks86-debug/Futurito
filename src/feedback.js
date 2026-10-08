import { QUADRANTS } from "./data.js";

// Arma un texto simple con el feedback (👍/👎), el mapa y las palabras sin coincidencia.
// Se comparte solo si la persona toca "Enviar mi feedback"; nada se envía solo.
export function buildFeedbackText({ data, fb, sinMatch = [], fecha = new Date() }) {
  const dia = fecha.toISOString().slice(0, 10);
  const votos = Object.entries(fb).map(([nombre, v]) => `${v === 1 ? "👍" : "👎"} ${nombre}`);
  const mapa = QUADRANTS.map((q) => `${q.t}: ${(data[q.id] || []).join(", ") || "-"}`);
  return [
    `Feedback Mapa de Ikigai · ${dia}`,
    "",
    "Votos:",
    ...(votos.length ? votos : ["(sin votos)"]),
    "",
    `Palabras sin coincidencia: ${sinMatch.length ? sinMatch.join(", ") : "-"}`,
    "",
    "Mi mapa:",
    ...mapa,
  ].join("\n");
}
