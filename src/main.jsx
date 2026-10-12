import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-800.css";
import "./styles.css";
createRoot(document.getElementById("root")).render(<App />);

// La app no usa red: con el service worker queda disponible sin conexión después de la primera visita.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
