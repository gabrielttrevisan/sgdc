import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Cabecalho from "./componentes/Cabecalho";
import Busca from "./componentes/Busca";
import Lista from "./componentes/Lista";

import "./css/armaz.css";

function Armaz() {
  const navigate = useNavigate();

  const [salas, setSalas] = useState(() => {
    const dados = localStorage.getItem("salas");
    try {
      return dados ? JSON.parse(dados) : [];
    } catch {
      return [];
    }
  });

  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    localStorage.setItem("salas", JSON.stringify(salas));
  }, [salas]);

  function excluirSala(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta sala?");
    if (!confirmar) return;

    setSalas((prev) => prev.filter((s) => s.id !== id));

    setMensagem("Sala excluída com sucesso.");
    setTimeout(() => setMensagem(""), 2500);
  }

  const salasFiltradas = salas.filter((s) =>
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <Cabecalho />

        <div className="armaz-header">
          <div className="armaz-search">
            <Busca setBusca={setBusca} />
          </div>

          <button
            className="btn-cadastrar"
            onClick={() =>
              navigate("/locais-de-armazenamento/cadastro")
            }
          >
            Cadastrar
          </button>
        </div>

        {mensagem && (
          <div className="alert alert-warning mt-3">
            {mensagem}
          </div>
        )}

        <Lista
          salas={salasFiltradas}
          onExcluir={excluirSala}
          onEditar={(sala) =>
            navigate(`/locais-de-armazenamento/cadastro/${sala.id}`)
          }
        />
      </div>
    </div>
  );
}

export default Armaz;