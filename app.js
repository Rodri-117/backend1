const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const viewsRouter = require('./routes/views.routes');
const ProductManager = require('./managers/productManager');
const pm = new ProductManager('./data/products.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/', viewsRouter);

io.on('connection', async socket => {
    console.log('Cliente conectado 🔌');

    socket.emit('productos', await pm.getProducts());

    socket.on('nuevoProducto', async prod => {
        await pm.addProduct(prod);
        io.emit('productos', await pm.getProducts());
    });

    socket.on('eliminarProducto', async id => {
        await pm.deleteProduct(id);
        io.emit('productos', await pm.getProducts());
    });
    });

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
});
