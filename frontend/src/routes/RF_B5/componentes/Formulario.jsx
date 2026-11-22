import { useEffect, useState } from "react";

function Formulario({ sala, onSalvar, fechar, erro }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    setNome(sala?.nome || "");
    setDescricao(sala?.descricao || "");
  }, [sala]);

  function handleSubmit(event) {
    event.preventDefault();

    if (nome.trim().length < 3) {
      erro("Informe um nome com pelo menos 3 caracteres");
      return;
    }

    onSalvar({
      id: sala?.id,
      nome: nome.trim(),
      descricao,
    });

    erro("");
  }

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <input
        placeholder="Nome"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(event) => setDescricao(event.target.value)}
      />

      <div className="botoes">
        <button
          type="submit"
          className={sala ? "btn-salvar editar" : "btn-salvar"}
        >
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
