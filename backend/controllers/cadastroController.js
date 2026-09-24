import CadastroModel from "../models/cadastroModel.js";

class CadastroController {
    static calculateAge(birthDate) {
        const date = new Date(`${birthDate}T00:00:00`);
        if (Number.isNaN(date.getTime()) || date > new Date()) return null;

        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const birthdayHasPassed =
            today.getMonth() > date.getMonth() ||
            (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());

        if (!birthdayHasPassed) age -= 1;
        return age >= 0 ? age : null;
    }

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
        const { name, cpf, phone, gender, birthDate } = req.body;

        if (!name || !cpf || !phone || !gender || !birthDate) {
            return res.status(400).json({ error: 'Nome, CPF, telefone, gênero e data de nascimento são obrigatórios' });
        }
        if (cpf.replace(/\D/g, '').length !== 11) {
            return res.status(400).json({ error: 'CPF deve conter 11 dígitos' });
        }
        const age = CadastroController.calculateAge(birthDate);
        if (age === null) {
            return res.status(400).json({ error: 'Data de nascimento inválida' });
        }

        const cpfExists = await CadastroModel.findByCPF(cpf);
        if (cpfExists) {
            return res.status(400).json({ error: 'CPF já cadastrado' });
        }

        try {
            const result = await CadastroModel.create(name, cpf, phone, gender, birthDate, age);
            res.status(201).json({
                message: 'Doador criado com sucesso!',
                id: result.insertId,
                donor: { id: result.insertId, name, cpf, phone, gender, birthDate, age }
            });
        } catch (error) {
            console.error('Erro ao criar doador:', error);
            res.status(500).json({ error: 'Erro ao criar doador' });
        }
    }

    static async atualizar(req, res) {
        const { id } = req.params;
        const { name, cpf, phone, gender, birthDate } = req.body;

        if (!name || !cpf || !phone || !gender || !birthDate) {
            return res.status(400).json({ error: 'Nome, CPF, telefone, gênero e data de nascimento são obrigatórios' });
        }
        if (cpf.replace(/\D/g, '').length !== 11) {
            return res.status(400).json({ error: 'CPF deve conter 11 dígitos' });
        }
        const age = CadastroController.calculateAge(birthDate);
        if (age === null) {
            return res.status(400).json({ error: 'Data de nascimento inválida' });
        }

        const cpfExists = await CadastroModel.findByCPFExcludingId(cpf, id);
        if (cpfExists) {
            return res.status(400).json({ error: 'CPF já cadastrado por outro doador' });
        }

        try {
            const donor = await CadastroModel.findById(id);
            if (!donor) return res.status(404).json({ error: 'Doador não encontrado' });

            await CadastroModel.update(id, name, cpf, phone, gender, birthDate, age);
            res.json({ message: 'Doador atualizado com sucesso!', donor: { id, name, cpf, phone, gender, birthDate, age } });
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