import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from "./components/layout/Layout.jsx";
import { Beneficiaries } from "./routes/beneficiaries/Beneficiaries.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/donativos" element={<Fragment />} />
          <Route path="/arrecadacoes" element={<Fragment />} />
          <Route path="/doacoes" element={<Fragment />} />
          <Route path="/locais-de-armazenamento" element={<Fragment />} />
          <Route path="/produtos" element={<Fragment />} />
          <Route path="/metas" element={<Fragment />} />
          <Route path="/unidades-de-medida" element={<Fragment />} />
          <Route path="/tipos-de-alocacao" element={<Fragment />} />

          <Route path="/beneficiarios" element={<Beneficiaries />} />
          <Route path="/familias" element={<Fragment />} />
          <Route path="/doadores" element={<Fragment />} />
          <Route path="/voluntarios" element={<Fragment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
