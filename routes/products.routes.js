const express = require('express');
const ProductManager = require('./managers/productManager.js');
const router = express.Router();

const productManager = new ProductManager('data/products.json');

router.get('/', async (req, res) => {
    const productos = await productManager.getAll();
    res.json(productos);
});

router.get('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const producto = await productManager.getById(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || price == null || status == null || !stock || !category) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const nuevo = await productManager.add({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails: thumbnails || []
    });

    res.status(201).json(nuevo);
});

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const actualizado = await productManager.update(id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(actualizado);
});

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    await productManager.delete(id);
    res.status(204).send();
});

module.exports = router;
