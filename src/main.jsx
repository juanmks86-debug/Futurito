import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-800.css";
import "./styles.css";
createRoot(document.getElementById("root")).render(<App />);
