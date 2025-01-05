const express = require('express');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta para personajes
app.get('/characters.html', (req, res) => {
  res.sendFile(__dirname + '/characters.html');
});

// Ruta para imágenes aleatorias
app.get('/random.html', (req, res) => {
  res.sendFile(__dirname + '/random.html');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
