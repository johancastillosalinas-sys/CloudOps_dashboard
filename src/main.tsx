import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { RegionProvider } from "./context/RegionContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RegionProvider>
        <App />
      </RegionProvider>
    </BrowserRouter>
  </React.StrictMode>
);