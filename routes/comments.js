const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// Obtener todos los comentarios
router.get("/", async (req, res) => {
	try {
		const comments = await Comment.find({ parentId: null })
			.populate("replies")
			.sort("-createdAt");
		res.json(comments);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Crear un nuevo comentario
router.post("/", async (req, res) => {
	try {
		const comment = new Comment({
			content: req.body.content,
			author: req.body.author,
			isAdmin: req.body.isAdmin || false,
		});
		const newComment = await comment.save();
		res.status(201).json(newComment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Responder a un comentario
router.post("/:id/reply", async (req, res) => {
	try {
		const parentComment = await Comment.findById(req.params.id);
		if (!parentComment) {
			return res.status(404).json({ message: "Comentario no encontrado" });
		}

		const reply = new Comment({
			content: req.body.content,
			author: req.body.author,
			isAdmin: req.body.isAdmin,
			parentId: parentComment._id,
		});

		const newReply = await reply.save();

		// Agregar la respuesta al comentario padre
		parentComment.replies.push(newReply._id);
		await parentComment.save();

		res.status(201).json(newReply);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Eliminar un comentario
router.delete("/:id", async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (!comment) {
			return res.status(404).json({ message: "Comentario no encontrado" });
		}

		// Si el comentario tiene respuestas, eliminarlas también
		if (comment.replies && comment.replies.length > 0) {
			await Comment.deleteMany({ _id: { $in: comment.replies } });
		}

		await comment.deleteOne();
		res.json({ message: "Comentario eliminado" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
