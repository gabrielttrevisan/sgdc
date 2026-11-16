import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from "./components/layout/Layout.jsx";
import { Volunteers } from "./routes/Volunteers/Volunteers.jsx";
import { Beneficiaries } from "./routes/beneficiaries/Beneficiaries.jsx";
import BeneficiaryForm from "./routes/beneficiaries/BeneficiaryForm.jsx";
import BeneficiaryDetails from "./routes/beneficiaries/BeneficiaryDetails.jsx";
import Armaz from "./routes/RF_B5/armaz.jsx";
import CadastroRFB5 from "./routes/RF_B5/cadastro.jsx";
import App from "./components/App.jsx";
import { MatchMediaProvider } from "./components/media-query/MatchMediaProvider.jsx";
import { AllocationTypes } from "./routes/allocation-types/AllocationTypes.jsx";
import { MeasuringUnits } from "./routes/measuring-units/MeasuringUnits.jsx";
import Products from "./routes/products/Products.jsx";
import ProductForm from "./routes/products/ProductForm.jsx";
import ProductDetails from "./routes/products/ProductDetails.jsx";
import { Families } from "./routes/families/Families.jsx";
import FamilyForm from "./routes/families/FamilyForm.jsx";
import FamilyDetails from "./routes/families/FamilyDetails.jsx";
import MeasuringUnitsForm from "./routes/measuring-units/MeasuringUnitsForm.jsx";
import MeasuringUnitsDetails from "./routes/measuring-units/MeasuringUnitsDetails.jsx";
import SignInForm from "./routes/auth/SignIn.jsx";
import ResetPasswordForm from "./routes/auth/ResetPassword.jsx";
import { AuthGuard } from "./components/auth/AuthGuard.jsx";
import { NotFoundPage } from "./routes/not-found/NotFoundPage.jsx";
import { Users } from "./routes/users/Users.jsx";
import CreateUsersForm from "./routes/users/CreateUsersForm.jsx";
import EditUserForm from "./routes/users/EditUserForm.jsx";
import UserDetailsForm from "./routes/users/UserDetailsForm.jsx";
import { Roles } from "./routes/roles/Roles.jsx";
import RolesForm from "./routes/roles/RolesForm.jsx";
import RoleDetailsForm from "./routes/roles/RoleDetailsForm.jsx";
import { ErrorBoundary } from "./components/error-boundary/ErrorBoundary.jsx";
import CreateVolunteerForm from "./routes/Volunteers/VolunteerForm.jsx";
import EditVolunteerForm from "./routes/Volunteers/VolunteerForm.jsx";
import VolunteerDetailsForm from "./routes/Volunteers/VolunteersDetails.jsx";
import { Arrecadacoes } from "./routes/arrecadacoes/Arrecadacoes.jsx";
import { Bills } from "./routes/bills/Bills.jsx";
import CreateBillForm from "./routes/bills/CreateBillForm.jsx";
import CancelBillForm from "./routes/bills/CancelBillForm.jsx";
import ShowBillForm from "./routes/bills/ShowBillForm.jsx";
import { Allocations } from "./routes/allocations/Allocations.jsx";
import AllocationForm from "./routes/allocations/AllocationForm.jsx";
import AllocationDetails from "./routes/allocations/AllocationDetails.jsx";

import PayBillForm from "./routes/bills/PayBillForm.jsx";
import { InStockProducts } from "./routes/in-stock-products/InStockProducts.jsx";
import { InStockProductDetails } from "./routes/in-stock-products/InStockProductDetails.jsx";

