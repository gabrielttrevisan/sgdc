import { useEffect, useState } from "react";
import { authStore } from "../store/Auth.store";
import "./ArrecadacaoModal.css";

const formularioInicial = {
    valor: "",
    dataArrecadacao: "",
    tipoArrecadacao: "",
    descricao: "",
};

const tiposArrecadacao = [
    "Doação em dinheiro",
    "Pix",
    "Doação de alimentos",
    "Produtos de higiene",
    "Roupas",
    "Calçados",
];

export default function ArrecadacaoModal({
    isOpen,
    onClose,
    onSuccess,
    editingArrecadacao = null,
    viewMode = false,
}) {
    const [form, setForm] = useState(formularioInicial);
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);
    const isEditing = editingArrecadacao !== null && !viewMode;

    useEffect(() => {
        if (!isOpen) return;

        setErro("");
        setForm(
            editingArrecadacao
                ? {
                    valor: String(editingArrecadacao.valor ?? ""),
                    dataArrecadacao: String(
                        editingArrecadacao.dataArrecadacao ?? "",
                    ).slice(0, 10),
                    tipoArrecadacao: editingArrecadacao.tipoArrecadacao ?? "",
                    descricao: editingArrecadacao.descricao ?? "",
                }
                : { ...formularioInicial },
        );
    }, [isOpen, editingArrecadacao]);

    if (!isOpen) return null;

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((anterior) => ({
            ...anterior,
            [name]: value,
        }));

        setErro("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (viewMode) return;
        setErro("");

        const valorNumerico = Number(form.valor);

        if (!form.valor || !Number.isFinite(valorNumerico) ||
            valorNumerico <= 0) {
            setErro("Informe um valor maior que zero.");
            return;
        }

        if (!form.dataArrecadacao || !form.tipoArrecadacao) {
            setErro("Informe a data e o tipo da arrecadação.");
            return;
        }

        try {
            setEnviando(true);

            const resposta = await fetch(
                isEditing
                    ? `http://localhost:3004/arrecadacoes/${editingArrecadacao.id}`
                    : "http://localhost:3004/arrecadacoes",
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...authStore.getHeaders(),
                    },
                    body: JSON.stringify({
                        valor: valorNumerico,
                        dataArrecadacao: form.dataArrecadacao,
                        tipoArrecadacao: form.tipoArrecadacao,
                        descricao: form.descricao.trim() || null,
                    }),
                }
            );

            const resultado = await resposta.json().catch(() => null);

            if (!resposta.ok) {
                const mensagemApiDesatualizada =
                    isEditing &&
                    resposta.status === 404 &&
                    resultado?.error?.message === "Resource not found";
                const mensagemServidor =
                    resultado?.message ||
                    resultado?.error?.message ||
                    (typeof resultado?.error === "string"
                        ? resultado.error
                        : null);

                throw new Error(
                    (mensagemApiDesatualizada
                        ? "A API de edição não está ativa. Reinicie o backend e tente novamente."
                        : mensagemServidor) ||
                    (isEditing
                        ? "Não foi possível atualizar a arrecadação."
                        : "Não foi possível lançar a arrecadação.")
                );
            }

            setForm(formularioInicial);
            onClose();

            onSuccess(
                resultado?.message ||
                (isEditing
                    ? "Arrecadação atualizada com sucesso."
                    : "Arrecadação lançada com sucesso!")
            );
        } catch (error) {
            console.error(
                isEditing
                    ? "Erro ao atualizar arrecadação:"
                    : "Erro ao lançar arrecadação:",
                error
            );

            setErro(
                error.message ||
                "Não foi possível lançar a arrecadação. Verifique o servidor e tente novamente."
            );
        } finally {
            setEnviando(false);
        }
    }

    function handleClose() {
        if (enviando) return;

        setForm(formularioInicial);
        setErro("");
        onClose();
    }

    return (
        <div
            className="arrecadacao-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div
                className="arrecadacao-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-arrecadacao"
            >
                <div className="arrecadacao-content">
                    <div className="arrecadacao-header">
                        <div>
                            <h2 id="titulo-arrecadacao">
                                {viewMode
                                    ? "Visualizar Arrecadação"
                                    : isEditing
                                        ? "Editar Arrecadação"
                                        : "Lançar Arrecadação"}
                            </h2>
                            <p>
                                {viewMode
                                    ? "Confira os dados da arrecadação."
                                    : isEditing
                                        ? "Altere os dados da arrecadação."
                                        : "Preencha os dados para registrar a arrecadação."}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="arrecadacao-close"
                            aria-label="Fechar"
                            onClick={handleClose}
                            disabled={enviando}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="arrecadacao-body">
                            {erro && (
                                <div className="arrecadacao-error" role="alert">
                                    {erro}
                                </div>
                            )}

                            <div className="arrecadacao-field">
                                <label htmlFor="valor">
                                    Valor arrecadado (R$) *
                                </label>

                                <input
                                    id="valor"
                                    name="valor"
                                    type="number"
                                    placeholder="Ex.: 250,00"
                                    min="0.01"
                                    step="0.01"
                                    value={form.valor}
                                    onChange={handleChange}
                                    required
                                    disabled={enviando || viewMode}
                                />
                            </div>

                            <div className="arrecadacao-field">
                                <label htmlFor="dataArrecadacao">
                                    Data da arrecadação *
                                </label>

                                <input
                                    id="dataArrecadacao"
                                    name="dataArrecadacao"
                                    type="date"
                                    value={form.dataArrecadacao}
                                    onChange={handleChange}
                                    required
                                    disabled={enviando || viewMode}
                                />
                            </div>

                            <div className="arrecadacao-field">
                                <label htmlFor="tipoArrecadacao">
                                    Tipo de arrecadação *
                                </label>
                                <select
                                    id="tipoArrecadacao"
                                    name="tipoArrecadacao"
                                    value={form.tipoArrecadacao}
                                    onChange={handleChange}
                                    required
                                    disabled={enviando || viewMode}
                                >
                                    <option value="" disabled>
                                        Selecione o tipo
                                    </option>
                                    {tiposArrecadacao.map((tipo) => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="arrecadacao-field">
                                <label htmlFor="descricao">
                                    Descrição
                                </label>

                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    rows="3"
                                    maxLength="255"
                                    placeholder="Informe a origem ou o motivo da arrecadação"
                                    value={form.descricao}
                                    onChange={handleChange}
                                    disabled={enviando || viewMode}
                                />

                                <div className="arrecadacao-help">
                                    Campo opcional.
                                </div>
                            </div>

                            {!viewMode && (
                                <p className="arrecadacao-required">
                                    * Campos obrigatórios.
                                </p>
                            )}
                        </div>

                        <div className="arrecadacao-footer">
                            <button
                                type="button"
                                className="arrecadacao-cancel"
                                onClick={handleClose}
                                disabled={enviando}
                            >
                                {viewMode ? "Fechar" : "Cancelar"}
                            </button>

                            {!viewMode && (
                                <button
                                    type="submit"
                                    className="arrecadacao-submit"
                                    disabled={enviando}
                                >
                                    {enviando ? (
                                        <>
                                            <span
                                                className="arrecadacao-spinner"
                                                aria-hidden="true"
                                            />
                                            Salvando...
                                        </>
                                    ) : (
                                        isEditing ? "Salvar alterações" : "Lançar Arrecadação"
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
