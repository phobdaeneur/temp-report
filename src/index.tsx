import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./store";
import { ThemeProvider } from "./themeContext";
import { VehicleStoreProvider } from "./vehicleStore";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider initialTheme={"light"}>
      <StoreProvider>
        <VehicleStoreProvider>
          <App />
        </VehicleStoreProvider>
      </StoreProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
