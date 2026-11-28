import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { SearchIcon } from "../../components/icons/SearchIcon";
import { authStore } from "../../store/Auth.store";

import "./Arrecadacoes.css";

<<<<<<< HEAD
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3004/"
).replace(/\/?$/, "/");

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authStore.getHeaders(),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      payload?.error?.message ||
        payload?.message ||
        payload?.error ||
        "Não foi possível carregar os dados necessários.",
    );
    error.status = response.status;
    error.code = payload?.error?.code;
    throw error;
  }

  return payload?.data ?? payload;
}

async function loadPaginatedItems(path) {
  const perPage = 100;
  const items = [];
  let page = 1;
  let totalPages;

  do {
    let result;
    try {
      result = await requestJson(`${path}?page=${page}&perPage=${perPage}`);
    } catch (error) {
      if (
        path === "products" &&
        error.status === 404 &&
        error.code === "NOT_FOUND"
      )
        return [];
      throw error;
    }

    const pageData = Array.isArray(result) ? { items: result } : result;
    if (!Array.isArray(pageData?.items))
      throw new Error("O servidor retornou uma lista inválida.");

    items.push(...pageData.items);
    totalPages = Number(pageData.totalPages) || 1;
    page += 1;
  } while (page <= totalPages);

  return items;
}

function getId(record) {
  return record.id ?? record.ID;
}

