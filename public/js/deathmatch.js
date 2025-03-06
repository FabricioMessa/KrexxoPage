document.addEventListener("DOMContentLoaded", function () {
	// Seleccionar elementos principales
	const redDiv = document.querySelector(".red");
	const grayDiv = document.querySelector(".gray");
	const howlexDiv = document.querySelector(".howlex");
	const belmothDiv = document.querySelector(".belmoth");
	const originalDiv = document.querySelector(".original");

	const originalDivs = Array.from(
		document.querySelectorAll(".contenedor > div")
	).slice(0, 4);
	const redCard = document.querySelector(".red-card");

	// Estado para seguimiento
	let showingRedCard = false;
	let activeCard = null;

	// Configuración para todas las tarjetas
	const cardConfig = [
		{
			div: grayDiv,
			name: "gray-card",
			title: "DEMONIO GRIS<br>DEATHMATCH",
			color: "rgb(100,100,100)",
			darkColor: "rgb(29, 29, 29)",
		},
		{
			div: howlexDiv,
			name: "howlex-card",
			title: "HOWLEX<br>DEATHMATCH",
			color: "rgb(172,81,19)",
			darkColor: "rgb(29, 16, 5)",
		},
		{
			div: belmothDiv,
			name: "belmoth-card",
			title: "BELLMOTH<br>DEATHMATCH",
			color: "rgb(19,100,172)",
			darkColor: "rgb(5, 29, 59)",
		},
		{
			div: originalDiv,
			name: "original-card",
			title: "DEMONIO<br>ORIGINAL<br>DEATHMATCH",
			color: "rgb(140,19,172)",
			darkColor: "rgb(29, 5, 47)",
		},
	];

	// Crear todas las tarjetas si no existen
	cardConfig.forEach((config) => {
		if (!document.querySelector(`.${config.name}`)) {
			const card = document.createElement("div");
			card.classList.add(config.name);
			card.innerHTML = `<div class="${config.name}-text">${config.title}</div>`;
			card.style.visibility = "hidden";
			card.style.opacity = "0";
			card.style.zIndex = "-1";
			card.style.width = "650px";
			card.style.height = "890px";
			card.style.position = "fixed";
			card.style.display = "flex";
			card.style.justifyContent = "center";
			card.style.alignItems = "center";
			card.style.flexShrink = "0";
			card.style.backgroundImage = `radial-gradient(circle at center center, ${config.color}, ${config.darkColor})`;

			// Estilos para el texto
			const textStyle = document.createElement("style");
			textStyle.textContent = `
                .${config.name}-text {
                    color: white;
                    font-size: 100px;
                    text-shadow: -4px -4px 0px black, 4px -4px 0px black, -4px 4px 0px black, 4px 4px 0px black;
                    text-align: center;
                }
            `;
			document.head.appendChild(textStyle);

			// Posicionamiento preciso basado en div.red
			const redRect = redDiv.getBoundingClientRect();
			card.style.top = redRect.top + "px";
			card.style.left = redRect.left + "px";

			document.body.insertBefore(card, redDiv);
		}
	});

	// Seleccionar todas las tarjetas creadas
	const cards = cardConfig.map((config) =>
		document.querySelector(`.${config.name}`)
	);

	// Eventos de clic
	redDiv.addEventListener("click", function () {
		if (!showingRedCard) {
			showRedCard();
		} else {
			showOriginalDivs();
		}
	});

	// Añadir evento de clic a cada div del contenedor
	cardConfig.forEach((config, index) => {
		config.div.addEventListener("click", function () {
			if (activeCard !== config.name) {
				showCard(config.name);
			} else {
				showRedDivAndContainer();
			}
		});
	});

	// Función para mostrar red-card
	function showRedCard() {
		let animationsCompleted = 0;

		originalDivs.forEach((div, index) => {
			div.classList.remove(
				"slide-in-top",
				"slide-in-right",
				"slide-in-bottom",
				"slide-in-left"
			);

			switch (index) {
				case 0: // gray
					div.classList.add("slide-out-top");
					break;
				case 1: // howlex
					div.classList.add("slide-out-right");
					break;
				case 2: // belmoth
					div.classList.add("slide-out-bottom");
					break;
				case 3: // original
					div.classList.add("slide-out-left");
					break;
			}

			div.addEventListener("animationend", function onAnimationEnd() {
				div.style.visibility = "hidden";
				animationsCompleted++;

				if (animationsCompleted >= originalDivs.length) {
					redCard.style.visibility = "visible";
					redCard.style.opacity = "1";
					redCard.style.zIndex = "1";
					redCard.classList.remove("scale-out-center");
					redCard.classList.add("slide-in-fwd-center");
					showingRedCard = true;
				}

				div.removeEventListener("animationend", onAnimationEnd);
			});
		});
	}

	// Función para volver a mostrar los divs originales
	function showOriginalDivs() {
		redCard.classList.remove("slide-in-fwd-center");
		redCard.classList.add("scale-out-center");

		redCard.addEventListener(
			"animationend",
			function onRedCardAnimationEnd() {
				redCard.style.visibility = "hidden";
				redCard.style.opacity = "0";
				redCard.style.zIndex = "-1";

				originalDivs.forEach((div, index) => {
					div.classList.remove(
						"slide-out-top",
						"slide-out-right",
						"slide-out-bottom",
						"slide-out-left"
					);
					div.style.visibility = "visible";
					div.style.opacity = "1";

					switch (index) {
						case 0: // gray
							div.classList.add("slide-in-top");
							break;
						case 1: // howlex
							div.classList.add("slide-in-right");
							break;
						case 2: // belmoth
							div.classList.add("slide-in-bottom");
							break;
						case 3: // original
							div.classList.add("slide-in-left");
							break;
					}
				});

				showingRedCard = false;
				redCard.removeEventListener("animationend", onRedCardAnimationEnd);
			}
		);
	}

	// Función para mostrar una tarjeta específica y ocultar red
	function showCard(cardName) {
		// Ocultar todas las otras tarjetas primero
		cards.forEach((card) => {
			if (!card.classList.contains(cardName)) {
				card.style.visibility = "hidden";
				card.style.opacity = "0";
				card.style.zIndex = "-1";
				card.classList.remove("slide-in-right");
			}
		});

		const currentCard = document.querySelector(`.${cardName}`);

		// Actualizar la posición de la tarjeta para que coincida con div.red
		const redRect = redDiv.getBoundingClientRect();
		currentCard.style.top = redRect.top + "px";
		currentCard.style.left = redRect.left + "px";

		// Ocultar div.red con animación
		redDiv.classList.add("slide-out-left");

		redDiv.addEventListener("animationend", function onRedAnimationEnd() {
			redDiv.style.visibility = "hidden";

			// Mostrar la tarjeta con animación
			currentCard.style.visibility = "visible";
			currentCard.style.opacity = "1";
			currentCard.style.zIndex = "1";
			currentCard.classList.remove("scale-out-center");
			currentCard.classList.add("slide-in-right");

			activeCard = cardName;
			redDiv.removeEventListener("animationend", onRedAnimationEnd);
		});
	}

	// Función para volver a mostrar div.red y contenedor
	function showRedDivAndContainer() {
		const currentCard = document.querySelector(`.${activeCard}`);

		currentCard.classList.remove("slide-in-right");
		currentCard.classList.add("scale-out-center");

		currentCard.addEventListener(
			"animationend",
			function onCardAnimationEnd() {
				currentCard.style.visibility = "hidden";
				currentCard.style.opacity = "0";
				currentCard.style.zIndex = "-1";

				// Mostrar div.red con animación
				redDiv.classList.remove("slide-out-left");
				redDiv.style.visibility = "visible";
				redDiv.style.opacity = "1";
				redDiv.classList.add("slide-in-left");

				redDiv.addEventListener(
					"animationend",
					function onRedDivAnimationEnd() {
						redDiv.classList.remove("slide-in-left");
						activeCard = null;
						redDiv.removeEventListener(
							"animationend",
							onRedDivAnimationEnd
						);
					}
				);

				currentCard.removeEventListener("animationend", onCardAnimationEnd);
			}
		);
	}
});
