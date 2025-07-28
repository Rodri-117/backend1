const fs = require('fs');
const path = require('path');

class CartManager {
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

    async getAll() {
        return await this.#readFile();
    }

    async getById(id) {
        const carts = await this.#readFile();
        return carts.find(c => c.id === id);
    }

    async createCart() {
        const carts = await this.#readFile();
        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);
        await this.#writeFile(carts);
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.#readFile();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.#writeFile(carts);
        return cart;
    }
}

module.exports = CartManager;
