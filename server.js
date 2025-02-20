const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const port = 3000;
const authRoutes = require("./routes/auth");

dotenv.config();
app.use(express.json());
app.use(express.static("public"));

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("✅ Conectado a MongoDB Atlas"))
	.catch((error) => {
		console.error("❌ Error al conectar con MongoDB Atlas:");
		console.error(error);
	});

app.use("/api/auth", authRoutes);
app.use("/api/comments", require("./routes/comments"));

app.listen(port, () => {
	console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
