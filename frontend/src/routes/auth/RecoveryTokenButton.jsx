import { useState } from "react";
import { useFormController } from "../../components/form/context/useFormController";
import Toast from "../../components/toast/ToastStorage";
import AuthService from "../../service/AuthService";

export default function RecoveryTokenButton() {
  const controller = useFormController();
  const [loading, setLoading] = useState(false);

  const handleRecovery = async () => {
    const user = controller.getFieldRef("user").value.trim();

    if (!user) {
      Toast.error("Informe seu e-mail, CPF ou nome de usuário");
      return;
    }

    setLoading(true);
    const response = await AuthService.requestRecoveryToken({ user });
    setLoading(false);

    if (response.data) {
      Toast.success(
        response.data.message ??
          "Se a conta existir, enviaremos instruções para o e-mail cadastrado.",
      );
    } else if (response.error) {
      Toast.error(
        response.error.issues?.[0]?.description ??
          response.error.message ??
          "Não foi possível solicitar a recuperação de senha",
      );
    } else {
      Toast.error("Não foi possível solicitar a recuperação de senha");
    }
  };

  const loadingClass = loading ? " --loading" : "";

  return (
    <button
      type="button"
      className={`button-block --link${loadingClass}`}
      onClick={handleRecovery}
    >
      <span>Recuperar senha</span>
      <span className="loading-label">Enviando Token...</span>
    </button>
  );
}
