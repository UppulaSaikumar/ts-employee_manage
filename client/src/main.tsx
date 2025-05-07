import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EmpProvider } from "./context/Empcontext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EmpProvider>
      <App />
    </EmpProvider>
  </StrictMode>
);
