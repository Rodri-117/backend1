const express = require('express');
const CartManager = require('../managers/cartManager.js');

const router = express.Router();
const cartManager = new CartManager('data/carts.json');

router.post('/', async (req, res) => {
    const nuevoCarrito = await cartManager.createCart();
    res.status(201).json(nuevoCarrito);
});

router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const carrito = await cartManager.getById(cid);
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    res.json(carrito.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const carritoActualizado = await cartManager.addProductToCart(cid, pid);
    if (!carritoActualizado) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

    res.status(200).json(carritoActualizado);
});

module.exports = router;

