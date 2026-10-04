import { useEffect, useMemo, useState } from "react";
import { QUADRANTS, OFERTA_FECHA, EMOJI } from "./data.js";
import { rank } from "./match.js";

const EMPTY = { p: [], t: [], m: [], v: [] };
const KEY = "ikigai-v2";
const LABELS = { duracion: "Duración", modalidad: "Modalidad", ingreso: "Ingreso", becas: "Becas" };

const SCREENS = ["hero", "map", "results"];
const isStrArr = (a) => Array.isArray(a) && a.every((w) => typeof w === "string");
// Recupera el avance guardado en este dispositivo (si existe y tiene forma válida).
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    const dataOk = s && s.data && QUADRANTS.every((q) => isStrArr(s.data[q.id] || []));
    const notaOk = s && s.nota && typeof s.nota === "object" && !Array.isArray(s.nota);
    if (dataOk && notaOk && SCREENS.includes(s.screen)) return { screen: s.screen, data: { ...EMPTY, ...s.data }, nota: s.nota };
  } catch {}
  return { screen: "hero", data: EMPTY, nota: {} };
}

const ICONS = {
  p: "M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.4 12 21 12 21z",
  t: "M13 2 4 14h6l-1 8 9-12h-6z",
  m: "M12 22v-9M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 15c0-3 2-5 6-5 0 3-2 5-6 5z",
  v: "M4 11 12 4l8 7v9H4zM10 20v-6h4v6",
};
const Icon = ({ id }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <path d={ICONS[id]} />
  </svg>
);

const DEMO = { p: ["videojuegos", "animales", "música"], t: ["explicar cosas", "organizar", "dibujar"], m: ["residuos", "turismo", "conectividad"], v: ["reparar cosas", "clases", "fotos"] };
const POS = { p: [105, 105, 75, 52], t: [195, 105, 225, 52], m: [105, 195, 75, 212], v: [195, 195, 225, 212] };
const clip = (s, n = 15) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

// El mapa es el protagonista: cada círculo se llena con las palabras de su cuadrante y el centro se enciende al completar los cuatro.
function Mandala({ data, sel, setSel }) {
  const done = QUADRANTS.every((q) => data[q.id].length >= 3);
  return (
    <svg viewBox="0 0 300 300" className="mandala" role="img" aria-label={`Mapa de Ikigai: ${QUADRANTS.map((q) => `${q.t} ${data[q.id].length}`).join(", ")} palabras`}>
      <g style={{ mixBlendMode: "var(--blend)" }}>
        {QUADRANTS.map((q) => (
          <circle key={q.id} cx={POS[q.id][0]} cy={POS[q.id][1]} r="90" fill={q.k} className={setSel ? "cir tap" : "cir"}
            style={{ opacity: 0.22 + 0.55 * Math.min(data[q.id].length / 4, 1) }}
            stroke={sel === q.id ? "var(--ink)" : "none"} strokeWidth="3" onClick={setSel ? () => setSel(q.id) : undefined} />
        ))}
      </g>
      {QUADRANTS.map((q) => (
        <g key={q.id} textAnchor="middle" fill="var(--ink)" pointerEvents="none">
          <text x={POS[q.id][2]} y={POS[q.id][3]} className="ct">{q.t}</text>
          {data[q.id].slice(-3).map((w, i) => <text key={w} x={POS[q.id][2]} y={POS[q.id][3] + 18 + i * 15} className="cw">{clip(w)}</text>)}
        </g>
      ))}
      <circle cx="150" cy="150" r="16" className={done ? "core on" : "core"} />
    </svg>
  );
}

const FASES = ["Inhalá", "Mantené", "Exhalá", "Mantené en vacío"];
function Breath() {
  const [on, setOn] = useState(false);
  const [i, setI] = useState(3);
  useEffect(() => {
    if (!on) return;
    setI(3);
    const t = setTimeout(() => setI(0), 60);
    const id = setInterval(() => setI((x) => (x + 1) % 4), 4000);
    return () => { clearTimeout(t); clearInterval(id); };
  }, [on]);
  if (!on) return <button className="btn alt" onClick={() => setOn(true)}>Respirar 4×4 antes de empezar</button>;
  return (
    <div className="breath">
      <div className={`orb p${i}`} aria-hidden="true" />
      <p role="status">{FASES[i]} · 4 segundos</p>
      <button className="btn alt" onClick={() => setOn(false)}>Listo</button>
    </div>
  );
}

