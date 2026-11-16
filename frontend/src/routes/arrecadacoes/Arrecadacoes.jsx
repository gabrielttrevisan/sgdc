import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { SearchIcon } from "../../components/icons/SearchIcon";
import { authStore } from "../../store/Auth.store";

import "./Arrecadacoes.css";

const API_URL = "http://localhost:3004/arrecadacoes";
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const dateFormatter = new Intl.DateTimeFormat("pt-BR");

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(
    typeof value === "string" ? `${value.slice(0, 10)}T00:00:00` : value,
  );
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
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
  const [mensagemErro, setMensagemErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [arrecadacaoEmEdicao, setArrecadacaoEmEdicao] = useState(null);
  const [arrecadacaoEmVisualizacao, setArrecadacaoEmVisualizacao] = useState(null);

    async function carregarOpcoes() {
      setCarregando(true);
      setErro("");

    try {
      const response = await fetch(API_URL, {
        headers: authStore.getHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Não foi possível carregar as arrecadações.",
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("O servidor retornou uma lista de arrecadações inválida.");
      }

      setArrecadacoes(data);
    } catch (error) {
      console.error("Erro ao carregar arrecadações:", error);
      setErro(error.message || "Não foi possível carregar as arrecadações.");
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

      {mensagem && (
        <div className="arrecadacoes-page__notice" role="status">
          {mensagem}
        </div>
      )}
      {mensagemErro && (
        <div className="arrecadacoes-page__notice arrecadacoes-page__notice--error" role="alert">
          {mensagemErro}
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
              aria-label={buscaAberta ? "Fechar busca de produtos" : "Buscar produtos"}
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
              <label htmlFor="arrecadacao-busca-produto">Adicionar produto</label>
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

      <div className="arrecadacoes-page__table-wrap">
        <table className="arrecadacoes-page__table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor</th>
              <th>Tipo de arrecadação</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan="5" className="arrecadacoes-page__state">
                  Carregando arrecadações...
                </td>
              </tr>
            ) : erro ? (
              <tr>
                <td colSpan="5" className="arrecadacoes-page__state arrecadacoes-page__state--error">
                  {erro}
                  <button type="button" onClick={carregarArrecadacoes}>
                    Tentar novamente
                  </button>
                </td>
              </tr>
            ) : arrecadacoes.length === 0 ? (
              <tr>
                <td colSpan="5" className="arrecadacoes-page__state">
                  Nenhuma arrecadação registrada.
                </td>
              </tr>
            ) : (
              arrecadacoes.map((arrecadacao) => (
                <tr key={arrecadacao.id}>
                  <td>{formatDate(arrecadacao.dataArrecadacao)}</td>
                  <td className="arrecadacoes-page__amount">
                    {currencyFormatter.format(Number(arrecadacao.valor))}
                  </td>
                  <td>{arrecadacao.tipoArrecadacao}</td>
                  <td>{arrecadacao.descricao || "—"}</td>
                  <td className="arrecadacoes-page__actions">
                    <button
                      type="button"
                      className="arrecadacoes-page__edit"
                      onClick={() => {
                        setArrecadacaoEmEdicao(arrecadacao);
                        setArrecadacaoEmVisualizacao(null);
                        setModalAberto(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="arrecadacoes-page__show"
                      onClick={() => {
                        setArrecadacaoEmEdicao(null);
                        setArrecadacaoEmVisualizacao(arrecadacao);
                        setModalAberto(true);
                      }}
                      title="Visualizar arrecadação"
                      aria-label="Visualizar arrecadação"
                    >
                      <ShowIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ArrecadacaoModal
        isOpen={modalAberto}
        editingArrecadacao={arrecadacaoEmEdicao || arrecadacaoEmVisualizacao}
        viewMode={Boolean(arrecadacaoEmVisualizacao)}
        categoriasArrecadacao={arrecadacoes
          .map((arrecadacao) => arrecadacao.tipoArrecadacao)
          .filter(Boolean)}
        onClose={() => {
          setModalAberto(false);
          setArrecadacaoEmEdicao(null);
          setArrecadacaoEmVisualizacao(null);
        }}
        onSuccess={(novaMensagem) => {
          setMensagem(novaMensagem);
          setMensagemErro("");
          void carregarArrecadacoes();
        }}
      />
    </section>
  );
}
