# Fase 2 y 3 — cambios aplicados

Se aplican **encima de Fase 1** (sobre el proyecto con el motor optimizado y las cabeceras).
Si preferís un solo paso, usá `Todo.patch`, que va desde el proyecto original.

---

## Fase 2 — correcciones y accesibilidad

### 1. `src/App.jsx` — `load()` endurecido

Antes solo se comprobaba la *forma* de lo guardado (`Array.isArray`, `typeof === "object"`).
Ahora además se **sanea**:

- Palabras: se descarta lo que no sea texto, se recorta a 12 por cuadrante y a 40 caracteres.
- `nota`: se valida que cada campo sea texto y se limita a 80/80/120 caracteres.
- `fb`: se aceptan solo claves de hasta 100 caracteres con valor `1` o `-1`.
- Si falta un cuadrante, el guardado se descarta y se arranca limpio (antes se completaba con `[]`).

Por qué importa: `localStorage` es escribible a mano. Sin topes, un objeto manipulado podía
meter un tipo inesperado en un `<select>` o un array enorme y congelar la interfaz.
Es explotación local (no hay servidor ni otros usuarios), por eso era severidad baja, pero ahora
el problema no existe.

### 2. `src/App.jsx` — botón «Borrar mis datos»

En la pantalla de resultados, junto a «Empezar de nuevo». Pide confirmación y hace
`localStorage.removeItem` de `ikigai-v2` y `ikigai-onboard`. Es distinto de «Empezar de nuevo»,
que limpia el avance pero deja las claves. En una computadora compartida de escuela, la diferencia importa.

### 3. `src/App.jsx` — palabras repetidas con tildes

`add()` comparaba en minúsculas pero **no quitaba tildes**, así que «musica» y «música» convivían
como dos chips distintos. Y al tocar una idea sugerida no había ninguna comprobación de duplicado.

Ahora hay un helper `igual()` con `localeCompare(..., { sensitivity: "base" })`, que ignora
mayúsculas y tildes, usado en los tres lugares: agregar a mano, agregar una sugerencia y filtrar
las sugerencias ya usadas. También se respeta el tope de 12 al tocar una sugerencia (antes no),
y las `key` de los chips dejaron de depender solo del texto.

### 4. `src/App.jsx` — el modal atrapa el foco

El detalle de cada carrera ahora:

- mueve el foco al primer control al abrir,
- atrapa `Tab` / `Shift+Tab` dentro del diálogo,
- devuelve el foco a la tarjeta de origen al cerrar,
- usa `aria-labelledby` apuntando al título en lugar de `aria-label`.

Antes se podía tabular hacia el contenido de atrás sin darse cuenta.

### 5. `src/App.jsx` — aviso antes de compartir

Cuando aparece «Enviar mi feedback», ahora se explica en pantalla qué se comparte: tus palabras
del mapa, tus votos 👍/👎 y las palabras sin coincidencia. El README ya lo decía, pero quien usa la
app no lo leía.

### 6. Tipografía Sora eliminada

`src/main.jsx` ya no importa los dos CSS de Sora y `styles.css` usa Montserrat en los títulos.
Se quitó también la dependencia de `package.json` **y de `package-lock.json`** (esto último es
importante: `npm ci` falla si el lock y el `package.json` no coinciden, y eso habría roto el CI).
Ahorro: 29,9 KB de 84,3 KB de fuentes, el 35 %.

---

## Fase 3 — producto y mantenimiento

### 7. Modo sin conexión (PWA)

- `public/sw.js`: service worker propio, **sin dependencias nuevas**. Estrategia mixta:
  - **navegación (HTML): red primero**, con la copia guardada como respaldo. Así un deploy nuevo
    se ve enseguida en lugar de quedar preso en la caché.
  - **recursos con hash de Vite (JS, CSS, fuentes, iconos): caché primero**, porque son inmutables.
  - `VERSION` en la primera línea: si cambiás la lista `SHELL`, subila para invalidar la caché vieja.
- `public/manifest.webmanifest` + iconos 192, 512 y *maskable* generados con los colores de la app
  (fondo `#121A36` y los cuatro cuadrantes del mandala). **Reemplazalos por tu propio diseño si querés**;
  están hechos para que la app sea instalable, no como identidad definitiva.
- `index.html`: `<link rel="manifest">` y los metas de iOS/Android.
- `src/main.jsx`: registro del service worker **solo en producción** (`import.meta.env.PROD`), para
  no servir versiones viejas mientras desarrollás.
- `vercel.json`: la CSP ahora incluye `worker-src 'self'` y `/sw.js` se sirve con
  `Cache-Control: max-age=0, must-revalidate`, para que el navegador detecte actualizaciones.

Para el público objetivo esto es lo más valioso de la fase: la app no usa red en ningún momento,
así que sin conexión funciona igual. Se instala desde el navegador («Agregar a pantalla de inicio»).

### 8. `engines` en `package.json`

`"node": ">=20"`. `node --test` con directorio necesita esa versión; sin declararlo, el CI podía
fallar en otra máquina sin que se entienda por qué.

---

## Lo que quedó pendiente (y por qué)

### Rellenar `INFO` — te toca a vos

`INFO` en `src/data.js` sigue **vacío a propósito**. Duración, modalidad, ingreso y becas cambian por
institución y año: **no puedo completarlo sin inventar datos**, y datos inventados sobre inscripciones
son peor que ningún dato. El formato ya está documentado en el README y la pantalla lo muestra sola
cuando exista:

```js
const INFO = {
  "Enfermería": { duracion: "3 años", modalidad: "Presencial", ingreso: "Secundario completo", becas: "Consultar" },
};
```

Es lo que más mejoraría la utilidad real de los resultados.

### ESLint — no lo agregué a propósito

Requiere instalar dependencias, y no puedo regenerar `package-lock.json` en mi entorno (no tengo
`npm`, solo `pnpm`, que escribe otro lock). Agregar el paquete sin el lock dejaría `npm ci` roto.
Cuando quieras activarlo, en tu máquina:

```
npm i -D eslint @eslint/js eslint-plugin-react-hooks globals
```

y después sumar `"lint": "eslint ."` a los scripts y un paso `npm run lint` al CI. Con eso, la regla
`react-hooks/exhaustive-deps` (que hoy está silenciada a mano en `App.jsx`) queda cubierta por la herramienta.

### Apretar la CSP — opcional, después de probar

La CSP usa `style-src 'self' 'unsafe-inline'` por los estilos en línea que genera React. Se podría
intentar quitarlo, pero **verificá la app entera después** (mandala, confeti, barras de afinidad):
preferí no arriesgar la primera impresión por una mejora marginal.

---

## Verificación hecha

| Qué | Resultado |
|---|---|
| `src/match.test.js` | 18 tests, 18 pasan |
| `src/feedback.test.js` | 2 tests, 2 pasan |
| `src/App.jsx` y `src/main.jsx` con `@babel/parser` | sintaxis JSX válida |
| `public/sw.js` con `node --check` | sin errores de sintaxis |
| `package.json`, `package-lock.json`, `vercel.json`, `manifest.webmanifest` | JSON válido |
| `package-lock.json` | 113 → 112 entradas, solo se quitó Sora (10 líneas) |
| `git apply --check` sobre una copia limpia | aplica sin conflictos |

**No verifiqué en un navegador**: mi sandbox bloquea el build de Vite (esbuild necesita lanzar un
proceso hijo con tuberías). Así que quedan para tu prueba visual: el modo sin conexión
(`npm run build && npm run preview`, después desactivá la red), la instalación como app y el foco del modal.
