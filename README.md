# Mi mapa de Ikigai (React + Vite)

Página para que chicos que egresan de la secundaria completen su mapa de Ikigai y vean caminos para explorar (carreras, tecnicaturas y oficios de Jujuy).
Creado por Flores Juan Israel.

    npm install
    npm run dev      # desarrollo
    npm test         # tests de la búsqueda y del feedback
    npm run build    # genera dist/ (listo para Vercel)

El CI de GitHub (`.github/workflows/ci.yml`) corre `npm test` y `npm run build` en cada push y pull request.

## Estructura

- `src/data.js`: oferta de Jujuy agrupada por áreas (nombre, carreras, palabras clave, dónde estudiarla) y datos de los cuadrantes.
- `src/match.js`: lógica de coincidencias (palabras clave, raíz de 6 letras, plural simple, errores de tipeo y sinónimos en `SYN`).
- `src/feedback.js`: arma el texto de feedback que la persona puede enviar.
- `src/App.jsx`: pantallas (inicio, mapa, resultados).

## Cómo funciona la búsqueda

- Una carrera aparece solo con puntaje mínimo 2. Si el puntaje es menor a 4 se marca **"Coincidencia baja: agregá más palabras"**.
- Si todos los resultados son débiles se muestra un aviso general.
- Las palabras que no coinciden con ninguna carrera se muestran en pantalla y se incluyen en el feedback.
- Las carreras marcadas con 👎 se ocultan la próxima vez que se abre la pantalla de resultados (con opción "Mostrar de nuevo").

## Mejorar los sinónimos con casos reales

1. Pedile a 5 o 6 chicos que completen el mapa y toquen **"Enviar mi feedback"** (se comparte por WhatsApp u otra app, solo si ellos lo envían).
2. Mirá la línea "Palabras sin coincidencia" de cada feedback.
3. Agregá esas palabras en `SYN` de `src/match.js`, apuntando a una palabra clave de `src/data.js` (o a una lista de ellas).
4. Sumá un test en `src/match.test.js`.

## Datos prácticos (`INFO`)

`INFO` en `src/data.js` está **vacío a propósito**: duración, modalidad, ingreso y becas cambian por institución y año, y no se cargan sin verificarlos. Cuando existan, la pantalla de resultados y el detalle los muestran solos. Formato:

    "Enfermería": { duracion: "3 años", modalidad: "Presencial", ingreso: "Secundario completo", becas: "Consultar" }

## Privacidad

El mapa, las notas y el feedback se guardan solo en el navegador de cada persona (`localStorage`, clave `ikigai-v2`). Nada se envía a ningún servidor; el feedback se comparte únicamente si la persona toca "Enviar mi feedback".

## Cambios (octubre 2026)

- Se quitó el encabezado de la hackatón y se agregó la firma del creador en el pie.
- Aviso de coincidencia baja, más sinónimos de jerga (tiktok, streamer, cripto, anime, series, maquillaje, gym, etc.) y aviso de palabras sin coincidencia.
- Feedback 👍/👎 usado: los 👎 se ocultan y hay botón para enviar el feedback.
- Alias de Mercado Pago voluntario en el pie.
- Tipografías incluidas en el proyecto (`@fontsource`): funcionan sin internet.
- CI con GitHub Actions.
