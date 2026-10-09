import { useEffect, useRef, useState } from "react";
import { authStore } from "../../store/Auth.store";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import ArrecadacaoModal from "../../components/ArrecadacaoModal.jsx";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";

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

export const Arrecadacoes = WithAuthGuard(function ArrecadacoesPage() {
  const [arrecadacoes, setArrecadacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [arrecadacaoEmEdicao, setArrecadacaoEmEdicao] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const deleteModalRef = useRef(null);

  async function carregarArrecadacoes() {
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
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarArrecadacoes();
  }, []);

  async function excluirArrecadacao(arrecadacao) {
    const confirmada = await deleteModalRef.current?.open();
    if (!confirmada) return;

    setExcluindoId(arrecadacao.id);
    try {
      const response = await fetch(`${API_URL}/${arrecadacao.id}`, {
        method: "DELETE",
        headers: authStore.getHeaders(),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Não foi possível excluir a arrecadação.");
      }

      setMensagem(result?.message || "Arrecadação excluída com sucesso.");
      setMensagemErro("");
      await carregarArrecadacoes();
    } catch (error) {
      console.error("Erro ao excluir arrecadação:", error);
      setMensagemErro(error.message || "Não foi possível excluir a arrecadação.");
    } finally {
      setExcluindoId(null);
    }
  }

  const totalArrecadado = arrecadacoes.reduce(
    (total, arrecadacao) => total + Number(arrecadacao.valor || 0),
    0,
  );

  return (
    <section className="arrecadacoes-page">
      <SensitiveModal
        ref={deleteModalRef}
        title="Excluir arrecadação?"
        confirmLabel="Excluir"
        showCloseButton
      >
        Esta ação removerá permanentemente a arrecadação selecionada.
      </SensitiveModal>

      <header className="arrecadacoes-page__header">
        <div>
          <h1>Arrecadações</h1>
          <p>Consulte os valores registrados e lance novas arrecadações.</p>
        </div>
        <button
          className="arrecadacoes-page__add"
          type="button"
          onClick={() => {
            setArrecadacaoEmEdicao(null);
            setModalAberto(true);
          }}
        >
          + Lançar Arrecadação
        </button>
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

      <div className="arrecadacoes-page__summary">
        <div>
          <span>Total arrecadado</span>
          <strong>{currencyFormatter.format(totalArrecadado)}</strong>
        </div>
        <div>
          <span>Registros</span>
          <strong>{arrecadacoes.length}</strong>
        </div>
      </div>

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
                        setModalAberto(true);
                      }}
                      disabled={excluindoId === arrecadacao.id}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="arrecadacoes-page__delete"
                      onClick={() => excluirArrecadacao(arrecadacao)}
                      disabled={excluindoId === arrecadacao.id}
                    >
                      {excluindoId === arrecadacao.id ? "Excluindo..." : "Excluir"}
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
        editingArrecadacao={arrecadacaoEmEdicao}
        onClose={() => {
          setModalAberto(false);
          setArrecadacaoEmEdicao(null);
        }}
        onSuccess={(novaMensagem) => {
          setMensagem(novaMensagem);
          setMensagemErro("");
          void carregarArrecadacoes();
        }}
      />
    </section>
  );
});
