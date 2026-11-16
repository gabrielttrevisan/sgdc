import express from "express";
import { criarArrecadacao } from "../controllers/arrecadacaoController.js";

const router = express.Router();

router.post("/", criarArrecadacao);

export default router;
