import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Toast from "../../components/toast/ToastStorage";
import ProductsService from "../../service/ProductsService";
import ProductsForm from "./componentes/ProductsForm";
import "./css/products.css";

export default function Products() {
  const [modalAberto, setModalAberto] = useState(false);
  const [modalVisualizacao, setModalVisualizacao] = useState(false);
  const [produtoVisualizacao, setProdutoVisualizacao] = useState(null);

  const produtoInicial = {
    nome: "",
    unidade: "",
    perecivel: false,
    refrigeracao: false,
    descricao: "",
  };

  const [produto, setProduto] = useState(produtoInicial);

  const [produtos, setProdutos] = useState([]);

  const [editando, setEditando] = useState(false);

  const [indiceEditando, setIndiceEditando] = useState(null);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState("");

  const carregarProdutos = async () => {
    setCarregando(true);
    setErro("");

    const response = await ProductsService.list();

    if (response.error) {
      setErro(response.error.message || "Falha ao carregar produtos.");
      setProdutos([]);
    } else {
      setProdutos(response.data || []);
    }

    setCarregando(false);
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const fecharModal = () => {
    setModalAberto(false);
    setEditando(false);
    setIndiceEditando(null);
    setProduto(produtoInicial);
  };

  const visualizarProduto = (item) => {
    setProdutoVisualizacao(item);
    setModalVisualizacao(true);
  };

  const fecharVisualizacao = () => {
    setModalVisualizacao(false);
    setProdutoVisualizacao(null);
  };

  const salvarProduto = async () => {
    if (!produto.nome || !produto.unidade) {
      Toast.warn("Preencha nome e unidade antes de salvar.");
      return;
    }

    if (editando) {
      const response = await ProductsService.edit({ ...produto, id: produtos[indiceEditando]?.id });

      if (response.error) {
        Toast.error(response.error.message || "Erro ao atualizar produto.");
        return;
      }

      const novaLista = [...produtos];
      novaLista[indiceEditando] = produto;

      setProdutos(novaLista);
      setEditando(false);
      setIndiceEditando(null);
      Toast.success("Produto atualizado com sucesso!");
    } else {
      const response = await ProductsService.create(produto);

      if (response.error) {
        Toast.error(response.error.message || "Erro ao cadastrar produto.");
        return;
      }

      const novoProduto = {
        ...produto,
        id: response.data?.id,
      };

      setProdutos([...produtos, novoProduto]);
      setIndiceEditando(null);
      Toast.success("Produto cadastrado com sucesso!");
    }

    setProduto(produtoInicial);
    setModalAberto(false);
  };

  const excluirProduto = async (index) => {
    const confirmar = window.confirm("Deseja excluir este produto?");

    if (!confirmar) return;

    const produtoParaExcluir = produtos[index];

    if (!produtoParaExcluir?.id) {
      setProdutos((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    const response = await ProductsService.delete(produtoParaExcluir.id);

    if (response.error) {
      Toast.error(response.error.message || "Erro ao excluir produto.");
      return;
    }

    Toast.success("Produto excluído com sucesso!");
    carregarProdutos();
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
          type="button"
          onClick={() => {
            setProduto(produtoInicial);
            setEditando(false);
            setIndiceEditando(null);
            setModalAberto(true);
          }}
        >
          + Novo Produto
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
          {carregando ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Carregando produtos...
              </td>
            </tr>
          ) : produtos.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                {erro || "Nenhum produto encontrado."}
              </td>
            </tr>
          ) : (
            produtos.map((item, index) => (
              <tr key={item.id ?? index}>
                <td>{item.nome}</td>
                <td>{item.unidade}</td>
                <td>{item.perecivel ? "Sim" : "Não"}</td>
                <td>{item.refrigeracao ? "Sim" : "Não"}</td>
                <td>{item.descricao}</td>
                <td className="acoes">
            
                  <button
                    type="button"
                    className="btn-visualizar"
                    onClick={() => visualizarProduto(item)}
                    title="Visualizar detalhes"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    className="btn-editar"
                    onClick={() => editarProduto(item, index)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="btn-excluir"
                    onClick={() => excluirProduto(index)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ProductsForm
        aberto={modalAberto}
        fechar={fecharModal}
        produto={produto}
        setProduto={setProduto}
        salvar={salvarProduto}
        editando={editando}
      />

      {modalVisualizacao && produtoVisualizacao && (
        <div className="modal-overlay" onClick={fecharVisualizacao}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Produto</h2>
              <button type="button" className="close-btn" onClick={fecharVisualizacao}>
                ✕
              </button>
            </div>

            <div className="detalhes-container">
              <div className="detalhe-item">
                <label>Nome do Produto:</label>
                <p>{produtoVisualizacao.nome}</p>
              </div>

              <div className="detalhe-item">
                <label>Unidade de Medida:</label>
                <p>{produtoVisualizacao.unidade}</p>
              </div>

              <div className="detalhe-item">
                <label>É Perecível:</label>
                <p>{produtoVisualizacao.perecivel ? "Sim" : "Não"}</p>
              </div>

              <div className="detalhe-item">
                <label>Necessita de Refrigeração:</label>
                <p>{produtoVisualizacao.refrigeracao ? "Sim" : "Não"}</p>
              </div>

              <div className="detalhe-item">
                <label>Descrição:</label>
                <p>{produtoVisualizacao.descricao || "Sem descrição"}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancelar" onClick={fecharVisualizacao}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}