const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');

const viewsRouter = require('./routes/views.routes');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');
const Product = require('./models/product.model');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const hbs = exphbs.create({
    helpers: {
        multiply: (a, b) => a * b,
    },
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    const productos = await Product.find().lean();
    socket.emit('productos', productos);

    socket.on('nuevoProducto', async (data) => {
        try {
            const newProduct = await Product.create(data);
            const productos = await Product.find().lean();
            io.emit('productos', productos);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('eliminarProducto', async (id) => {
        try {
            await Product.findByIdAndDelete(id);
            const productos = await Product.find().lean();
            io.emit('productos', productos);
        } catch (error) {
            console.error(error);
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
});