import { ToastTray } from "./components/toast/ToastTray.jsx";
import "./index.css";
import { SelectProducts } from "./routes/products/SelectProducts.jsx";
import AttendanceForm from "./routes/attendance/AttendanceForm.jsx";
import { Attendances } from "./routes/attendance/Attendances.jsx";
import AttendanceDetails from "./routes/attendance/AttendanceDetails.jsx";
import EditAttendanceForm from "./routes/attendance/EditAttendanceForm.jsx";
import CancelAttendanceForm from "./routes/attendance/CancelAttendanceForm.jsx";
import DonationForm from "./routes/donations/DonationForm.jsx";
import { SelectInStockProducts } from "./routes/in-stock-products/SelectInStockProducts.jsx";
import { Donations } from "./routes/donations/Donations.jsx";
import DonationDetails from "./routes/donations/DonationDetails.jsx";
import DiscardForm from "./routes/discards/DiscardForm.jsx";
import { Discards } from "./routes/discards/Discards.jsx";
import DiscardDetails from "./routes/discards/DiscardDetails.jsx";
import { SelectVolunteers } from "./routes/discards/SelectVolunteers.jsx";
import { Goals } from "./routes/goals/Goals.jsx";
import GoalForm from "./routes/goals/GoalForm.jsx";
import GoalDetails from "./routes/goals/GoalDetails.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MatchMediaProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route
            path="/reset-password"
            element={<ResetPasswordForm />}
          />
          <Route ErrorBoundary={ErrorBoundary} />

          <Route element={<Layout />}>
            <Route
              path="/produtos-em-estoque/:id/visualizar"
              element={<InStockProductDetails />}
            />
            <Route
              path="/produtos-em-estoque"
              element={<InStockProducts />}
            />

            <Route path="/arrecadacoes" element={<Arrecadacoes />} />
            <Route
              path="/doacoes/cadastrar/:beneficiaryId"
              element={<DonationForm />}
            />
            <Route
              path="/doacoes/:id/visualizar"
              element={<DonationDetails />}
            />
            <Route path="/doacoes" element={<Donations />} />
            <Route
              path="/produtos-em-estoque/selecionar"
              element={<SelectInStockProducts />}
            />
            <Route
              path="/produtos-em-estoque/selecionar-descarte"
              element={<SelectInStockProducts />}
            />
            <Route path="/descartes/cadastrar" element={<DiscardForm />} />
            <Route path="/descartes" element={<Discards />} />
            <Route
              path="/descartes/:id/visualizar"
              element={<DiscardDetails />}
            />
            <Route
              path="/voluntarios/selecionar"
              element={<SelectVolunteers />}
            />

            <Route path="/" element={<AuthGuard />} />
            <Route path="/locais-de-armazenamento" element={<Armaz />} />
            <Route
              path="/locais-de-armazenamento/cadastro/:id?"
              element={<CadastroRFB5 />}
            />

            <Route path="/produtos" element={<Products />} />
            <Route path="/produtos/cadastrar" element={<ProductForm />} />
            <Route path="/produtos/selecionar" element={<SelectProducts />} />
            <Route
              path="/produtos/:id/visualizar"
              element={<ProductDetails />}
            />
            <Route path="/produtos/:id" element={<ProductForm />} />
            <Route path="/metas" element={<Goals />} />
            <Route path="/metas/cadastrar" element={<GoalForm />} />
            <Route path="/metas/:id/visualizar" element={<GoalDetails />} />

            <Route path="/unidades-de-medida" element={<MeasuringUnits />} />
            <Route
              path="/unidades-de-medida/cadastrar"
              element={<MeasuringUnitsForm />}
            />
            <Route
              path="/unidades-de-medida/:id/visualizar"
              element={<MeasuringUnitsDetails />}
            />
            <Route
              path="/unidades-de-medida/:id"
              element={<MeasuringUnitsForm />}
            />

            <Route path="/tipos-de-alocacao" element={<AllocationTypes />} />
            <Route path="/niveis-de-acesso" element={<Roles />} />
            <Route path="/niveis-de-acesso/cadastrar" element={<RolesForm />} />
            <Route
              path="/niveis-de-acesso/:id/visualizar"
              element={<RoleDetailsForm />}
            />
            <Route path="/niveis-de-acesso/:id" element={<RolesForm />} />

            <Route path="/contas-a-pagar" element={<Bills />} />
            <Route path="/contas-a-pagar/lancar" element={<CreateBillForm />} />
            <Route
              path="/contas-a-pagar/:id/baixa"
              element={<PayBillForm />}
            />
            <Route
              path="/contas-a-pagar/:id/cancelar"
              element={<CancelBillForm />}
            />
            <Route
              path="/contas-a-pagar/:id/visualizar"
              element={<ShowBillForm />}
            />

            <Route path="/beneficiarios" element={<Beneficiaries />} />
            <Route
              path="/beneficiarios/cadastrar"
              element={<BeneficiaryForm />}
            />
            <Route
              path="/beneficiarios/:id/visualizar"
              element={<BeneficiaryDetails />}
            />
            <Route path="/beneficiarios/:id" element={<BeneficiaryForm />} />
            <Route path="/familias" element={<Families />} />
            <Route path="/familias/cadastrar" element={<FamilyForm />} />
            <Route
              path="/atendimentos"
              element={<Attendances />}
            />
            <Route
              path="/atendimentos/cadastrar/:id"
              element={<AttendanceForm />}
            />
            <Route
              path="/atendimentos/cancelar"
              element={<CancelAttendanceForm />}
            />
            <Route
              path="/atendimentos/:id/visualizar"
              element={<AttendanceDetails />}
            />
            <Route
              path="/atendimento/:id"
              element={<EditAttendanceForm />}
            />
            <Route
              path="/familias/:id/visualizar"
              element={<FamilyDetails />}
            />
            <Route path="/familias/:id" element={<FamilyForm />} />
            <Route path="/doadores" element={<App />} />

            <Route path="/voluntarios" element={<Volunteers />} />
            <Route
              path="/voluntarios/cadastrar"
              element={<CreateVolunteerForm />}
            />
            <Route
              path="/voluntarios/:id/visualizar"
              element={<VolunteerDetailsForm />}
            />
            <Route path="/voluntarios/:id" element={<EditVolunteerForm />} />

            <Route path="/alocacoes" element={<Allocations />} />
            <Route path="/alocacoes/cadastrar" element={<AllocationForm />} />
            <Route
              path="/alocacoes/voluntario/:volunteerId"
              element={<AllocationForm />}
            />
            <Route
              path="/alocacoes/:id/visualizar"
              element={<AllocationDetails />}
            />
            <Route path="/alocacoes/:id" element={<AllocationForm />} />

            <Route path="/usuarios" element={<Users />} />
            <Route path="/usuarios/cadastrar" element={<CreateUsersForm />} />
            <Route
              path="/usuarios/:id/visualizar"
              element={<UserDetailsForm />}
            />
            <Route path="/usuarios/:id" element={<EditUserForm />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      
      <ToastTray />
    </MatchMediaProvider>
  </StrictMode>,
);
