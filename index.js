const express = require('express');
const app = express();
const PORT = 8080;


app.use(express.json());

let productos = [
    {id: 1, nombre: "Remera", precio: 12000},
    {id: 2, nombre: "Pantalon", precio: 15000},
    {id: 3, nombre: "Sudadera", precio: 10000}
];

app.get('/', (req, res) =>{
    res.send("Bienvenido a Alma Store")
})

app.get('/productos', (req, res) =>{
    res.status(200).json(productos);
})

app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json(producto);
})

app.post('/productos', (req, res) => {
    const { nombre, precio } = req.body;
    const nuevo = {
        id: productos.length ? productos[productos.length - 1].id + 1 : 1,
        nombre,
        precio
    }
    productos.push(nuevo);
    res.status(201).json(nuevo);
});

app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    const { nombre, precio } = req.body;
    if (nombre) producto.nombre = nombre;
    if (precio) producto.precio = precio;

    res.json(producto);
})

app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    productos = productos.filter(p => p.id !== id);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Sservidor escuchando en http://localhost:${PORT}`);
})