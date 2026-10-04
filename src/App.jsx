import { useEffect, useMemo, useState } from "react";
import { QUADRANTS } from "./data.js";
import { rank } from "./match.js";

const EMPTY = { p: [], t: [], m: [], v: [] };

function Hero({ onStart }) {
  return (
    <section className="hero">
      <svg viewBox="0 0 240 240" role="img" aria-label="Cuatro círculos que se cruzan: pasión, talento, misión y valor">
        <g style={{ mixBlendMode: "multiply" }} opacity=".78">
          <circle cx="102" cy="102" r="62" fill="var(--c1)" />
          <circle cx="138" cy="102" r="62" fill="var(--c2)" />
          <circle cx="102" cy="138" r="62" fill="var(--c3)" />
          <circle cx="138" cy="138" r="62" fill="var(--c4)" />
        </g>
        <circle cx="120" cy="120" r="14" fill="var(--bg)" />
      </svg>
      <h1>Descubrí qué estudiar a partir de lo que te mueve</h1>
      <p>Completá tu mapa de Ikigai con palabras sueltas. En 5 minutos salís con 3 caminos para explorar.</p>
      <button className="btn" onClick={onStart}>Empezar</button>
    </section>
  );
}

function Quadrant({ q, words, onChange }) {
  const [text, setText] = useState("");
  const add = () => {
    const v = text.trim().replace(/,$/, "");
    if (v && !words.includes(v) && words.length < 12) onChange([...words, v]);
    setText("");
  };
  return (
    <div className="q" style={{ "--k": q.k }}>
      <h3>{q.t}</h3>
      <small>{q.s}</small>
      <div className="row">
        <input
          value={text}
          maxLength={40}
          aria-label={q.t}
          enterKeyHint="done"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" aria-label={`Agregar a ${q.t}`} onClick={add}>+</button>
      </div>
      <div className="chips">
        {words.map((w, i) => (
          <span className="chip" key={w}>
            {w}
            <button type="button" aria-label={`Quitar ${w}`} onClick={() => onChange(words.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

function MapScreen({ data, setData, onSee }) {
  const [msg, setMsg] = useState("");
  const total = Object.values(data).flat().length;
  const see = () => (total < 4 ? setMsg("Agregá al menos 4 palabras en total para ver resultados.") : onSee());
  return (
    <section>
      <h2>Mi mapa de Ikigai</h2>
      <p className="tip">Escribí una palabra o frase corta y tocá + (o Enter). Poné entre 5 y 8 por cuadro. Nada sale de tu celular.</p>
      <div className="grid">
        {QUADRANTS.map((q) => (
          <Quadrant key={q.id} q={q} words={data[q.id]} onChange={(w) => setData({ ...data, [q.id]: w })} />
        ))}
      </div>
      <div className="actions">
        <button className="btn" onClick={see}>Ver mis caminos</button>
        <p id="msg" role="alert">{msg}</p>
      </div>
    </section>
  );
}

function Results({ data, onBack, onReset }) {
  const results = useMemo(() => rank(data), [data]);
  return (
    <section>
      <h2>Tus caminos para explorar</h2>
      <p className="tip">Son pistas, no un veredicto. La lista de carreras es de ejemplo y se puede ajustar a la oferta real de Jujuy.</p>
      {results.length === 0 && (
        <div className="empty">
          Todavía no encontramos coincidencias. Probá agregar palabras más concretas, como actividades, materias o cosas que hacés seguido, y volvé a intentar.
        </div>
      )}
      {results.map(({ career, hit }) => (
        <article className="res" key={career.nombre}>
          <h3>{career.nombre}</h3>
          <p className="kind">{career.tipo}</p>
          <ul className="why">
            {QUADRANTS.filter((q) => hit[q.id]).map((q) => (
              <li key={q.id} style={{ "--k": q.k }}>
                <span className="dot" />
                {q.t}: {[...new Set(hit[q.id])].join(", ")}
              </li>
            ))}
          </ul>
          <ol className="steps">
            {career.pasos.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </article>
      ))}
      <div className="actions">
        <button className="btn alt" onClick={onBack}>Editar mi mapa</button>
        <button className="btn alt" onClick={onReset}>Empezar de nuevo</button>
      </div>
    </section>
  );
}

export default function App() {
  const [screen, setScreen] = useState("hero");
  const [data, setData] = useState(EMPTY);
  useEffect(() => window.scrollTo(0, 0), [screen]);
  return (
    <main>
      {screen === "hero" && <Hero onStart={() => setScreen("map")} />}
      {screen === "map" && <MapScreen data={data} setData={setData} onSee={() => setScreen("results")} />}
      {screen === "results" && (
        <Results data={data} onBack={() => setScreen("map")} onReset={() => { setData(EMPTY); setScreen("hero"); }} />
      )}
    </main>
  );
}
