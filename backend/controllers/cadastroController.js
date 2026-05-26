import CadastroModel from "../models/cadastroModel.js";

class CadastroController {
    static async listarTodos(req, res) {
        try {
            const donors = await CadastroModel.findAll();
            res.json(donors);
        } catch (error) {
            console.error('Erro ao listar doadores:', error);
            res.status(500).json({ error: 'Erro ao listar doadores' });
        }
    }

    static async listarPorId(req, res) {
        const { id } = req.params;
        try {
            const donor = await CadastroModel.findById(id);
            if (!donor) return res.status(404).json({ error: 'Doador não encontrado' });
            res.json(donor);
        } catch (error) {
            console.error('Erro ao buscar doador:', error);
            res.status(500).json({ error: 'Erro ao buscar doador' });
        }
    }

    static async criar(req, res) {
        const { name, cpf, phone, gender } = req.body;

        if (!name || !cpf || !phone || !gender) {
            return res.status(400).json({ error: 'Nome, CPF, telefone e gênero são obrigatórios' });
        }
        if (cpf.replace(/\D/g, '').length !== 11) {
            return res.status(400).json({ error: 'CPF deve conter 11 dígitos' });
        }

        try {
            const result = await CadastroModel.create(name, cpf, phone, gender);
            res.status(201).json({
                message: 'Doador criado com sucesso!',
                id: result.insertId,
                donor: { id: result.insertId, name, cpf, phone, gender }
            });
        } catch (error) {
            console.error('Erro ao criar doador:', error);
            res.status(500).json({ error: 'Erro ao criar doador' });
        }
    }

    static async atualizar(req, res) {
        const { id } = req.params;
        const { name, cpf, phone, gender } = req.body;

        if (!name || !cpf || !phone || !gender) {
            return res.status(400).json({ error: 'Nome, CPF, telefone e gênero são obrigatórios' });
        }
        if (cpf.replace(/\D/g, '').length !== 11) {
            return res.status(400).json({ error: 'CPF deve conter 11 dígitos' });
        }

        try {
            const donor = await CadastroModel.findById(id);
            if (!donor) return res.status(404).json({ error: 'Doador não encontrado' });

            await CadastroModel.update(id, name, cpf, phone, gender);
            res.json({ message: 'Doador atualizado com sucesso!', donor: { id, name, cpf, phone, gender } });
        } catch (error) {
            console.error('Erro ao atualizar doador:', error);
            res.status(500).json({ error: 'Erro ao atualizar doador' });
        }
    }

    static async excluir(req, res) {
        const { id } = req.params;
        try {
            const donor = await CadastroModel.findById(id);
            if (!donor) return res.status(404).json({ error: 'Doador não encontrado' });

            const result = await CadastroModel.delete(id);
            res.json({ message: 'Doador excluído com sucesso!', id, rowsAffected: result.affectedRows });
        } catch (error) {
            console.error('Erro ao excluir doador:', error);
            res.status(500).json({ error: 'Erro ao excluir doador' });
        }
    }
}

export default CadastroController;