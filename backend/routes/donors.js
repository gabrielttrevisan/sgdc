import express from "express"
const router = express.Router()

import CadastroController from "../controllers/cadastroController.js"

// LISTAR /api/donors
router.get("/", CadastroController.listarTodos)

// CADASTRAR /api/donors 
router.post("/", CadastroController.criar)

// EDITAR /api/donors/:id
router.put("/:id", CadastroController.atualizar)

// EXCLUIR /api/donors/:id
router.delete("/:id", CadastroController.excluir)

export default router