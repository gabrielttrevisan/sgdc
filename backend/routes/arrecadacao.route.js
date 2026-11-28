import express from "express";
import {
  consultarRelatorioArrecadacoes,
  criarArrecadacao,
} from "../controllers/arrecadacaoController.js";

const router = express.Router();

router.get("/report", consultarRelatorioArrecadacoes);
router.post("/", criarArrecadacao);

export default router;
