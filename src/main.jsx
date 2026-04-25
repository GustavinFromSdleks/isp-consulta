import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PlansProvider } from "./contexts/PlansContext";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PlansProvider>
      <App />
    </PlansProvider>
  </StrictMode>
);