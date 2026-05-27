function validateProduct(req, res, next) {

    const {
        name,
        description,
        price,
        stock,
        status
    } = req.body;

    if (!name || !description || !price || !stock || !status) {

        return res.status(400).json({
            message: 'Todos os campos são obrigatórios'
        });
    }

    next();
}

export default validateProduct;