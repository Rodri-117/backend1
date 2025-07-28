const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(__dirname, '..', filePath);
    }

async #readFile() {
    try {
        const data = await fs.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

    async #writeFile(data) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
}

    async getProducts() {
        return await this.#readFile();
}

    async addProduct(product) {
        const productos = await this.#readFile();
        const newId = productos.length ? productos[productos.length - 1].id + 1 : 1;

    const newProduct = {
        id: newId,
        title: product.title || 'Sin título',
        description: product.description || '',
        code: product.code || '',
        price: product.price || 0,
        status: product.status !== undefined ? product.status : true,
        stock: product.stock || 0,
        category: product.category || '',
        thumbnails: product.thumbnails || []
    };

    productos.push(newProduct);
    await this.#writeFile(productos);
    return newProduct;
}

    async deleteProduct(id) {
        const productos = await this.#readFile();
        const filtered = productos.filter(p => p.id !== id);
        await this.#writeFile(filtered);
    }
}

module.exports = ProductManager;
