const express = require('express');
const Product = require('../models/product.model');
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

        const buildLink = (pageNum) => {
            if (!pageNum) return null;
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
            const params = new URLSearchParams({ ...req.query, page: pageNum });
            return `${baseUrl}?${params.toString()}`;
        };

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
            nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error en servidor' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        res.json({ status: 'success', payload: product });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'ID inválido' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !code || price == null || stock == null) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        const newProduct = await Product.create({
            title,
            description,
            code,
            price,
            status: status !== undefined ? status : true,
            stock,
            category,
            thumbnails: thumbnails || [],
        });

        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true, runValidators: true }).lean();
        if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        res.json({ status: 'success', payload: updated });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'ID inválido o datos incorrectos' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.pid);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'ID inválido' });
    }
});

module.exports = router;




