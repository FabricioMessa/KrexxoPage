const express = require('express');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
