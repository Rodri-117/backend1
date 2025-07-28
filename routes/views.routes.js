const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/productManager.js');
const pm = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
    const productos = await pm.getProducts();
    res.render('home', { productos });
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;