function getName(record) {
  return record.name ?? record.NAME ?? record.nome ?? record.NOME ?? "";
=======
const API_URL = import.meta.env.VITE_API_URL;

function getId(item) {
  return item?.id ?? item?.ID;
}

function getName(item) {
  return item?.name ?? item?.nome ?? item?.NAME ?? "";
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
}

export function Arrecadacoes() {
  const navigate = useNavigate();
  const [doadores, setDoadores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [doadorId, setDoadorId] = useState("");
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  async function carregarOpcoes() {
    setCarregando(true);
    setErro("");

    try {
<<<<<<< HEAD
      const [doadoresData, produtosData, salasData] = await Promise.all([
        requestJson("donors"),
        loadPaginatedItems("products"),
        loadPaginatedItems("salas"),
      ]);

      if (!Array.isArray(doadoresData))
        throw new Error("O servidor retornou uma lista de doadores inválida.");

      setDoadores(doadoresData);
      setProdutos(produtosData);
      setSalas(salasData);
    } catch (loadError) {
      console.error("Erro ao carregar dados da arrecadação:", loadError);
      setErro(
        loadError.message || "Não foi possível carregar os dados necessários.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarOpcoes();
  }, []);

  const produtosFiltrados = useMemo(() => {
    const busca = termoBusca.trim().toLocaleLowerCase("pt-BR");

    return produtos.filter((produto) =>
      getName(produto).toLocaleLowerCase("pt-BR").includes(busca),
    );
  }, [produtos, termoBusca]);

  function adicionarProduto(produto) {
    setItens((atuais) => [
      ...atuais,
      {
        productId: String(getId(produto)),
        quantidade: 1,
        salaId: salas.length ? String(getId(salas[0])) : "",
        dataVencimento: "",
      },
    ]);
    setTermoBusca("");
  }

  function atualizarItem(index, campo, valor) {
    setItens((atuais) =>
      atuais.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [campo]: valor } : item,
      ),
    );
  }

  function removerItem(index) {
    setItens((atuais) => atuais.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (!doadorId) {
      setErro("Selecione um doador.");
      return;
    }

    if (itens.length === 0) {
      setErro("Adicione pelo menos um produto à arrecadação.");
      return;
    }

    if (
      itens.some(
        (item) =>
          !Number.isSafeInteger(Number(item.quantidade)) ||
          Number(item.quantidade) <= 0 ||
          !item.salaId ||
          !item.dataVencimento,
      )
    ) {
      setErro(
        "Informe uma quantidade válida, o armazenamento e o vencimento de todos os produtos.",
      );
      return;
    }

    try {
      setEnviando(true);
      const result = await requestJson("arrecadacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doadorId: Number(doadorId),
          itens: itens.map((item) => ({
            productId: Number(item.productId),
            quantidade: Number(item.quantidade),
            salaId: Number(item.salaId),
            dataVencimento: item.dataVencimento,
          })),
        }),
      });

      setMensagem(result?.message || "Arrecadação lançada com sucesso!");
      setDoadorId("");
      setItens([]);
      setBuscaAberta(false);
    } catch (submitError) {
      console.error("Erro ao lançar arrecadação:", submitError);
      setErro(submitError.message || "Não foi possível lançar a arrecadação.");
=======
      const respostas = await Promise.all([
        fetch(`${API_URL}donors`, { headers: authStore.getHeaders() }),
        fetch(`${API_URL}products?perPage=100`, {
          headers: authStore.getHeaders(),
        }),
        fetch(`${API_URL}salas?perPage=100`, {
          headers: authStore.getHeaders(),
        }),
      ]);

      const dados = await Promise.all(
        respostas.map(async (response) => {
          const json = await response.json().catch(() => null);
          if (!response.ok) {
            throw new Error(
              json?.message ||
                json?.error?.message ||
                json?.error ||
                "Não foi possível carregar os dados da arrecadação.",
            );
          }
          return json;
        }),
      );

      setDoadores(Array.isArray(dados[0]) ? dados[0] : []);
      setProdutos(
        Array.isArray(dados[1]?.data?.items) ? dados[1].data.items : [],
      );
      setSalas(Array.isArray(dados[2]?.data?.items) ? dados[2].data.items : []);
    } catch (error) {
      console.error("Erro ao carregar dados da arrecadação:", error);
      setErro(
        error.message || "Não foi possível carregar os dados da arrecadação.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarOpcoes();
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLocaleLowerCase("pt-BR");
    if (!termo) return produtos;

    return produtos.filter((produto) =>
      getName(produto).toLocaleLowerCase("pt-BR").includes(termo),
    );
  }, [produtos, termoBusca]);

  function adicionarProduto(produto) {
    const productId = getId(produto);
    setItens((atuais) => {
      const existente = atuais.find((item) => item.productId === productId);
      if (existente) {
        return atuais.map((item) =>
          item.productId === productId
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      }

      return [
        ...atuais,
        {
          chave: `${productId}-${Date.now()}`,
          productId,
          quantidade: 1,
          salaId: "",
          dataVencimento: "",
        },
      ];
    });
  }

  function atualizarItem(chave, campo, valor) {
    setItens((atuais) =>
      atuais.map((item) =>
        item.chave === chave
          ? {
              ...item,
              [campo]:
                campo === "quantidade" || campo === "salaId"
                  ? String(valor)
                  : valor,
            }
          : item,
      ),
    );
  }

  function removerItem(chave) {
    setItens((atuais) => atuais.filter((item) => item.chave !== chave));
  }

  function alterarQuantidade(chave, diferenca) {
    setItens((atuais) =>
      atuais.map((item) =>
        item.chave === chave
          ? {
              ...item,
              quantidade: Math.max(
                1,
                (Number(item.quantidade) || 1) + diferenca,
              ),
            }
          : item,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (!doadorId) {
      setErro("Selecione um doador.");
      return;
    }

    if (itens.length === 0) {
      setErro("Adicione pelo menos um produto à arrecadação.");
      return;
    }

    const itensInvalidos = itens.find(
      (item) =>
        !item.salaId ||
        !item.dataVencimento ||
        !Number.isSafeInteger(Number(item.quantidade)) ||
        Number(item.quantidade) <= 0,
    );

    if (itensInvalidos) {
      setErro(
        "Informe uma quantidade válida, local de armazenamento e data de vencimento para todos os produtos.",
      );
      return;
    }

    try {
      setEnviando(true);

      const response = await fetch(`${API_URL}arrecadacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authStore.getHeaders(),
        },
        body: JSON.stringify({
          doadorId: Number(doadorId),
          itens: itens.map((item) => ({
            productId: item.productId,
            quantidade: Number(item.quantidade),
            salaId: Number(item.salaId),
            dataVencimento: item.dataVencimento,
          })),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error?.message ||
            data?.error ||
            "Não foi possível lançar a arrecadação.",
        );
      }

      setMensagem(data?.message || "Arrecadação lançada com sucesso!");
      setDoadorId("");
      setItens([]);
      setBuscaAberta(false);
      setTermoBusca("");
    } catch (error) {
      console.error("Erro ao lançar arrecadação:", error);
      setErro(error.message || "Não foi possível lançar a arrecadação.");
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="arrecadacoes-page">
      <form className="arrecadacao-lancamento" onSubmit={handleSubmit}>
        <header className="arrecadacao-lancamento__header">
          <div className="arrecadacao-lancamento__breadcrumbs">
            <span>Donativos</span>
            <span aria-hidden="true">›</span>
            <span>Arrecadações</span>
            <span aria-hidden="true">›</span>
            <h1>Lançamento</h1>
          </div>
          <div className="arrecadacao-lancamento__actions">
            <button
              className="arrecadacao-lancamento__cancel"
              type="button"
              onClick={() => navigate(-1)}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              className="arrecadacao-lancamento__submit"
              type="submit"
              disabled={enviando || carregando}
            >
              {enviando ? "Lançando..." : "Lançar"}
            </button>
          </div>
        </header>

<<<<<<< HEAD
        {mensagem && (
          <div className="arrecadacao-lancamento__notice" role="status">
            {mensagem}
          </div>
        )}
        {erro && (
          <div
            className="arrecadacao-lancamento__notice arrecadacao-lancamento__notice--error"
            role="alert"
          >
            {erro}
            {carregando ? null : (
              <button type="button" onClick={carregarOpcoes}>
                Tentar novamente
              </button>
            )}
          </div>
        )}
        {!carregando && (!produtos.length || !salas.length) && (
          <div className="arrecadacao-lancamento__notice" role="status">
            {!produtos.length && (
              <>
                Cadastre ao menos um <Link to="/produtos">produto</Link>.{" "}
              </>
            )}
            {!salas.length && (
              <>
                Cadastre ao menos um{" "}
                <Link to="/locais-de-armazenamento">
                  local de armazenamento
                </Link>
                .
              </>
            )}
=======
        {(mensagem || erro) && (
          <div
            className={`arrecadacao-lancamento__notice ${
              erro ? "arrecadacao-lancamento__notice--error" : ""
            }`}
            role={erro ? "alert" : "status"}
          >
            {erro || mensagem}
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
          </div>
        )}

        <div className="arrecadacao-lancamento__form">
          <label htmlFor="arrecadacao-doador">
            Doador <span>*</span>
          </label>
          <select
            id="arrecadacao-doador"
            value={doadorId}
            onChange={(event) => setDoadorId(event.target.value)}
            disabled={carregando || enviando}
            required
          >
            <option value="">
              {carregando
                ? "Carregando doadores..."
                : doadores.length
                  ? "Selecione um doador"
                  : "Nenhum doador cadastrado"}
            </option>
            {doadores.map((doador) => (
              <option key={getId(doador)} value={getId(doador)}>
                {getName(doador)}
              </option>
            ))}
          </select>

          <div className="arrecadacao-lancamento__items-heading">
            <span className="arrecadacao-lancamento__tag">DONATIVOS</span>
            <button
              className="arrecadacao-lancamento__search-button"
              type="button"
              aria-label={
                buscaAberta ? "Fechar busca de produtos" : "Buscar produtos"
              }
              aria-expanded={buscaAberta}
              onClick={() => {
                setBuscaAberta((open) => !open);
                setTermoBusca("");
              }}
              disabled={carregando || enviando || produtos.length === 0}
            >
              <SearchIcon />
            </button>
          </div>

          {buscaAberta && (
            <div className="arrecadacao-lancamento__product-search">
              <label htmlFor="arrecadacao-busca-produto">
                Adicionar produto
              </label>
              <input
                id="arrecadacao-busca-produto"
                type="search"
                autoFocus
                placeholder="Buscar produto..."
                value={termoBusca}
                onChange={(event) => setTermoBusca(event.target.value)}
                disabled={enviando}
              />
              <div className="arrecadacao-lancamento__product-results">
                {produtosFiltrados.length === 0 ? (
                  <p>Nenhum produto disponível para adicionar.</p>
                ) : (
                  produtosFiltrados.map((produto) => (
                    <button
                      key={getId(produto)}
                      type="button"
                      onClick={() => adicionarProduto(produto)}
                    >
                      {getName(produto)}
                      <span>Adicionar</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="arrecadacao-lancamento__table-wrap">
            <table className="arrecadacao-lancamento__table">
              <thead>
                <tr>
<<<<<<< HEAD
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Armazenamento</th>
=======
                  <th>
                    Produto <span>*</span>
                  </th>
                  <th>
                    Quantidade <span>*</span>
                  </th>
                  <th>
                    Local <span>*</span>
                  </th>
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                  <th>
                    Vencimento <span>*</span>
                  </th>
                  <th>
                    <span className="visually-hidden">Remover</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {itens.length === 0 ? (
                  <tr>
<<<<<<< HEAD
                    <td colSpan="5" className="arrecadacao-lancamento__empty">
                      {carregando
                        ? "Carregando produtos..."
                        : produtos.length
                          ? "Use a busca para adicionar produtos à arrecadação."
                          : "Nenhum produto cadastrado para arrecadação."}
                    </td>
                  </tr>
                ) : (
                  itens.map((item, index) => {
                    const produto = produtos.find(
                      (record) => String(getId(record)) === item.productId,
                    );
                    const nomeProduto = produto ? getName(produto) : "produto";

                    return (
                      <tr key={`${item.productId}-${index}`}>
                        <td>{produto ? getName(produto) : "Produto"}</td>
=======
                    <td
                      className="arrecadacao-lancamento__empty"
                      colSpan="5"
                    >
                      Nenhum produto adicionado.
                    </td>
                  </tr>
                ) : (
                  itens.map((item) => {
                    const produto = produtos.find(
                      (opcao) => getId(opcao) === item.productId,
                    );

                    return (
                      <tr key={item.chave}>
                        <td>{produto ? getName(produto) : item.productId}</td>
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                        <td>
                          <div className="arrecadacao-lancamento__quantity">
                            <button
                              type="button"
                              aria-label="Diminuir quantidade"
                              onClick={() =>
<<<<<<< HEAD
                                atualizarItem(
                                  index,
                                  "quantidade",
                                  Math.max(1, Number(item.quantidade) - 1),
                                )
=======
                                alterarQuantidade(item.chave, -1)
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                              }
                              disabled={enviando}
                            >
                              −
                            </button>
                            <input
<<<<<<< HEAD
                              aria-label={`Quantidade de ${nomeProduto}`}
=======
                              aria-label="Quantidade"
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                              type="number"
                              min="1"
                              step="1"
                              value={item.quantidade}
                              onChange={(event) =>
                                atualizarItem(
<<<<<<< HEAD
                                  index,
=======
                                  item.chave,
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                                  "quantidade",
                                  event.target.value,
                                )
                              }
<<<<<<< HEAD
                              required
=======
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                              disabled={enviando}
                            />
                            <button
                              type="button"
                              aria-label="Aumentar quantidade"
                              onClick={() =>
<<<<<<< HEAD
                                atualizarItem(
                                  index,
                                  "quantidade",
                                  Number(item.quantidade) + 1,
                                )
=======
                                alterarQuantidade(item.chave, 1)
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                              }
                              disabled={enviando}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>
                          <select
<<<<<<< HEAD
                            aria-label={`Armazenamento de ${nomeProduto}`}
                            value={item.salaId}
                            onChange={(event) =>
                              atualizarItem(index, "salaId", event.target.value)
                            }
                            required
                            disabled={enviando || salas.length === 0}
=======
                            aria-label="Local de armazenamento"
                            value={item.salaId}
                            onChange={(event) =>
                              atualizarItem(
                                item.chave,
                                "salaId",
                                event.target.value,
                              )
                            }
                            disabled={enviando}
                            required
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                          >
                            <option value="">Selecione</option>
                            {salas.map((sala) => (
                              <option key={getId(sala)} value={getId(sala)}>
                                {getName(sala)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
<<<<<<< HEAD
                            aria-label={`Vencimento de ${nomeProduto}`}
=======
                            aria-label="Data de vencimento"
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                            type="date"
                            value={item.dataVencimento}
                            onChange={(event) =>
                              atualizarItem(
<<<<<<< HEAD
                                index,
=======
                                item.chave,
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                                "dataVencimento",
                                event.target.value,
                              )
                            }
<<<<<<< HEAD
                            required
                            disabled={enviando}
=======
                            disabled={enviando}
                            required
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                          />
                        </td>
                        <td>
                          <button
                            className="arrecadacao-lancamento__remove"
                            type="button"
<<<<<<< HEAD
                            aria-label={`Remover ${nomeProduto}`}
                            onClick={() => removerItem(index)}
=======
                            aria-label="Remover produto"
                            onClick={() => removerItem(item.chave)}
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d
                            disabled={enviando}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </section>
  );
}
