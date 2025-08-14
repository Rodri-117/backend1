const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');
const viewsRouter = require('./routes/views.routes');

const app = express();

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

module.exports = app;

