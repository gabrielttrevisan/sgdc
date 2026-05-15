import { useState } from "react";

function Formulario({ sala, onSalvar, fechar, erro }) {
  const [nome, setNome] = useState(sala?.nome || "");
  const [capacidade, setCapacidade] = useState(sala?.capacidade || "");
  const [descricao, setDescricao] = useState(sala?.descricao || "");

  function handleSubmit(e) {
    e.preventDefault();

    const cap = Number(capacidade);

    if (!nome.trim() || !capacidade || cap <= 0) {
      erro("Preencha Nome e Capacidade corretamente");
      return;
    }

    onSalvar({
      id: sala?.id,
      nome,
      capacidade: cap,
      descricao
    });

    erro("");
  }

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="Capacidade"
        value={capacidade}
        onChange={(e) =>
          setCapacidade(e.target.value.replace(/\D/g, ""))
        }
      />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <div className="botoes">
        <button
          type="submit"
          className={sala ? "btn-salvar editar" : "btn-salvar"}>
          {sala ? "Alterar" : "Salvar"}
        </button>

        <button type="button" className="btn-cancelar" onClick={fechar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default Formulario;