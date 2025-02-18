document.addEventListener('DOMContentLoaded', () => {
	const rectContainers = document.querySelectorAll(".rectangulo-contenedor");
	const cardGroups = document.querySelectorAll(".card-group");
	const cards = document.querySelectorAll(".card");

	// En lugar de posicionar absolutamente, oculta los card-group que no estén activos
	rectContainers.forEach((rectContainer, index) => {
		rectContainer.addEventListener("click", () => {
			const cardGroup = cardGroups[index];

			if (!cardGroup) {
				console.error(
					`No se encontró card-group para rectangulo-contenedor ${index}`
				);
				return;
			}

			// Oculta todos los card-group excepto el activo
			cardGroups.forEach((group, groupIndex) => {
				if (groupIndex !== index) {
					group.classList.remove("active");
					group.style.display = "none";
				}
			});

			// Activa el grupo actual
			cardGroup.style.display = "block";
			cardGroup.classList.toggle("active");
		});
	});

	// Sidebar expansion logic
	const barraLateral = document.querySelector(".barra-lateral");
	const spans = barraLateral.querySelectorAll("span");

	barraLateral.addEventListener("mouseover", () => {
		barraLateral.classList.add("expandida");
		spans.forEach((span) => {
			span.classList.remove("oculto");
		});
	});

	barraLateral.addEventListener("mouseout", () => {
		barraLateral.classList.remove("expandida");
		spans.forEach((span) => {
			span.classList.add("oculto");
		});
	});

	// Apply 3D effect to cards
	cards.forEach((card) => {
		card.addEventListener("mousemove", (e) => {
			const rect = card.getBoundingClientRect();
			const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 3);
			const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 3);

			card.style.transform = `
                perspective(1000px)
                rotateY(${x * 15}deg)
                rotateX(${-y * 15}deg)
            `;
		});

		card.addEventListener("mouseleave", () => {
			card.style.transform =
				"perspective(1000px) rotateY(0deg) rotateX(0deg)";
		});
	});

	// Reset 3D effect on visibility change
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			cards.forEach((card) => {
				card.style.transform =
					"perspective(1000px) rotateY(0deg) rotateX(0deg)";
			});
		}
	});

	// Reset 3D effect on window blur
	window.addEventListener("blur", () => {
		cards.forEach((card) => {
			card.style.transform =
				"perspective(1000px) rotateY(0deg) rotateX(0deg)";
		});
	});
});
    