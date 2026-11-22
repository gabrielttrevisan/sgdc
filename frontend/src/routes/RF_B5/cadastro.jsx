import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import Formulario from "./componentes/Formulario";
import { authStore } from "../../store/Auth.store";

import "./css/cadastro.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3004/"
).replace(/\/+$/, "");

function getApiError(payload, fallback) {
  return (
    payload?.error?.issues?.[0]?.description ||
    payload?.error?.message ||
    payload?.message ||
    fallback
  );
}

const CadastroRFB5 = WithAuthGuard(function CadastroRFB5() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [erro, setErro] = useState("");

  const [salaEditando, setSalaEditando] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function carregarSala() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/salas/${id}`,
          {
            headers: authStore.getHeaders(),
          },
        );

        const json = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(getApiError(json, "Erro ao carregar sala."));
        }

        setSalaEditando(json?.data ?? json);
      } catch (error) {
        console.error("Erro ao carregar sala:", error);
        setErro(error.message || "Erro ao carregar sala.");
      }
    }

    carregarSala();
  }, [id]);

  async function salvarSala(sala) {
    const cap = Number(sala.capacidade);

    if (!sala.nome.trim() || !Number.isSafeInteger(cap) || cap <= 0) {
      setErro("Preencha os campos corretamente");

      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/salas${id ? `/${id}` : ""}`,

        {
          method: id ? "PATCH" : "POST",

          headers: {
            "Content-Type": "application/json",
            ...authStore.getHeaders(),
          },

          body: JSON.stringify({
            nome: sala.nome.trim(),
            capacidade: cap,
            descricao: sala.descricao,
          }),
        },
      );

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(getApiError(payload, "Falha ao salvar a sala."));
      }

      navigate("/locais-de-armazenamento");
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
      setErro(error.message || "Erro ao salvar sala.");
    }
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h3 className="cadastro-title">
          {id ? "Alterar Sala" : "Cadastro de Sala"}
        </h3>

        {erro && <p className="cadastro-erro">{erro}</p>}

        <Formulario
          sala={salaEditando}
          onSalvar={salvarSala}
          erro={setErro}
          fechar={() => navigate("/locais-de-armazenamento")}
        />
      </div>
    </div>
  );
});

export default CadastroRFB5;
