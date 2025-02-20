document.addEventListener("DOMContentLoaded", () => {
	// Verificar si el usuario está logueado
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.href = "/login.html";
		return;
	}

	// Verificar si es admin
	const isAdmin = localStorage.getItem("isAdmin") === "true";

	loadComments();

	const commentForm = document.getElementById("comment-form");
	if (commentForm) {
		commentForm.addEventListener("submit", handleSubmitComment);
	}
});

async function loadComments() {
	try {
		const response = await fetch("/api/comments");
		const comments = await response.json();
		displayComments(comments);
	} catch (error) {
		console.error("Error cargando comentarios:", error);
	}
}

async function handleSubmitComment(event) {
	event.preventDefault();
	const contentInput = document.getElementById("comment-content");
	const username = localStorage.getItem("username");
	const isAdmin = localStorage.getItem("isAdmin") === "true";

	if (!contentInput.value.trim()) {
		alert("Por favor escribe un comentario");
		return;
	}

	try {
		const response = await fetch("/api/comments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: contentInput.value,
				author: username,
				isAdmin: isAdmin,
			}),
		});

		if (response.ok) {
			contentInput.value = "";
			loadComments();
		}
	} catch (error) {
		console.error("Error enviando comentario:", error);
	}
}

async function handleReply(commentId) {
	const replyContent = prompt("Escribe tu respuesta:");
	if (!replyContent) return;

	try {
		const response = await fetch(`/api/comments/${commentId}/reply`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: replyContent,
				author: localStorage.getItem("username"),
				isAdmin: true,
			}),
		});

		if (response.ok) {
			loadComments();
		}
	} catch (error) {
		console.error("Error enviando respuesta:", error);
	}
}

async function handleDelete(commentId) {
	if (!confirm("¿Estás seguro de que quieres eliminar este comentario?"))
		return;

	try {
		const response = await fetch(`/api/comments/${commentId}`, {
			method: "DELETE",
		});

		if (response.ok) {
			loadComments();
		}
	} catch (error) {
		console.error("Error eliminando comentario:", error);
	}
}

function displayComments(comments) {
	const container = document.getElementById("comments-container");
	const isAdmin = localStorage.getItem("isAdmin") === "true";

	container.innerHTML = comments
		.map(
			(comment) => `
            <div class="comment" data-comment-id="${comment._id}">
                <div class="comment-header">
                    <strong>${comment.isAdmin ? "👑 " : ""}${
				comment.author
			}</strong>
                    <small>${new Date(
								comment.createdAt
							).toLocaleDateString()}</small>
                </div>
                <p>${comment.content}</p>
                ${
							isAdmin
								? `
                    <div class="comment-actions">
                        <button onclick="handleReply('${comment._id}')" class="reply-btn">Responder</button>
                        <button onclick="handleDelete('${comment._id}')" class="delete-btn">Eliminar</button>
                    </div>
                `
								: ""
						}
                ${
							comment.replies && comment.replies.length > 0
								? `
                    <div class="replies">
                        ${comment.replies
									.map(
										(reply) => `
                            <div class="reply">
                                <strong>${reply.isAdmin ? "👑 " : ""}${
											reply.author
										}</strong>
                                <p>${reply.content}</p>
                                <small>${new Date(
												reply.createdAt
											).toLocaleDateString()}</small>
                            </div>
                        `
									)
									.join("")}
                    </div>
                `
								: ""
						}
            </div>
        `
		)
		.join("");
}
