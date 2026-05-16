import { useState } from "react";
import ProductsForm from "./componentes/ProductsForm";
import "./css/products.css";

export default function Products() {
  const [modalAberto, setModalAberto] = useState(false);

  const [produto, setProduto] = useState({
    nome: "",
    unidade: "",
    perecivel: false,
    refrigeracao: false,
    descricao: "",
  });

  const [produtos, setProdutos] = useState([]);

  const [editando, setEditando] = useState(false);

  const [indiceEditando, setIndiceEditando] = useState(null);

  const salvarProduto = () => {
    if (editando) {
      const novaLista = [...produtos];

      novaLista[indiceEditando] = produto;

      setProdutos(novaLista);

      setEditando(false);
      setIndiceEditando(null);
    } else {
      setProdutos([...produtos, produto]);
    }

    setProduto({
      nome: "",
      unidade: "",
      perecivel: false,
      refrigeracao: false,
      descricao: "",
    });

    setModalAberto(false);
  };

  const excluirProduto = (index) => {
  const confirmar = window.confirm(
    "Deseja excluir este produto?"
  );

  if (!confirmar) return;

  const novaLista = produtos.filter((_, i) => i !== index);

  setProdutos(novaLista);
};

  const editarProduto = (item, index) => {
    setProduto(item);

    setEditando(true);

    setIndiceEditando(index);

    setModalAberto(true);
  };

  return (
    <div className="products-container">
      <div className="topo-produtos">
        <h1>Produtos</h1>

        <button
          onClick={() => {
            setProduto({
              nome: "",
              unidade: "",
              perecivel: false,
              refrigeracao: false,
              descricao: "",
            });

            setEditando(false);

            setModalAberto(true);
          }}
        >
          Novo Produto
        </button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Unidade</th>
            <th>Perecível</th>
            <th>Refrigeração</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td>{item.unidade}</td>
              <td>{item.perecivel ? "Sim" : "Não"}</td>
              <td>{item.refrigeracao ? "Sim" : "Não"}</td>
              <td>{item.descricao}</td>

              <td className="acoes">
                <button
                  className="btn-editar"
                  onClick={() => editarProduto(item, index)}
                >
                  Editar
                </button>

                <button
                  className="btn-excluir"
                  onClick={() => excluirProduto(index)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductsForm
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        produto={produto}
        setProduto={setProduto}
        salvar={salvarProduto}
        editando={editando}
      />
    </div>
  );
}