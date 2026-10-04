import { useEffect, useMemo, useState } from "react";
import { QUADRANTS } from "./data.js";
import { rank } from "./match.js";

const EMPTY = { p: [], t: [], m: [], v: [] };
const KEY = "ikigai-v1";

// Recupera el avance guardado en este dispositivo (si existe).
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.data && s.screen) return s;
  } catch {}
  return { screen: "hero", data: EMPTY };
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

// Diagrama: cada círculo gana color con las palabras de su cuadrante; el centro se enciende al completar los cuatro.
function Diagram({ counts, width }) {
  const op = (id) => 0.18 + 0.62 * Math.min(counts[id] / 4, 1);
  const done = QUADRANTS.every((q) => counts[q.id] >= 3);
  const pos = { p: [102, 102], t: [138, 102], m: [102, 138], v: [138, 138] };
  return (
    <svg viewBox="0 0 240 240" width={width} className="diagram" role="img"
      aria-label={`Mapa de Ikigai: ${QUADRANTS.map((q) => `${q.t} ${counts[q.id]}`).join(", ")} palabras`}>
      <g style={{ mixBlendMode: "multiply" }}>
        {QUADRANTS.map((q) => (
          <circle key={q.id} cx={pos[q.id][0]} cy={pos[q.id][1]} r="62" fill={q.k} style={{ opacity: op(q.id), transition: "opacity .4s" }} />
        ))}
      </g>
      <circle cx="120" cy="120" r="15" fill={done ? "var(--c2)" : "var(--bg)"} stroke="var(--ink)" strokeWidth={done ? 0 : 1.5} style={{ transition: "fill .4s" }} />
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

function Hero({ onStart }) {
  return (
    <section className="hero">
      <Diagram counts={{ p: 4, t: 4, m: 4, v: 4 }} width="min(260px,70%)" />
      <h1>Descubrí qué estudiar a partir de lo que te mueve</h1>
      <p>Completá tu mapa de Ikigai con palabras sueltas. En 5 minutos salís con 3 caminos para explorar.</p>
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
    if (v && !words.includes(v) && !full) onChange([...words, v]);
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
  const counts = Object.fromEntries(QUADRANTS.map((q) => [q.id, data[q.id].length]));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <section>
      <h2>Mi mapa de Ikigai</h2>
      <p className="tip">Escribí palabras sueltas o tocá las ideas. Si no sabés por dónde empezar, probá con las del final de cada cuadro. Nada sale de tu celular.</p>
      <Diagram counts={counts} width={150} />
      <div className="grid">
        {QUADRANTS.map((q) => (
          <Quadrant key={q.id} q={q} words={data[q.id]} onChange={(w) => setData({ ...data, [q.id]: w })} />
        ))}
      </div>
      <div className="bar no-print">
        <span role="status">{total < 4 ? `${total} de 4 palabras mínimas` : `${total} palabras`}</span>
        <button className="btn" disabled={total < 4} onClick={onSee}>Ver mis caminos</button>
      </div>
    </section>
  );
}

function Results({ data, onBack, onReset }) {
  const results = useMemo(() => rank(data), [data]);
  const [note, setNote] = useState("");
  const compartir = async () => {
    const text = "Mis caminos para explorar según mi mapa de Ikigai:\n" + results.map((r) => `• ${r.career.nombre} (${r.career.tipo})`).join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "Mi mapa de Ikigai", text });
      else { await navigator.clipboard.writeText(text); setNote("Copiado. Pegalo donde quieras."); }
    } catch {}
  };
  return (
    <section>
      <h2>Tus caminos para explorar</h2>
      <p className="tip no-print">Son pistas, no un veredicto. Las carreras salen de la oferta de Jujuy: confirmá requisitos y cupos en cada institución.</p>
      {results.length === 0 && (
        <div className="empty">Todavía no encontramos coincidencias. Probá agregar palabras más concretas, como actividades, materias o cosas que hacés seguido, y volvé a intentar.</div>
      )}
      {results.map(({ career, hit }, n) => (
        <article className={n === 0 ? "res top" : "res"} key={career.nombre}>
          <h3>{career.nombre}</h3>
          <div className="dots" role="img" aria-label={`Respaldado por ${Object.keys(hit).length} de 4 cuadrantes`}>
            {QUADRANTS.map((q) => <i key={q.id} className={hit[q.id] ? "on" : ""} style={{ "--k": q.k }} />)}
          </div>
          <p className="kind">Carreras: {career.tipo}</p>
          {career.donde && <p className="kind">Dónde estudiarla: {career.donde}</p>}
          <ul className="why">
            {QUADRANTS.filter((q) => hit[q.id]).map((q) => (
              <li key={q.id} style={{ "--k": q.k }}><span className="dot" />{q.t}: {[...new Set(hit[q.id])].join(", ")}</li>
            ))}
          </ul>
          <ol className="steps">{career.pasos.map((s) => <li key={s}>{s}</li>)}</ol>
        </article>
      ))}
      <div className="actions no-print">
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
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ screen, data })); } catch {}
  }, [screen, data]);
  useEffect(() => window.scrollTo(0, 0), [screen]);
  return (
    <>
      <header className="band">Hackatón Tecno-Productiva · Jujuy</header>
      <main>
        {screen === "hero" && <Hero onStart={() => setScreen("map")} />}
        {screen === "map" && <MapScreen data={data} setData={setData} onSee={() => setScreen("results")} />}
        {screen === "results" && <Results data={data} onBack={() => setScreen("map")} onReset={() => { setData(EMPTY); setScreen("hero"); }} />}
      </main>
      <footer className="band two">Tu mapa se guarda solo en este dispositivo</footer>
    </>
  );
}
