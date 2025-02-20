document.addEventListener("DOMContentLoaded", () => {
	const loginForm = document.getElementById("loginForm");
	const registerForm = document.getElementById("registerForm");
	const tabBtns = document.querySelectorAll(".tab-btn");

	// Cambio entre pestañas
	tabBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			tabBtns.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");

			if (btn.dataset.tab === "login") {
				loginForm.style.display = "block";
				registerForm.style.display = "none";
			} else {
				loginForm.style.display = "none";
				registerForm.style.display = "block";
			}
		});
	});

	// Funcionalidad de mostrar/ocultar contraseña
	const toggleButtons = document.querySelectorAll(".toggle-password");
	toggleButtons.forEach((button) => {
		button.addEventListener("click", function () {
			const passwordInput = this.parentElement.querySelector("input");
			const showIcon = this.querySelector(".show-password");
			const hideIcon = this.querySelector(".hide-password");

			if (passwordInput.type === "password") {
				passwordInput.type = "text";
				showIcon.style.display = "none";
				hideIcon.style.display = "block";
			} else {
				passwordInput.type = "password";
				showIcon.style.display = "block";
				hideIcon.style.display = "none";
			}
		});
	});

	// Manejo del registro
	registerForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const userData = {
			username: document.getElementById("registerUsername").value,
			email: document.getElementById("registerEmail").value,
			password: document.getElementById("registerPassword").value,
		};

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (response.ok) {
				alert("Registro exitoso. Por favor inicia sesión.");
				tabBtns[0].click();
			} else {
				const data = await response.json();
				alert(data.message || "Error en el registro");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Error en el registro");
		}
	});

	// Manejo del login
	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const userData = {
			email: document.getElementById("loginEmail").value,
			password: document.getElementById("loginPassword").value,
		};

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("token", data.token);
				localStorage.setItem("isAdmin", data.user.isAdmin);
				localStorage.setItem("username", data.user.username);
				window.location.href = "/comunidad.html";
			} else {
				const data = await response.json();
				alert(data.message || "Error en el inicio de sesión");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Error en el inicio de sesión");
		}
	});
});
