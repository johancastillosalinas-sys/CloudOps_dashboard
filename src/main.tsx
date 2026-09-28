import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { RegionProvider } from "./context/RegionContext";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RegionProvider>
          <App />
        </RegionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);