import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Cabecalho from "./componentes/Cabecalho";
import Busca from "./componentes/Busca";
import Lista from "./componentes/Lista";

import "./css/armaz.css";
import "./css/cadastro.css";

function Armaz() {
  const navigate = useNavigate();

  const [salas, setSalas] = useState([]);
  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [modalExcluir, setModalExcluir] = useState(false);
  const [salaParaExcluir, setSalaParaExcluir] = useState(null);

  async function carregarSalas() {
    try {
      const response = await fetch(
        `http://localhost:3004/salas?q=${busca}`
      );

      const json = await response.json();

      const ordenadas = json.data.items.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR")
      );

      setSalas(ordenadas);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    carregarSalas();
  }, [busca]);

  function abrirModalExcluir(id) {
    setSalaParaExcluir(id);
    setModalExcluir(true);
  }

  function fecharModalExcluir() {
    setModalExcluir(false);
    setSalaParaExcluir(null);
  }

  async function excluirSala() {
    try {
      await fetch(
        `http://localhost:3004/salas/${salaParaExcluir}`,
        { method: "DELETE" }
      );

      carregarSalas();

      setMensagem("Sala excluída com sucesso.");

      setTimeout(() => {
        setMensagem("");
      }, 2500);
    } catch (error) {
      console.error(error);
    } finally {
      fecharModalExcluir();
    }
  }

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
            + Cadastrar
          </button>
        </div>

        {mensagem && (
          <div className="alert alert-warning mt-3">
            {mensagem}
          </div>
        )}

        <Lista
          salas={salas}
          onExcluir={abrirModalExcluir}
          onEditar={(sala) =>
            navigate(
              `/locais-de-armazenamento/cadastro/${sala.id}`
            )
          }
        />
      </div>

      {modalExcluir && (
        <div className="modal-overlay">
          <div className="cadastro-card modal-card">
            <h2 className="cadastro-title">
              Confirmar exclusão
            </h2>

            <p>Tem certeza que deseja excluir esta sala?</p>

            <div className="modal-botoes">
              <button
                className="modal-btn-cancelar"
                onClick={fecharModalExcluir}
              >
                Cancelar
              </button>

              <button
                className="modal-btn-excluir"
                onClick={excluirSala}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Armaz;