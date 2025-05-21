import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ATMProvider } from "./contexts/atm-context";

createRoot(document.getElementById("root")!).render(
  <ATMProvider>
    <App />
  </ATMProvider>
);
