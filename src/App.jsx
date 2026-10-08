import { useEffect, useMemo, useState } from "react";
import { QUADRANTS, OFERTA_FECHA, EMOJI } from "./data.js";
import { rank, unmatched, isWeak } from "./match.js";
import { buildFeedbackText } from "./feedback.js";

const ALIAS_MP = "jhonmks.mp";
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
    const fbOk = !s || !s.fb || (typeof s.fb === "object" && !Array.isArray(s.fb) && Object.values(s.fb).every((v) => v === 1 || v === -1));
    if (dataOk && notaOk && fbOk && SCREENS.includes(s.screen)) return { screen: s.screen, data: { ...EMPTY, ...s.data }, nota: s.nota, fb: s.fb || {} };
  } catch {}
  return { screen: "hero", data: EMPTY, nota: {}, fb: {} };
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

const CONFETTI_COLORS = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
// Celebración ligera al completar el mapa (solo CSS, respeta prefers-reduced-motion).
function Confetti() {
  const pcs = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100,
    dur: 2.2 + Math.random() * 2,
    delay: Math.random() * 0.5,
    c: CONFETTI_COLORS[i % 4],
    round: i % 3 === 0,
  })), []);
  return (
    <div aria-hidden="true">
      {pcs.map((p, i) => (
        <i key={i} className="cf" style={{ left: p.left + "vw", animationDuration: p.dur + "s", animationDelay: p.delay + "s", background: p.c, borderRadius: p.round ? "50%" : "2px" }} />
      ))}
    </div>
  );
}

