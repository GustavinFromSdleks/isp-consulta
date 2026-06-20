// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PlansProvider } from "./contexts/PlansContext";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PlansProvider>
        <App />
      </PlansProvider>
    </AuthProvider>
  </StrictMode>
);

//import { StrictMode } from "react";
//import { createRoot } from "react-dom/client";
//import { PlansProvider } from "./contexts/PlansContext";
//import App from "./App";

//createRoot(document.getElementById("root")).render(
 // <StrictMode>
   // <PlansProvider>
     // <App />
    //</PlansProvider>
 // </StrictMode>
//);