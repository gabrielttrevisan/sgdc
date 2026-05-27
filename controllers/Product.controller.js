import Product from '../models/Product.model.js';

class ProductController {

    static async index(req, res) {

        try {

            const { name } = req.query;

            const products = await Product.findAll(name);

            return res.status(200).json(products);

        } catch (error) {

            return res.status(500).json({
                message: 'Erro ao listar produtos',
                error: error.message
            });
        }
    }

    static async store(req, res) {

        try {

            const result = await Product.create(req.body);

            return res.status(201).json({
                message: 'Produto cadastrado com sucesso',
                result
            });

        } catch (error) {

            return res.status(500).json({
                message: 'Erro ao cadastrar produto',
                error: error.message
            });
        }
    }

    static async update(req, res) {

        try {

            const { id } = req.params;

            const result = await Product.update(id, req.body);

            return res.status(200).json({
                message: 'Produto atualizado com sucesso',
                result
            });

        } catch (error) {

            return res.status(500).json({
                message: 'Erro ao atualizar produto',
                error: error.message
            });
        }
    }

    static async delete(req, res) {

        try {

            const { id } = req.params;

            const result = await Product.delete(id);

            return res.status(200).json({
                message: 'Produto removido com sucesso',
                result
            });

        } catch (error) {

            return res.status(500).json({
                message: 'Erro ao remover produto',
                error: error.message
            });
        }
    }
}

export default ProductController;