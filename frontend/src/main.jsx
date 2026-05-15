import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from "./components/layout/Layout.jsx";
import { Beneficiarios } from "./routes/Beneficiarios.jsx";

import Armaz from "./routes/RF_B5/armaz.jsx";
import CadastroRFB5 from "./routes/RF_B5/cadastro.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/donativos" element={<Fragment />} />
          <Route path="/arrecadacoes" element={<Fragment />} />
          <Route path="/doacoes" element={<Fragment />} />
          
          <Route path="/"element={<Navigate to="/locais-de-armazenamento" replace />}/>
          <Route path="/locais-de-armazenamento" element={<Armaz />} />
          <Route path="/locais-de-armazenamento/cadastro/:id?" element={<CadastroRFB5 />} />

          <Route path="/produtos" element={<Fragment />} />
          <Route path="/metas" element={<Fragment />} />
          <Route path="/unidades-de-medida" element={<Fragment />} />
          <Route path="/tipos-de-alocacao" element={<Fragment />} />

          <Route path="/beneficiarios" element={<Beneficiarios />} />
          <Route path="/familias" element={<Fragment />} />
          <Route path="/doadores" element={<Fragment />} />
          <Route path="/voluntarios" element={<Fragment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
