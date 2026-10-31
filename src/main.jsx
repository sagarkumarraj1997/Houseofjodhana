import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { StoreProvider } from "./store.jsx";
import { App } from "./app.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <StoreProvider><App/></StoreProvider>
  </StrictMode>
);
