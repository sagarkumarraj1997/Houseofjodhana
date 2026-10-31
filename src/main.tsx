import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./styles/global.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { StoreProvider } from "./store";
import { App } from "./app";

const container = document.getElementById("app");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <StoreProvider>
          <App />
        </StoreProvider>
      </MantineProvider>
    </StrictMode>
  );
}
