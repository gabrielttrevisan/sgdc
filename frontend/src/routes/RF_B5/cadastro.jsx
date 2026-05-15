import { useNavigate, useParams } from "react-router";
import { useMemo, useState } from "react";

import Formulario from "./componentes/Formulario";
import "./css/cadastro.css";

function CadastroRFB5() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [erro, setErro] = useState("");

  const salaEditando = useMemo(() => {
    const dados = JSON.parse(localStorage.getItem("salas")) || [];
    return dados.find((s) => s.id === Number(id)) || null;
  }, [id]);

  function salvarSala(sala) {
    const cap = Number(sala.capacidade);

    if (!sala.nome.trim() || !sala.capacidade || cap <= 0) {
      setErro("Preencha os campos corretamente (nome e capacidade > 0)");
      return;
    }

    const dados = JSON.parse(localStorage.getItem("salas")) || [];

    let novaLista;

    if (id) {
      novaLista = dados.map((s) =>
        s.id === Number(id) ? { ...sala, id: Number(id) } : s
      );
    } else {
      novaLista = [...dados, { ...sala, id: Date.now() }];
    }

    localStorage.setItem("salas", JSON.stringify(novaLista));

    navigate("/locais-de-armazenamento");
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
}

export default CadastroRFB5;