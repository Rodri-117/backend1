const socket = io();

const lista = document.getElementById('lista-productos');
const formAgregar = document.getElementById('formAgregar');
const formEliminar = document.getElementById('formEliminar');

socket.on('productos', productos => {
    lista.innerHTML = '';
    productos.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.title} - $${p.price}`;
        lista.appendChild(li);
    });
});

formAgregar.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        title: e.target.title.value,
        price: Number(e.target.price.value)
    };
    socket.emit('nuevoProducto', data);
    e.target.reset();
});

formEliminar.addEventListener('submit', e => {
    e.preventDefault();
    const id = e.target.id.value;
    socket.emit('eliminarProducto', id);
    e.target.reset();
});