function Donar() {
  const [ok, setOk] = useState(false);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(ALIAS_MP); setOk(true); setTimeout(() => setOk(false), 2500); } catch {}
  };
  return (
    <div className="donar no-print">
      <span>¿Te sirvió? Podés invitarme un cafecito, es voluntario.</span>
      <button type="button" className="alias" onClick={copiar} aria-label={`Copiar alias de Mercado Pago ${ALIAS_MP}`}>
        {ok ? "¡Alias copiado!" : `Mercado Pago · ${ALIAS_MP} · Copiar`}
      </button>
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
            <button type="button" disabled={i > cur} onClick={() => go(id)}><i>{i + 1}</i><span>{t}</span></button>
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

const ONB = "ikigai-onboard";
function Onboarding() {
  const [show, setShow] = useState(() => { try { return !localStorage.getItem(ONB); } catch { return false; } });
  if (!show) return null;
  const close = () => { try { localStorage.setItem(ONB, "1"); } catch {} setShow(false); };
  return (
    <div className="onb no-print" role="note">
      <p><b>Así funciona:</b> cada círculo es un cuadrante de tu mapa. Empezá por <b>«Lo que amo»</b>: acá van las cosas que hacés cuando nadie te obliga. Escribí palabras sueltas o tocá las ideas que te sugerimos.</p>
      <button type="button" className="btn sm" onClick={close}>Entendido</button>
    </div>
  );
}

function MapScreen({ data, setData, onSee }) {
  const [sel, setSel] = useState("p");
  const q = QUADRANTS.find((x) => x.id === sel);
  const total = Object.values(data).flat().length;
  const ready = QUADRANTS.every((x) => data[x.id].length >= 1);
  const missing = QUADRANTS.filter((x) => !data[x.id].length).map((x) => x.t);
  const [party, setParty] = useState(false);
  useEffect(() => { if (ready && !party) setParty(true); }, [ready]);
  return (
    <section>
      <h2>Mi mapa de Ikigai</h2>
      <p className="tip">Tocá un círculo para escribir en ese cuadrante. Nada sale de tu celular.</p>
      <Mandala data={data} sel={sel} setSel={setSel} />
      <Onboarding />
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
      {party && <Confetti />}
      {party && <p className="toast" role="status">¡Mapa completo! Ya podés ver tus caminos ✨</p>}
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

function Detail({ r, onClose }) {
  const { career, hit } = r;
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={career.nombre} onClick={(e) => e.stopPropagation()}>
        <div className="rh">
          <span className="emo" aria-hidden="true">{EMOJI[career.nombre]}</span>
          <h3>{career.nombre}</h3>
        </div>
        <p className="kind">{career.fp ? "Formación profesional" : "Carreras"}: {career.tipo.replace(/^Cursos? de formación profesional: /, "")}</p>
        {career.donde && <p className="kind">Dónde estudiarla: {career.donde}</p>}
        {career.info && (
          <ul className="why">
            {Object.entries(career.info).map(([k, v]) => <li key={k}>{LABELS[k] || k}: {v}</li>)}
          </ul>
        )}
        <h4>Por qué aparece en tu mapa</h4>
        <ul className="why">
          {QUADRANTS.filter((q) => hit[q.id]).map((q) => (
            <li key={q.id} style={{ "--k": q.k }}><span className="dot" />{q.t}: {[...new Set(hit[q.id])].join(", ")}</li>
          ))}
        </ul>
        <h4>Pasos para explorarla</h4>
        <ol className="steps">{career.pasos.map((s) => <li key={s}>{s}</li>)}</ol>
        <div className="actions">
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function Results({ data, nota, setNota, fb, setFb, onBack, onReset }) {
  const [n, setN] = useState(3);
  // Los 👎 de antes se aplican al abrir esta pantalla (no al votar, para que la tarjeta no desaparezca de golpe).
  const [seenFb, setSeenFb] = useState(fb);
  const results = useMemo(() => rank(data, n, seenFb), [data, n, seenFb]);
  const sinMatch = useMemo(() => unmatched(data), [data]);
  const ocultas = Object.keys(seenFb).filter((k) => seenFb[k] === -1);
  const allWeak = results.length > 0 && results.every((r) => isWeak(r.score));
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(null);
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
  const mostrarOcultas = () => {
    const next = { ...fb };
    ocultas.forEach((k) => { if (next[k] === -1) delete next[k]; });
    setFb(next);
    setSeenFb(next);
  };
  const enviarFeedback = async () => {
    const text = buildFeedbackText({ data, fb, sinMatch });
    try {
      if (navigator.share) await navigator.share({ title: "Feedback Mapa de Ikigai", text });
      else { await navigator.clipboard.writeText(text); setNote("Feedback copiado. Pegalo donde quieras enviarlo."); }
    } catch {}
  };
  return (
    <section>
      <h2 aria-live="polite">Tus caminos para explorar</h2>
      <p className="tip">Son pistas, no un veredicto. Las opciones salen de la oferta de Jujuy: confirmá requisitos, cupos e inscripciones en cada institución. Oferta cargada en {OFERTA_FECHA}.</p>
      {allWeak && (
        <div className="weak-note" role="status">Tus palabras coinciden poco con la oferta. Volvé al mapa y sumá más, sobre todo en <b>Lo que Jujuy necesita</b> y <b>Mi modelo de valor</b>, para obtener caminos más precisos.</div>
      )}
      {sinMatch.length > 0 && (
        <p className="tip no-print" role="status">No pudimos relacionar: {sinMatch.join(", ")}. Probá con actividades o cosas más concretas.</p>
      )}
      {ocultas.length > 0 && (
        <p className="tip no-print" role="status">Ocultamos {ocultas.length} {ocultas.length === 1 ? "camino" : "caminos"} que marcaste con 👎. <button type="button" className="linkbtn" onClick={mostrarOcultas}>Mostrar de nuevo</button></p>
      )}
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
            {isWeak(score) && <p className="weak-tag">Coincidencia baja: agregá más palabras</p>}
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
            <div className="ract no-print">
              <button className="btn alt sm" onClick={() => setOpen({ career, hit })}>Ver detalle</button>
              <span className="fb" role="group" aria-label={`¿Te sirvió ${career.nombre}?`}>
                {[[1, "👍", "Me sirve"], [-1, "👎", "No me sirve"]].map(([v, e, l]) => (
                  <button key={v} type="button" className="btn alt sm" aria-pressed={fb[career.nombre] === v} aria-label={l}
                    onClick={() => { const n = { ...fb }; if (n[career.nombre] === v) delete n[career.nombre]; else n[career.nombre] = v; setFb(n); }}>{e}</button>
                ))}
              </span>
            </div>
          </article>
        );
      })}
      {open && <Detail r={open} onClose={() => setOpen(null)} />}
      <Reflect results={results} nota={nota} setNota={setNota} />
      <div className="actions no-print">
        {results.length === n && n < 6 && <button className="btn alt" onClick={() => setN(6)}>Ver más opciones</button>}
        {results.length > 0 && <button className="btn" onClick={compartir}>Compartir</button>}
        {results.length > 0 && <button className="btn alt" onClick={() => window.print()}>Guardar como PDF</button>}
        {(Object.keys(fb).length > 0 || sinMatch.length > 0) && <button className="btn alt" onClick={enviarFeedback}>Enviar mi feedback</button>}
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
  const [fb, setFb] = useState(init.fb || {});
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ screen, data, nota, fb })); } catch {}
  }, [screen, data, nota, fb]);
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);
  return (
    <div className={`app ${screen === "results" ? "results" : screen === "map" ? "map" : "hero"}`}>
      <header><div className="guarda" aria-hidden="true" /></header>
      <Steps screen={screen} go={setScreen} />
      <main key={screen}>
        {screen === "hero" && <Hero onStart={() => setScreen("map")} />}
        {screen === "map" && <MapScreen data={data} setData={setData} onSee={() => setScreen("results")} />}
        {screen === "results" && <Results data={data} nota={nota} setNota={setNota} fb={fb} setFb={setFb} onBack={() => setScreen("map")} onReset={() => { setData(EMPTY); setNota({}); setFb({}); setScreen("hero"); }} />}
      </main>
      <footer><div className="guarda" aria-hidden="true" /><Donar /><p>Tu mapa se guarda solo en este dispositivo<br /><small className="firma">Creado por Flores Juan Israel</small></p></footer>
    </div>
  );
}
