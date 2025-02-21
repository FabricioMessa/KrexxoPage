const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs'); // Cambiamos de bcrypt a bcryptjs
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Registro
router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Verificar si el usuario ya existe
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "El usuario ya existe" });
		}

		// Encriptar contraseña
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Crear nuevo usuario
		const user = new User({
			username,
			email,
			password: hashedPassword,
			isAdmin: false, // Por defecto no es admin
		});

		await user.save();
		res.status(201).json({ message: "Usuario registrado exitosamente" });
	} catch (error) {
		res.status(500).json({ message: "Error en el servidor" });
	}
});

// Login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Buscar usuario
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Credenciales inválidas" });
		}

		// Verificar contraseña
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res.status(400).json({ message: "Credenciales inválidas" });
		}

		// Generar token
		const token = jwt.sign(
			{ id: user._id, isAdmin: user.isAdmin },
			"tu_secreto_jwt", // Cambia esto por una variable de entorno
			{ expiresIn: "1d" }
		);

		res.json({
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				isAdmin: user.isAdmin,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Error en el servidor" });
	}
});

module.exports = router;
