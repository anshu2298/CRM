import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { EmployeeProvider } from "./context/EmployeeContext.jsx";

import { LeadsProvider } from "./context/LeadsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LeadsProvider>
      <EmployeeProvider>
        <App />
      </EmployeeProvider>
    </LeadsProvider>
  </StrictMode>
);
