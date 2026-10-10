import {
  atualizarArrecadacao,
  criarArrecadacao,
  excluirArrecadacao,
  listarArrecadacoes,
} from "../models/arrecadacao.model.js";

const TIPOS_ARRECADACAO = [
  "Doação em dinheiro",
  "Pix",
  "Doação de alimentos",
  "Produtos de higiene",
  "Roupas",
  "Calçados",
];

function validateArrecadacao(data) {
  if (!Number.isFinite(Number(data.valor)) || Number(data.valor) <= 0) {
    return "Informe um valor maior que zero.";
  }

  if (!data.dataArrecadacao || Number.isNaN(Date.parse(data.dataArrecadacao))) {
    return "Informe uma data válida para a arrecadação.";
  }

  if (!TIPOS_ARRECADACAO.includes(data.tipoArrecadacao)) {
    return "O tipo de arrecadação informado é inválido.";
  }

  if (data.descricao != null && String(data.descricao).length > 255) {
    return "A descrição deve ter no máximo 255 caracteres.";
  }

  return null;
}

function parseId(id) {
  const parsedId = Number(id);
  return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export async function list(req, res) {
  try {
    const arrecadacoes = await listarArrecadacoes();
    return res.json(arrecadacoes);
  } catch (error) {
    console.error("Erro ao listar arrecadações:", error);
    return res.status(500).json({
      message: "Falha ao consultar arrecadações no banco. Verifique o log do backend.",
    });
  }
}

export async function create(req, res) {

  try {

    const {
      valor,
      dataArrecadacao,
      tipoArrecadacao,
      descricao
    } = req.body;

    const validationError = validateArrecadacao({
      valor,
      dataArrecadacao,
      tipoArrecadacao,
      descricao,
    });
    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const arrecadacao = await criarArrecadacao({
      valor,
      dataArrecadacao,
      tipoArrecadacao,
      descricao
    });

    return res.status(201).json({
      message: "Arrecadação lançada com sucesso!",
      arrecadacao
    });

  } catch (error) {

    console.error(
      "Erro ao lançar arrecadação:",
      error
    );

    return res.status(500).json({
      message: "Falha ao gravar arrecadação no banco. Verifique o log do backend."
    });
  }
}

export async function update(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Identificador de arrecadação inválido." });
  }

  const { valor, dataArrecadacao, tipoArrecadacao, descricao } = req.body;
  const validationError = validateArrecadacao({
    valor,
    dataArrecadacao,
    tipoArrecadacao,
    descricao,
  });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const updated = await atualizarArrecadacao(id, {
      valor: Number(valor),
      dataArrecadacao,
      tipoArrecadacao,
      descricao: descricao?.trim() || null,
    });

    if (!updated) {
      return res.status(404).json({ message: "Arrecadação não encontrada." });
    }

    return res.json({ message: "Arrecadação atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar arrecadação:", error);
    return res.status(500).json({
      message: "Falha ao atualizar arrecadação no banco. Verifique o log do backend.",
    });
  }
}

export async function remove(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Identificador de arrecadação inválido." });
  }

  try {
    const deleted = await excluirArrecadacao(id);
    if (!deleted) {
      return res.status(404).json({ message: "Arrecadação não encontrada." });
    }

    return res.json({ message: "Arrecadação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir arrecadação:", error);
    return res.status(500).json({
      message: "Falha ao excluir arrecadação no banco. Verifique o log do backend.",
    });
  }
}