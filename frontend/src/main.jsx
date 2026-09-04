import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from "./components/layout/Layout.jsx";
import { Volunteers } from "./routes/Volunteers/Volunteers.jsx";
import { Beneficiaries } from "./routes/beneficiaries/Beneficiaries.jsx";
import Armaz from "./routes/RF_B5/armaz.jsx";
import CadastroRFB5 from "./routes/RF_B5/cadastro.jsx";
import App from "./components/App.jsx";
import { MatchMediaProvider } from "./components/media-query/MatchMediaProvider.jsx";
import { AllocationTypes } from "./routes/allocation-types/AllocationTypes.jsx";
import { MeasuringUnits } from "./routes/measuring-units/MeasuringUnits.jsx";
import Products from "./routes/RF_B7/Products.jsx";
import { Families } from "./routes/families/Families.jsx";
import MeasuringUnitsForm from "./routes/measuring-units/MeasuringUnitsForm.jsx";
import SignInForm from "./routes/auth/SignIn.jsx";
import { AuthGuard } from "./auth/WithAuthGuard.hoc.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MatchMediaProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignInForm />} />

          <Route element={<Layout />}>
            <Route path="/donativos" element={<AuthGuard />} />
            <Route path="/arrecadacoes" element={<AuthGuard />} />
            <Route path="/doacoes" element={<AuthGuard />} />

            <Route path="/" element={<AuthGuard />} />
            <Route path="/locais-de-armazenamento" element={<Armaz />} />
            <Route
              path="/locais-de-armazenamento/cadastro/:id?"
              element={<CadastroRFB5 />}
            />

            <Route path="/produtos" element={<Products />} />
            <Route path="/metas" element={<AuthGuard />} />
            <Route path="/unidades-de-medida" element={<MeasuringUnits />} />
            <Route
              path="/unidades-de-medida/cadastrar"
              element={<MeasuringUnitsForm />}
            />
            <Route path="/tipos-de-alocacao" element={<AllocationTypes />} />

            <Route path="/beneficiarios" element={<Beneficiaries />} />
            <Route path="/familias" element={<Families />} />
            <Route path="/doadores" element={<App />} />
            <Route path="/voluntarios" element={<Volunteers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MatchMediaProvider>
  </StrictMode>,
);
