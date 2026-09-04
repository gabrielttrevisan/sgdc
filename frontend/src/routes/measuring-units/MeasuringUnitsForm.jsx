import { useNavigate, useParams } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { InputHidden } from "../../components/form/input-field/InputHidden";
import { Form } from "../../components/form/Form";
import { FormModalCancelButton } from "../../components/form/modal/button/FormModalCancelButton";
import { FormModalSubmitButton } from "../../components/form/modal/button/FormModalSubmitButton";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider";
import MeasuringUnitsService from "../../service/MeasuringTypesService";
import Toast from "../../components/toast/ToastStorage";
import { WithAuthGuard } from "../../auth/WithAuthGuard.hoc";

import "./InlineForm.css";

export default WithAuthGuard(function MeasuringUnitsForm({ className = "" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const submitLabel = id ? "Atualizar Dados" : "Cadastrar";
  const variantClass = className ? `form-inline--${className}` : "";

  const handleSubmit = async (data) => {
    const response = await MeasuringUnitsService.create(data);

    if (response.data?.success) {
      Toast.success("Unidade de medida cadastrada com sucesso");
      navigate("/unidades-de-medida");
    } else if (response.error) {
      Toast.error("Falha ao cadastrar unidade de medida");
    }
  };

  return (
    <FormControllerProvider>
      <div className="form-inline__breadcrumbs">
        <div className="form-inline__breadcrumb-path">
          <h3>Unidades de Medida</h3>
        </div>

        <h2 className="form-inline__breadcrumb-path-current">Criar</h2>
      </div>

      <Form onSubmit={handleSubmit} className={`form-inline ${variantClass}`}>
        {id && <InputHidden name="id" id="id" value={id} />}

        <InputField
          name="name"
          required
          id="name"
          label="Nome"
          placeholder="Quilograma, litro, grama..."
          validate={(value) => {
            const trimmed = value.trim();

            if (trimmed.length === 0 || trimmed.length > 32)
              return "O nome não pode ser vazio ou ter mais que 32 caracteres";

            return true;
          }}
        />

        <InputField
          name="symbol"
          required
          id="symbol"
          label="Unidade de Medida (Abreviação/Símbolo)"
          placeholder="kg, g, l, ml..."
          variant="half-left"
          validate={(value) => {
            const trimmed = value.trim();

            if (trimmed.length === 0 || trimmed.length > 8)
              return "O nome não pode ser vazio ou ter mais que 8 caracteres";

            return true;
          }}
        />

        <footer>
          <FormModalCancelButton
            type="button"
            onClick={() => {}}
            className="button-block --outline --primary"
          >
            Cancelar
          </FormModalCancelButton>

          <FormModalSubmitButton>
            <span>{submitLabel}</span>
          </FormModalSubmitButton>
        </footer>
      </Form>
    </FormControllerProvider>
  );
})
