# Mi mapa de Ikigai (React + Vite)

    npm install
    npm run dev      # desarrollo
    npm run build    # genera dist/ (listo para Vercel)

Para verificar la búsqueda: `npm test`. Datos prácticos opcionales por área en `INFO` (src/data.js).

La lista de carreras está en `src/data.js` (oferta de Jujuy agrupada por áreas).
La lógica de coincidencias está en `src/match.js`.

## Cambios (octubre 2026)

- `match.js`: stem de 6 letras (evita falsos positivos tipo "progreso"/"programar"); umbral mínimo de puntaje (2) para mostrar una carrera.
- `App.jsx`: para ver caminos ahora se exige al menos 1 palabra por cuadrante; validación de datos guardados en localStorage (clave `ikigai-v2`); limpieza de la nota "camino" si cambian los resultados; chips sin duplicados por mayúsculas; `aria-live` en resultados.
- `match.test.js`: 11 tests (agregados umbral mínimo, falsos positivos de raíz, variantes de raíz).
