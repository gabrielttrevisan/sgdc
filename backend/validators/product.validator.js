function validateProduct(req, res, next) {
    const {
        name,
        description,
        price,
        stock,
        status
    } = req.body;

    if (
        !name ||
        price === undefined ||
        price === null ||
        stock === undefined ||
        stock === null ||
        !status
    ) {
        return res.status(400).json({
            message: 'Todos os campos obrigatórios devem ser preenchidos'
        });
    }

    next();
}

export default validateProduct;