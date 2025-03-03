document.addEventListener("DOMContentLoaded", () => {
	// BARRA LATERAL
	const barraLateral = document.querySelector(".barra-lateral");
	// Excluir los spans dentro del submenu
	const spans = document.querySelectorAll(
		".barra-lateral > .nombre-pagina span, .barra-lateral > a.boton span, .navegacion > ul > li > a > span, .botonRedes span, .botonRedestu span, .botonRedestri span"
	);

	// Mostrar barra lateral al pasar el cursor
	barraLateral.addEventListener("mouseover", () => {
		barraLateral.classList.remove("mini-barra-lateral");
		spans.forEach((span) => {
			span.classList.remove("oculto");
		});

		// Si el submenú está visible, asegurarse de que sus spans también estén visibles
		if (document.querySelector(".submenu.mostrar")) {
			document.querySelectorAll(".submenu span").forEach((span) => {
				span.classList.remove("oculto");
			});
		}
	});

	// Ocultar barra lateral al retirar el cursor
	barraLateral.addEventListener("mouseout", () => {
		barraLateral.classList.add("mini-barra-lateral");
		spans.forEach((span) => {
			span.classList.add("oculto");
		});
	});

	// MENÚ DESPLEGABLE
	const botonGuias = document.querySelector(".boton-guias");
	const menuDesplegable = document.querySelector(".menu-desplegable");
	const submenu = document.querySelector(".submenu");

	// Toggle para el menú desplegable
	botonGuias.addEventListener("click", (e) => {
		e.preventDefault(); // Previene la navegación predeterminada
		menuDesplegable.classList.toggle("activo");
		submenu.classList.toggle("mostrar");

		// Si se muestra el submenú, asegurarse de que sus spans sean visibles
		if (submenu.classList.contains("mostrar")) {
			document.querySelectorAll(".submenu span").forEach((span) => {
				span.classList.remove("oculto");
			});
		}
	});

	// Cerrar el menú al hacer clic fuera de él
	document.addEventListener("click", (e) => {
		if (!menuDesplegable.contains(e.target)) {
			menuDesplegable.classList.remove("activo");
			submenu.classList.remove("mostrar");
		}
	});

	//CONTRASEÑA
	const randomLink = document.getElementById("randomLink");
	const modal = document.getElementById("passwordModal");
	const passwordInput = document.getElementById("passwordInput");
	const confirmButton = document.getElementById("confirmButton");
	const cancelButton = document.getElementById("cancelButton");

	// Mostrar el modal al hacer clic en el enlace
	randomLink.addEventListener("click", (e) => {
		e.preventDefault(); // Previene la navegación predeterminada
		modal.style.display = "flex"; // Muestra el modal
	});

	// Validar la contraseña
	confirmButton.addEventListener("click", () => {
		const password = passwordInput.value;
		if (password === "ArequipaGodTier") {
			window.location.href = "random.html"; // Redirige si la contraseña es correcta
		} else {
			alert("Contraseña incorrecta");
		}
		passwordInput.value = ""; // Limpia el campo de contraseña
		modal.style.display = "none"; // Oculta el modal
	});

	// Cancelar y cerrar el modal
	cancelButton.addEventListener("click", () => {
		passwordInput.value = ""; // Limpia el campo de contraseña
		modal.style.display = "none"; // Oculta el modal
	});

	// Cerrar el modal al hacer clic fuera de él
	window.addEventListener("click", (e) => {
		if (e.target === modal) {
			passwordInput.value = ""; // Limpia el campo de contraseña
			modal.style.display = "none"; // Oculta el modal
		}
	});
});
