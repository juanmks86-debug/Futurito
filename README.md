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
- `public/sw.js` y `public/manifest.webmanifest`: modo sin conexión e instalación como app.

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

## Cambios (revisión técnica)

- **Búsqueda mucho más rápida:** el motor de coincidencias pasó de ~150 ms a ~3 ms en un mapa completo. No cambia ningún resultado: los 20 tests y una comparación de 500 mapas aleatorios lo confirman.
- **`localStorage` con retardo:** se guarda 400 ms después del último cambio (antes se guardaba en cada tecla) y siempre al salir de la página.
- **«Borrar mis datos»:** botón en la pantalla de resultados que saca el mapa y el aviso de bienvenida de este dispositivo.
- **Cabeceras de seguridad** (`vercel.json`): CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Funciona sin conexión** después de la primera visita y se puede instalar como app desde el navegador (service worker + manifest).
- **Menos peso:** se quitó la tipografía Sora (29,9 KB, el 35 % de las fuentes); los títulos usan Montserrat.
- **Accesibilidad:** el detalle de cada carrera atrapa el foco y lo devuelve al cerrar. Las palabras repetidas se detectan sin distinguir tildes ("musica" y "música" son la misma).
- **La celebración, en el momento justo:** el confeti y el aviso aparecen al llegar a la pantalla de caminos (no al completar el mapa) y se apagan solos a los 4 segundos.
- **CI y Dependabot** en GitHub Actions, y `engines`: Node >= 20.

### Cómo probar el modo sin conexión

    npm run build && npm run preview

El service worker se registra solo en producción: en `npm run dev` queda desactivado a propósito para no servir versiones viejas mientras desarrollás.
