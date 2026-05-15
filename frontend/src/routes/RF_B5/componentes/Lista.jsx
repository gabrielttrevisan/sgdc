import "../css/lista.css";

function Lista({ salas, onExcluir, onEditar }) {
  if (salas.length === 0) {
    return <p>Nenhuma sala cadastrada</p>;
  }

  return (
    <div className="lista">
      {salas.map((sala) => (
        <div key={sala.id} className="lista-item">

          <div className="lista-topo">
            <strong>{sala.nome}</strong>

            <span className="capacidade">
              Capacidade: {sala.capacidade}
            </span>
          </div>

          <p className="descricao">
            {sala.descricao || "Sem descrição cadastrada."}
          </p>

          <div className="lista-acoes">

            <button
              className="btn-editar"
              onClick={() => onEditar(sala)}
            >
              Editar
            </button>

            <button
              className="btn-excluir"
              onClick={() => onExcluir(sala.id)}
            >
              Excluir
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}

export default Lista;