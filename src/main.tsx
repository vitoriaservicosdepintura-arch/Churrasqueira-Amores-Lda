import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import DishPage from "./DishPage";
import MenuVision from "./MenuVision";
import VideoDirect from "./VideoDirect";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/menuvision" element={<MenuVision />} />
        <Route path="/item/:id" element={<DishPage />} />
        <Route path="/v/:id" element={<VideoDirect />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
