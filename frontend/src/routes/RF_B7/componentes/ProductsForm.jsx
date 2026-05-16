import "../css/products.css";

export default function ProductsForm({
  aberto,
  fechar,
  produto,
  setProduto,
  salvar,
  editando,
}) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Produto</h2>

          <button className="close-btn" onClick={fechar}>
            ✕
          </button>
        </div>

        <div className="form-group">
          <label>Nome do Produto *</label>

          <input
            type="text"
            value={produto.nome}
            onChange={(e) =>
              setProduto({
                ...produto,
                nome: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Unidade de Medida *</label>

          <select
            value={produto.unidade}
            onChange={(e) =>
              setProduto({
                ...produto,
                unidade: e.target.value,
              })
            }
          >
            <option value="">Selecione</option>
            <option value="Litros">Litros (l)</option>
            <option value="Kg">Kg</option>
            <option value="Unidade">Unidade</option>
          </select>
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={produto.perecivel}
              onChange={(e) =>
                setProduto({
                  ...produto,
                  perecivel: e.target.checked,
                })
              }
            />
            É perecível
          </label>

          <label>
            <input
              type="checkbox"
              checked={produto.refrigeracao}
              onChange={(e) =>
                setProduto({
                  ...produto,
                  refrigeracao: e.target.checked,
                })
              }
            />
            Necessita de refrigeração
          </label>
        </div>

        <div className="form-group">
          <label>Breve Descrição</label>

          <textarea
            value={produto.descricao}
            onChange={(e) =>
              setProduto({
                ...produto,
                descricao: e.target.value,
              })
            }
          />
        </div>

        <div className="modal-footer">
          <button className="cancelar" onClick={fechar}>
            Cancelar
          </button>

          <button className="salvar" onClick={salvar}>
            {editando ? "Atualizar" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}