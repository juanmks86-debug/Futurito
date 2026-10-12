# Fase 1 — cambios aplicados

Aplicado sobre una copia de `Futurito-main`. Cinco cambios, ninguno toca la lógica de coincidencias
en su comportamiento (solo la hace mucho más rápida).

## 1. `src/match.js` — motor de coincidencias optimizado

- Claves de las 36 áreas **precalculadas una sola vez** al cargar el módulo (`CAREER_KEYS`), en vez de
  recalcularlas en cada búsqueda.
- Tokenización de palabras con memo (`cachedToks`).
- `hits()` busca en un `Set` de raíces en lugar de recorrer las ~15 claves de cada área.
- `levAtMost1()` reemplaza a `lev()`: para saber si dos palabras están a distancia ≤ 1 ya no se
  construye la matriz de distancia completa.

**Medición** (mapa lleno, 48 palabras): 150 ms → **2,9 ms**. Primera llamada en frío: 206 ms → **2 ms**.

**Verificación:** los 20 tests del proyecto pasan, 500 mapas aleatorios devuelven resultados idénticos
(nombre, puntaje y detalle de coincidencias) y 427.645 pares de palabras confirman que `levAtMost1`
equivale a `lev() <= 1`.

## 2. `vercel.json` — cabeceras de seguridad (nuevo)

CSP (`default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`), `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, HSTS y `Cross-Origin-Opener-Policy`.
`img-src data:` es necesario por el SVG embebido del encabezado (`styles.css:25`).

## 3. `src/App.jsx` — la celebración se apaga sola

El aviso «¡Mapa completo!» y el confeti se quedaban en pantalla para siempre (el efecto encendía
`party` y nunca lo apagaba). Ahora se apagan a los 4 segundos y el `clearTimeout` limpia al desmontar.

## 4. `src/App.jsx` — `localStorage` sin escribir en cada tecla

Antes se guardaba el estado completo (mapa serializado) en **cada pulsación** de los campos de texto.
Ahora se guarda 400 ms después del último cambio, y siempre al salir de la página (`pagehide`), para
no perder lo último escrito.

## 5. CI y Dependabot (nuevos)

- `.github/workflows/ci.yml`: `npm ci`, `npm test`, `npm run build` y `npm audit --audit-level=high`.
  El README ya prometía este archivo; ahora existe.
- `.github/dependabot.yml`: actualizaciones semanales de npm y mensuales de las acciones.

---

## Cómo aplicarlo

**Opción 1 — descomprimir:** volcar el contenido de `Futurito-Fase1.zip` sobre tu repositorio
(sobrescribe `src/match.js` y `src/App.jsx`, agrega `vercel.json` y `.github/`).

**Opción 2 — parche:** desde la raíz de tu repo,

```
git apply Fase1.patch
```

El parche se probó con `git apply --check` sobre una copia limpia: aplica sin conflictos.

## Verificación hecha

- `node src/match.test.js` → 18 tests, 18 pasan.
- `node src/feedback.test.js` → 2 tests, 2 pasan.
- `src/App.jsx` y `src/main.jsx` parseados con `@babel/parser` (los tests del proyecto no cubren los
  componentes): sintaxis válida.
- `vercel.json` y `package.json`: JSON válido.

## Lo que NO incluye (queda para Fase 2 y 3)

Endurecer la validación de `load()`, botón «Borrar mis datos», deduplicar chips por tildes,
trampa de foco en el modal, sacar la tipografía Sora (29,9 KB), PWA offline y rellenar `INFO`
con datos verificados. Detalle y prioridades en `INFORME-Futurito.md`.
