// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
	// Obtener todos los elementos con clase 'arrow'
	const arrows = document.querySelectorAll(".arrow");

	// Agregar evento de clic a cada flecha
	arrows.forEach((arrow) => {
		arrow.addEventListener("click", (e) => {
			// Obtener el elemento li padre del arrow clickeado
			const parentLi = e.target.parentElement.parentElement;

			// Alternar la clase 'showMenu' en el li padre para mostrar/ocultar el submenú
			parentLi.classList.toggle("showMenu");
		});
	});

	// Agregar funcionalidad para hacer la sidebar responsiva

	// Primero, agregar el botón de toggle al HTML si no existe
	// Este código verifica si el botón ya existe antes de crearlo
	if (!document.querySelector(".sidebar-toggle")) {
		// Crear el botón de toggle para dispositivos móviles
		const toggleBtn = document.createElement("div");
		toggleBtn.className = "sidebar-toggle";
		toggleBtn.innerHTML = '<i class="bx bx-menu"></i>';

		// Insertar el botón antes de la sidebar
		const sidebar = document.querySelector(".sidebar");
		document.body.insertBefore(toggleBtn, sidebar);

		// Agregar estilos necesarios para el botón
		toggleBtn.style.position = "fixed";
		toggleBtn.style.left = "10px";
		toggleBtn.style.top = "10px";
		toggleBtn.style.color = "#fff";
		toggleBtn.style.background = "#11101d";
		toggleBtn.style.fontSize = "25px";
		toggleBtn.style.padding = "5px 10px";
		toggleBtn.style.borderRadius = "5px";
		toggleBtn.style.cursor = "pointer";
		toggleBtn.style.zIndex = "999";
		toggleBtn.style.display = "none"; // Inicialmente oculto en desktop

		// Agregar evento de clic al botón de toggle
		toggleBtn.addEventListener("click", () => {
			sidebar.classList.toggle("active");
		});
	}

	// Función para manejar cambios de tamaño de ventana
	function handleResize() {
		const sidebar = document.querySelector(".sidebar");
		const toggleBtn = document.querySelector(".sidebar-toggle");

		if (window.innerWidth <= 768) {
			// En dispositivos móviles
			sidebar.classList.add("close");
			toggleBtn.style.display = "block";

			// Ajustar el estilo de la sidebar para modo móvil
			sidebar.style.left = "-260px"; // Ocultar sidebar fuera de la pantalla

			// Agregar transición suave
			sidebar.style.transition = "all 0.5s ease";

			// Modificar la clase 'active' para móviles
			const styleSheet =
				document.styleSheet || document.createElement("style");
			styleSheet.innerHTML = `
                .sidebar.active {
                    left: 0 !important;
                }
            `;
			document.head.appendChild(styleSheet);
		} else {
			// En dispositivos de escritorio
			sidebar.classList.remove("close");
			sidebar.classList.remove("active");
			toggleBtn.style.display = "none";

			// Restablecer estilo de la sidebar para desktop
			sidebar.style.left = "0";
		}
	}

	// Ejecutar la función al cargar y cuando cambia el tamaño de la ventana
	handleResize();
	window.addEventListener("resize", handleResize);
});
