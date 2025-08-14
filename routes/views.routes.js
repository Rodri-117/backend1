const express = require('express');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        if (query) {
            if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
                filter.status = query.toLowerCase() === 'true';
            } else {
                filter.category = query;
            }
        }

        const options = { page: parseInt(page), limit: parseInt(limit), lean: true };
        if (sort === 'asc') options.sort = { price: 1 };
        if (sort === 'desc') options.sort = { price: -1 };

        const result = await Product.paginate(filter, options);

        const cartId = '64f1d2a5e7b1a93c9e4b1234';

        res.render('home', {
            productos: result.docs,
            pagination: {
                totalPages: result.totalPages,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
            },
            cartId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const producto = await Product.findById(req.params.pid).lean();
        if (!producto) return res.status(404).send('Producto no encontrado');

        const cartId = '64f1d2a5e7b1a93c9e4b1234';
        res.render('productdetail', { producto, cartId });
    } catch (error) {
        console.error(error);
        res.status(400).send('ID inválido');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).send('Carrito no encontrado');

        res.render('cartdetail', { cart });
    } catch (error) {
        console.error(error);
        res.status(400).send('ID inválido');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await Product.find().lean();
        res.render('realtimeProducts', { productos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;


