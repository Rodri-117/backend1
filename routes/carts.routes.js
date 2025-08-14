const express = require('express');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error creando carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'ID inválido' });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'Error en datos' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'Error en datos' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products;
        if (!Array.isArray(products)) return res.status(400).json({ status: 'error', message: 'products debe ser un array' });

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = products;
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'Error en datos' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en carrito' });

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'Error en datos' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = [];
        await cart.save();
        res.json({ status: 'success', message: 'Carrito vaciado' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'Error en datos' });
    }
});

module.exports = router;