const STEPS = [["hero", "Inicio"], ["map", "Mapa"], ["results", "Caminos"]];
function Steps({ screen, go }) {
  const cur = STEPS.findIndex((s) => s[0] === screen);
  return (
    <nav className="steps-bar" aria-label="Progreso">
      <ol>
        {STEPS.map(([id, t], i) => (
          <li key={id} className={i <= cur ? "done" : ""} aria-current={i === cur ? "step" : undefined}>
            <button type="button" disabled={i > cur} onClick={() => go(id)}>{t}</button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Hero({ onStart }) {
  return (
    <section className="hero">
      <h1>Descubrí qué estudiar a partir de lo que te mueve</h1>
      <p>Completá tu mapa de Ikigai con palabras sueltas. En 5 minutos salís con 3 caminos para explorar.</p>
      <Mandala data={DEMO} />
      <div className="actions">
        <button className="btn" onClick={onStart}>Empezar</button>
        <Breath />
      </div>
    </section>
  );
}

function Quadrant({ q, words, onChange }) {
  const [text, setText] = useState("");
  const full = words.length >= 12;
  const add = () => {
    const v = text.trim().replace(/,$/, "");
    if (v && !words.some((w) => w.toLowerCase() === v.toLowerCase()) && !full) onChange([...words, v]);
    setText("");
  };
  const sug = q.ej.filter((e) => !words.includes(e)).slice(0, 6);
  return (
    <div className="q" style={{ "--k": q.k }}>
      <h3><span className="ico"><Icon id={q.id} /></span>{q.t}</h3>
      <small>{q.s}</small>
      <p className="ask">{q.pregunta}</p>
      <div className="row">
        <input value={text} maxLength={40} aria-label={q.t} enterKeyHint="done" placeholder="Escribí y tocá +"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} />
        <button type="button" aria-label={`Agregar a ${q.t}`} onClick={add}>+</button>
      </div>
      <div className="chips">
        {words.map((w, i) => (
          <span className="chip" key={w}>{w}
            <button type="button" aria-label={`Quitar ${w}`} onClick={() => onChange(words.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
      {!full && sug.length > 0 && (
        <div className="sug no-print" aria-label="Ideas para sumar">
          {sug.map((e) => <button key={e} type="button" className="sg" onClick={() => onChange([...words, e])}>+ {e}</button>)}
        </div>
      )}
    </div>
  );
}

function MapScreen({ data, setData, onSee }) {
  const [sel, setSel] = useState("p");
  const q = QUADRANTS.find((x) => x.id === sel);
  const total = Object.values(data).flat().length;
  const ready = QUADRANTS.every((x) => data[x.id].length >= 1);
  const missing = QUADRANTS.filter((x) => !data[x.id].length).map((x) => x.t);
  return (
    <section>
      <h2>Mi mapa de Ikigai</h2>
      <p className="tip">Tocá un círculo para escribir en ese cuadrante. Nada sale de tu celular.</p>
      <Mandala data={data} sel={sel} setSel={setSel} />
      <div className="tabs">
        {QUADRANTS.map((x) => (
          <button key={x.id} type="button" className="tab" aria-pressed={x.id === sel} style={{ "--k": x.k }} onClick={() => setSel(x.id)}>
            <Icon id={x.id} /><span>{x.t}</span><b>{data[x.id].length}</b>
          </button>
        ))}
      </div>
      <Quadrant key={sel} q={q} words={data[sel]} onChange={(w) => setData({ ...data, [sel]: w })} />
      <div className="bar no-print">
        <span role="status">{ready ? `${total} palabras` : `Falta: ${missing.join(" · ")}`}</span>
        <button className="btn" disabled={!ready} onClick={onSee}>Ver mis caminos</button>
      </div>
    </section>
  );
}

function Reflect({ results, nota, setNota }) {
  const set = (k, v) => setNota({ ...nota, [k]: v });
  if (!results.length) return null;
  return (
    <section className="reflect" aria-labelledby="refl">
      <h3 id="refl">Para pensar esta semana</h3>
      <label>¿Cuál de estos caminos te da más curiosidad?
        <select value={nota.camino || ""} onChange={(e) => set("camino", e.target.value)}>
          <option value="">Elegí uno</option>
          {results.map((r) => <option key={r.career.nombre}>{r.career.nombre}</option>)}
        </select>
      </label>
      <label>¿Con quién podrías hablar de esto?
        <input value={nota.persona || ""} maxLength={80} onChange={(e) => set("persona", e.target.value)} />
      </label>
      <label>Mi próximo paso
        <input value={nota.paso || ""} maxLength={120} onChange={(e) => set("paso", e.target.value)} />
      </label>
    </section>
  );
}

function Results({ data, nota, setNota, onBack, onReset }) {
  const [n, setN] = useState(3);
  const results = useMemo(() => rank(data, n), [data, n]);
  const [note, setNote] = useState("");
  useEffect(() => {
    if (nota.camino && !results.some((r) => r.career.nombre === nota.camino)) setNota({ ...nota, camino: "" });
  }, [results]); // eslint-disable-line react-hooks/exhaustive-deps
  const compartir = async () => {
    const text = "Mis caminos para explorar según mi mapa de Ikigai:\n" + results.map((r) => `• ${r.career.nombre} (${r.career.tipo})`).join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "Mi mapa de Ikigai", text });
      else { await navigator.clipboard.writeText(text); setNote("Copiado. Pegalo donde quieras."); }
    } catch {}
  };
  return (
    <section>
      <h2 aria-live="polite">Tus caminos para explorar</h2>
      <p className="tip">Son pistas, no un veredicto. Las opciones salen de la oferta de Jujuy: confirmá requisitos, cupos e inscripciones en cada institución. Oferta cargada en {OFERTA_FECHA}.</p>
      {results.length === 0 && (
        <div className="empty">Todavía no encontramos coincidencias. Probá agregar palabras más concretas, como actividades, materias o cosas que hacés seguido, y volvé a intentar.</div>
      )}
      {results.map(({ career, hit, score }, idx) => {
        const pct = Math.round(Math.min(score / 8, 1) * 100);
        return (
          <article className={idx === 0 ? "res top" : "res"} key={career.nombre}>
            <div className="rh">
              <span className="emo" aria-hidden="true">{EMOJI[career.nombre]}</span>
              <h3>{career.nombre}</h3>
            </div>
            <div className="meter" role="img" aria-label={`Afinidad ${pct}%`}><i style={{ width: pct + "%" }} /></div>
            <div className="dots" role="img" aria-label={`Respaldado por ${Object.keys(hit).length} de 4 cuadrantes`}>
              {QUADRANTS.map((q) => <i key={q.id} className={hit[q.id] ? "on" : ""} style={{ "--k": q.k }} />)}
            </div>
            <p className="kind">{career.fp ? "Formación profesional" : "Carreras"}: {career.tipo.replace(/^Cursos? de formación profesional: /, "")}</p>
            {career.donde && <p className="kind">Dónde estudiarla: {career.donde}</p>}
            {career.info && (
              <ul className="why">
                {Object.entries(career.info).map(([k, v]) => <li key={k}>{LABELS[k] || k}: {v}</li>)}
              </ul>
            )}
            <ul className="why">
              {QUADRANTS.filter((q) => hit[q.id]).map((q) => (
                <li key={q.id} style={{ "--k": q.k }}><span className="dot" />{q.t}: {[...new Set(hit[q.id])].join(", ")}</li>
              ))}
            </ul>
            <ol className="steps">{career.pasos.map((s) => <li key={s}>{s}</li>)}</ol>
          </article>
        );
      })}
      <Reflect results={results} nota={nota} setNota={setNota} />
      <div className="actions no-print">
        {results.length === n && n < 6 && <button className="btn alt" onClick={() => setN(6)}>Ver más opciones</button>}
        {results.length > 0 && <button className="btn" onClick={compartir}>Compartir</button>}
        {results.length > 0 && <button className="btn alt" onClick={() => window.print()}>Guardar como PDF</button>}
        <button className="btn alt" onClick={onBack}>Editar mi mapa</button>
        <button className="btn alt" onClick={onReset}>Empezar de nuevo</button>
      </div>
      <p className="tip no-print" role="status" hidden={!note}>{note}</p>
    </section>
  );
}

export default function App() {
  const [init] = useState(load);
  const [screen, setScreen] = useState(init.screen);
  const [data, setData] = useState(init.data);
  const [nota, setNota] = useState(init.nota || {});
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ screen, data, nota })); } catch {}
  }, [screen, data, nota]);
  useEffect(() => window.scrollTo(0, 0), [screen]);
  return (
    <div className={`app ${screen === "results" ? "results" : screen === "map" ? "map" : "hero"}`}>
      <header><div className="top">Hackatón Tecno-Productiva · Jujuy</div><div className="guarda" aria-hidden="true" /></header>
      <Steps screen={screen} go={setScreen} />
      <main key={screen}>
        {screen === "hero" && <Hero onStart={() => setScreen("map")} />}
        {screen === "map" && <MapScreen data={data} setData={setData} onSee={() => setScreen("results")} />}
        {screen === "results" && <Results data={data} nota={nota} setNota={setNota} onBack={() => setScreen("map")} onReset={() => { setData(EMPTY); setNota({}); setScreen("hero"); }} />}
      </main>
      <footer><div className="guarda" aria-hidden="true" /><p>Tu mapa se guarda solo en este dispositivo</p></footer>
    </div>
  );
}
