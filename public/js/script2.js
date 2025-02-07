document.addEventListener("DOMContentLoaded", () => {
	// Selecciona solo los personajes principales, excluyendo los slots de equipo
	const allCharacters = document.querySelectorAll(
		".personajes .character-card"
	);

	const selectTeamBtn1 = document.getElementById("select-team-btn");
	const selectTeamBtn2 = document.getElementById("select-team-btn-2");

	// Correcto selector para los slots del equipo
	const teamSlots1 = document.querySelectorAll(".slot-img");
	const teamSlots2 = document.querySelectorAll(".slot-img2");

	const actionButtons = document.querySelectorAll(".character-action-button");

	//Reset
	const resetButton = document.getElementById("reset-filters-btn");
	const allFilterButtons = document.querySelectorAll(
		".botonLeft, .botonRight, .botonAtributo, .botonChar, .botongenere"
	);

	//Doble filtro
	const dobleFiltroBtn = document.querySelector(".combinacion1");

	// Correcto selector para los botones de características
	const characteristicButtons = document.querySelectorAll(
		".caracteristicas .botonChar"
	);

	let activeFilters = {
		grade: [],
		race: [],
		attribute: [],
		char: [],
		gen: [], // Cambiado de 'characteristic' a 'char'
	};

	let isDoubleFilterEnabled = false;

	// ===================== FILTRADO =====================
	setupFilterButtons(".botonLeft", "grade");
	setupFilterButtons(".botonRight", "race");
	setupFilterButtons(".botonAtributo", "attribute");
	setupFilterButtons(".caracteristicas .botonChar", "char"); // Cambiado 'characteristic' a 'char'
	setupFilterButtons(".botongenere", "gen"); // Cambiado 'characteristic' a 'char'

	function setupFilterButtons(selector, filterType) {
		const buttons = document.querySelectorAll(selector);
		buttons.forEach((button) => {
			button.addEventListener("click", () => {
				const value = button.getAttribute(`data-${filterType}`);
				const isActive = button.classList.contains("active");

				if (isDoubleFilterEnabled) {
					// Modo DOBLE FILTRO: Permite múltiples valores
					if (isActive) {
						button.classList.remove("active");
						activeFilters[filterType] = activeFilters[filterType].filter(
							(v) => v !== value
						);
					} else {
						button.classList.add("active");
						activeFilters[filterType].push(value);
					}
				} else {
					// Modo normal: Sólo permite un filtro activo por tipo
					buttons.forEach((btn) => btn.classList.remove("active"));
					activeFilters[filterType] = [];
					if (!isActive) {
						button.classList.add("active");
						activeFilters[filterType].push(value);
					}
				}

				applyFilters();
			});
		});
	}

	function applyFilters() {
		allCharacters.forEach((card) => {
			// 1) OBTENEMOS si coincide grade, race, attribute, char
			const matchesGrade =
				activeFilters.grade.length === 0 ||
				activeFilters.grade.includes(card.dataset.grade);

			const raceValues = card.dataset.race
				? card.dataset.race.split(" ").map((r) => r.trim())
				: [];
			const matchesRace =
				activeFilters.race.length === 0 ||
				activeFilters.race.some((r) => raceValues.includes(r));

			const matchesAttribute =
				activeFilters.attribute.length === 0 ||
				activeFilters.attribute.includes(card.dataset.attribute);

			const charValues = card.dataset.char
				? card.dataset.char.split(" ").map((c) => c.trim())
				: [];
			const matchesChar =
				activeFilters.char.length === 0 ||
				activeFilters.char.some((c) => charValues.includes(c));

			// 2) AÑADIR LÓGICA PARA GÉNERO
			const genValues = card.dataset.gen
				? card.dataset.gen.split(" ").map((g) => g.trim())
				: [];
			const matchesGen =
				activeFilters.gen.length === 0 ||
				activeFilters.gen.some((g) => genValues.includes(g));

			// === MODO NORMAL (AND ESTRICTO) ===
			if (!isGroupMode) {
				// Todos los "matches" deben ser verdaderos
				if (
					matchesGrade &&
					matchesRace &&
					matchesAttribute &&
					matchesChar &&
					matchesGen
				) {
					card.classList.remove("hidden");
				} else {
					card.classList.add("hidden");
				}
			}
			// === MODO AGRUPAR ===
			else {
				// Lógica OR global (si la categoría no está vacía y coincide en al menos una)
				const noFilters =
					activeFilters.grade.length === 0 &&
					activeFilters.race.length === 0 &&
					activeFilters.attribute.length === 0 &&
					activeFilters.char.length === 0 &&
					activeFilters.gen.length === 0; // <== Importante agregar genere aquí

				const isMatch =
					(activeFilters.grade.length > 0 && matchesGrade) ||
					(activeFilters.race.length > 0 && matchesRace) ||
					(activeFilters.attribute.length > 0 && matchesAttribute) ||
					(activeFilters.char.length > 0 && matchesChar) ||
					(activeFilters.gen.length > 0 && matchesGen);

				if (noFilters || isMatch) {
					card.classList.remove("hidden");
				} else {
					card.classList.add("hidden");
				}
			}
		});
	}

	// ===================== BOTÓN DOBLE FILTRO =====================
	dobleFiltroBtn.addEventListener("click", () => {
		isDoubleFilterEnabled = !isDoubleFilterEnabled; // Alterna el modo DOBLE FILTRO
		dobleFiltroBtn.classList.toggle("active", isDoubleFilterEnabled);

		if (!isDoubleFilterEnabled) {
			// Si desactivamos el DOBLE FILTRO, limpia los valores múltiples
			resetFilters();
		}
	});

	// ===================== SELECCIÓN ALEATORIA =====================
	selectTeamBtn1.addEventListener("click", () => selectRandomTeam(teamSlots1));
	selectTeamBtn2.addEventListener("click", () => selectRandomTeam(teamSlots2));

	function selectRandomTeam(slots) {
		const availableCharacters = Array.from(allCharacters).filter(
			(card) =>
				!card.classList.contains("banned") &&
				!card.classList.contains("hidden")
		);

		if (availableCharacters.length < slots.length) {
			alert("No hay suficientes personajes disponibles.");
			return;
		}

		const selectedCharacters = getRandomCharacters(
			availableCharacters,
			slots.length
		);
		slots.forEach((slot, index) => {
			slot.src = selectedCharacters[index].querySelector("img").src;
		});
	}

	function getRandomCharacters(array, count) {
		const copy = [...array];
		const selected = [];
		while (selected.length < count && copy.length > 0) {
			const idx = Math.floor(Math.random() * copy.length);
			selected.push(copy.splice(idx, 1)[0]);
		}
		return selected;
	}

	// ===================== BOTÓN CAMBIAR =====================
	actionButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const slot = button.closest(".character-card");
			const available = Array.from(allCharacters).filter(
				(card) =>
					!card.classList.contains("banned") &&
					!card.classList.contains("hidden")
			);

			if (available.length === 0) {
				alert("No hay personajes disponibles para cambiar.");
				return;
			}

			const newCharacter = getRandomCharacters(available, 1)[0];
			slot.querySelector("img").src = newCharacter.querySelector("img").src;
		});
	});

	// ===================== BANEAR Y DESBANEAR =====================
	allCharacters.forEach((card) => {
		const banButton = card.querySelector(".ban-button");
		const desbanButton = card.querySelector(".desban-button");

		banButton.addEventListener("click", () => {
			card.classList.add("banned");
			card.querySelector("img").style.opacity = "0.3";
		});

		desbanButton.addEventListener("click", () => {
			card.classList.remove("banned");
			card.querySelector("img").style.opacity = "1";
		});
	});

	// ===================== REINICIAR =====================
	resetButton.addEventListener("click", () => {
		// Alterna la clase 'active' para que cambie la imagen permanentemente
		resetButton.classList.toggle("active");

		// Mantén la lógica que resetea los filtros
		resetFilters();
		applyFilters(); // Aplica los cambios después del reset
	});

	function resetFilters() {
		activeFilters = {
			grade: [],
			race: [],
			attribute: [],
			char: [],
			gen: [],
		};

		allFilterButtons.forEach((button) => button.classList.remove("active")); // Quita la clase 'active' de los botones
		isDoubleFilterEnabled = false; // Desactiva el modo DOBLE FILTRO
		dobleFiltroBtn.classList.remove("active"); // Marca el botón como no activo
		// Quita el modo AGRUPAR
		isGroupMode = false;
		groupBtn.classList.remove("active");
	}
	//RULETA
	const nombresRuleta1 = [
		"Sed de sangre",
		"Campo de batalla ardiente",
		"Cancelación de ventajas",
		"Inmunidad a las desventajas",
		"Recuperación de PS",
		"Muerte inminente",
		"Infatigable",
		"Libre de normas",
		"Sólo cartas de bronce",
	];
	const nombresRuleta3 = [
		"Sin pasivas",
		"Mono-verde",
		"El poder de los pochos",
		"El poder de los Olvidados",
		"Mono-demons",
		"mono-humanos",
		"mono-descos",
		"mono-azul",
		"3vs3",
		"Mono-rojo",
		"Mirror Match",
		"Mi waifu favorita",
		"Llegó el Ragnarok",
		"Esto es una catástrofe",
		"7 pecados en acción",
		"Me echas una colaboración?",
		"Únete a los 10 mandamientos",
		"Reúnanse Dioses",
	];
	const colores = ["#9900DB", "#000000", "#F00101"];
	//const segmentos = nombres.length;
	//const anguloPorSegmento = (2 * Math.PI) / segmentos;

	// Configurar una ruleta genérica
	function configurarRuleta(
		canvasId,
		botonId,
		resultadoId,
		nombresPersonalizados = nombres
	) {
		const canvas = document.getElementById(canvasId);
		canvas.width = 500;
		canvas.height = 500;
		const ctx = canvas.getContext("2d");
		const boton = document.getElementById(botonId);
		const resultado = document.getElementById(resultadoId);
		let anguloActual = 0;

		function dibujarRuleta() {
			const segmentosLocales = nombresPersonalizados.length;
			const anguloPorSegmentoLocal = (2 * Math.PI) / segmentosLocales;

			ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
			for (let i = 0; i < segmentosLocales; i++) {
				const inicioAngulo = anguloActual + i * anguloPorSegmentoLocal;
				const finAngulo = inicioAngulo + anguloPorSegmentoLocal;

				// Dibujar cada segmento
				ctx.beginPath();
				ctx.moveTo(canvas.width / 2, canvas.height / 2);
				ctx.arc(
					canvas.width / 2,
					canvas.height / 2,
					canvas.width / 2,
					inicioAngulo,
					finAngulo
				);
				ctx.fillStyle = colores[i % colores.length];
				ctx.fill();
				ctx.stroke();

				// Dibujar el texto
				ctx.save();
				ctx.translate(canvas.width / 2, canvas.height / 2);
				ctx.rotate(inicioAngulo + anguloPorSegmentoLocal / 2);
				ctx.textAlign = "right";
				ctx.font = "12px Arial";

				// Añadir borde negro al texto
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2; // Grosor del borde
				ctx.strokeText(nombresPersonalizados[i], canvas.width / 2 - 10, 10); // Contorno del texto

				// Dibujar el texto principal encima del borde
				ctx.fillStyle = "white";
				ctx.fillText(nombresPersonalizados[i], canvas.width / 2 - 10, 10);

				ctx.restore();
			}
		}

		function girarRuleta() {
			const segmentosLocales = nombresPersonalizados.length;
			const anguloPorSegmentoLocal = (2 * Math.PI) / segmentosLocales;
			const velocidadInicial = Math.random() * 3 + 7; // Velocidad aleatoria
			const deceleracion = 0.1;
			let velocidad = velocidadInicial;

			function animarGiro() {
				if (velocidad > 0) {
					anguloActual += velocidad;
					velocidad -= deceleracion;
					anguloActual %= 2 * Math.PI;
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					dibujarRuleta();
					requestAnimationFrame(animarGiro);
				} else {
					// Determinar el ganador
					const anguloFinal = (2 * Math.PI - anguloActual) % (2 * Math.PI);
					const indexGanador =
						Math.floor(anguloFinal / anguloPorSegmentoLocal) %
						segmentosLocales;
					resultado.textContent = `${nombresPersonalizados[indexGanador]}`;
					resultado.style.color = "white";
					resultado.style.backgroundColor = "purple"; // Fondo personalizado
					resultado.style.padding = "10px 20px"; // Espaciado interno
					resultado.style.borderRadius = "10px"; // Bordes redondeados
					resultado.style.fontWeight = "bold"; // Texto en negrita
					resultado.style.display = "inline-block"; // Asegura que el fondo respete el tamaño del texto
					resultado.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)"; // Sombra para darle un efecto elegante
					resultado.style.textAlign = "center"; // Centrar el texto
				}
			}

			animarGiro();
		}

		// Dibujar la ruleta inicial
		dibujarRuleta();

		// Asociar el botón de giro
		boton.addEventListener("click", girarRuleta);
	}

	// Configurar Ruleta 2 con entrada dinámica
	// Array donde se almacenan los nombres para la ruleta
	// -------------- RUEDA DE COLORES DE EJEMPLO --------------
	// (Igual que antes)
	// Este array va a contener los nombres que el usuario agrega.
	const nombresRuleta2 = [];

	/**
	 * Configura una ruleta en un <canvas>, con un botón para girar (botonId),
	 * y un campo de texto (inputId) + botón (agregarBotonId) para agregar nombres.
	 * Muestra el resultado en un div (resultadoId).
	 */
	function configurarRuletaConEntrada(
		canvasId,
		botonId,
		resultadoId,
		inputId,
		agregarBotonId
	) {
		const canvas = document.getElementById(canvasId);
		canvas.width = 500;
		canvas.height = 500;
		const ctx = canvas.getContext("2d");
		const boton = document.getElementById(botonId);
		const resultado = document.getElementById(resultadoId);
		const input = document.getElementById(inputId);
		const agregarBoton = document.getElementById(agregarBotonId);
		let anguloActual = 0;

		// Función para dibujar la ruleta
		function dibujarRuleta() {
			const segmentosLocales = nombresRuleta2.length;
			if (segmentosLocales === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				return;
			}

			const anguloPorSegmentoLocal = (2 * Math.PI) / segmentosLocales;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < segmentosLocales; i++) {
				const inicioAngulo = anguloActual + i * anguloPorSegmentoLocal;
				const finAngulo = inicioAngulo + anguloPorSegmentoLocal;

				// Dibuja cada segmento
				ctx.beginPath();
				ctx.moveTo(canvas.width / 2, canvas.height / 2);
				ctx.arc(
					canvas.width / 2,
					canvas.height / 2,
					canvas.width / 2,
					inicioAngulo,
					finAngulo
				);
				ctx.fillStyle = colores[i % colores.length];
				ctx.fill();
				ctx.stroke();

				// Texto dentro del segmento
				ctx.save();
				ctx.translate(canvas.width / 2, canvas.height / 2);
				ctx.rotate(inicioAngulo + anguloPorSegmentoLocal / 2);
				ctx.textAlign = "right";
				ctx.font = "16px Arial";

				// Borde negro al texto
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
				ctx.strokeText(nombresRuleta2[i], canvas.width / 2 - 10, 10);

				// Texto principal
				ctx.fillStyle = "white";
				ctx.fillText(nombresRuleta2[i], canvas.width / 2 - 10, 10);

				ctx.restore();
			}
		}

		// Función para girar la ruleta
		function girarRuleta() {
			const segmentosLocales = nombresRuleta2.length;
			if (segmentosLocales === 0) {
				resultado.textContent = "¡Agrega nombres para girar la ruleta!";
				return;
			}

			const anguloPorSegmentoLocal = (2 * Math.PI) / segmentosLocales;
			const velocidadInicial = Math.random() * 2 + 5;
			const deceleracion = 0.05;
			let velocidad = velocidadInicial;

			function animarGiro() {
				if (velocidad > 0) {
					anguloActual += velocidad;
					velocidad -= deceleracion;
					anguloActual %= 2 * Math.PI;
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					dibujarRuleta();
					requestAnimationFrame(animarGiro);
				} else {
					// Determina el ganador
					const anguloFinal = (2 * Math.PI - anguloActual) % (2 * Math.PI);
					const indexGanador =
						Math.floor(anguloFinal / anguloPorSegmentoLocal) %
						segmentosLocales;
					const ganador = nombresRuleta2[indexGanador];

					// Muestra el ganador y le das estilo
					resultado.textContent = ganador;
					resultado.style.color = "white";
					resultado.style.backgroundColor = "purple";
					resultado.style.padding = "10px 20px";
					resultado.style.borderRadius = "10px";
					resultado.style.fontWeight = "bold";
					resultado.style.display = "inline-block";
					resultado.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
					resultado.style.textAlign = "center";

					// Hacer que sea arrastrable
					resultado.setAttribute("draggable", "true");
				}
			}

			animarGiro();
		}

		// Dibujar la ruleta desde el inicio
		dibujarRuleta();

		// Evento: girar la ruleta
		boton.addEventListener("click", girarRuleta);

		// Evento: agregar nombre al array
		agregarBoton.addEventListener("click", () => {
			const nombre = input.value.trim();
			if (nombre) {
				nombresRuleta2.push(nombre);
				input.value = "";
				dibujarRuleta(); // Redibujamos al cambiar el array
			}
		});
	}

	// ============ DRAG & DROP PARA MÚLTIPLES CONTENEDORES ============

	// Obtenemos la referencia del contenedor del resultado
	const resultadoRuleta2 = document.getElementById("resultadoRuleta2");

	// Nuestras 3 secciones de drop
	const contenedorGanadores = document.getElementById("contenedorGanadores");
	const contenedorPerdedores = document.getElementById("contenedorPerdedores");
	const contenedorAusentes = document.getElementById("contenedorAusentes");

	// 1) Dragstart en el resultado
	resultadoRuleta2.addEventListener("dragstart", (e) => {
		e.dataTransfer.setData("text/plain", resultadoRuleta2.textContent);
	});

	// 2) Helper para configurar una zona de drop
	function configurarDropZone(dropZoneElement) {
		dropZoneElement.addEventListener("dragover", (e) => {
			e.preventDefault();
			dropZoneElement.classList.add("drag-over");
		});

		dropZoneElement.addEventListener("dragleave", () => {
			dropZoneElement.classList.remove("drag-over");
		});

		dropZoneElement.addEventListener("drop", (e) => {
			e.preventDefault();
			dropZoneElement.classList.remove("drag-over");

			// Tomamos el texto arrastrado
			const droppedName = e.dataTransfer.getData("text/plain");

			// Creamos un <p> con ese nombre
			const p = document.createElement("p");
			p.textContent = droppedName;
			dropZoneElement.appendChild(p);

			// Lo eliminamos del array => NO aparece más en la ruleta
			const index = nombresRuleta2.indexOf(droppedName);
			if (index !== -1) {
				nombresRuleta2.splice(index, 1);
			}

			// Limpiamos el resultadoRuleta2
			resultadoRuleta2.textContent = "";
			resultadoRuleta2.removeAttribute("draggable");
		});
	}

	// 3) Configuramos las 3 zonas
	configurarDropZone(contenedorGanadores);
	configurarDropZone(contenedorPerdedores);
	configurarDropZone(contenedorAusentes);

	// Configurar las ruletas
	configurarRuleta(
		"canvasRuleta1",
		"btnRuleta1",
		"resultadoRuleta1",
		nombresRuleta1
	);
	configurarRuletaConEntrada(
		"canvasRuleta2",
		"btnRuleta2",
		"resultadoRuleta2",
		"inputNombreRuleta2",
		"btnAgregarRuleta2"
	);
	configurarRuleta(
		"canvasRuleta3",
		"btnRuleta3",
		"resultadoRuleta3",
		nombresRuleta3
	);

	//TORNEO
	const selectTeamButton = document.getElementById("tourmentButon"); // Botón "Seleccionar Equipo"
	const selectTeamButton2 = document.getElementById("tourmentButon2"); // Botón "Seleccionar Equipo"
	const teamSlots = document.querySelectorAll(".slot-img3"); // Slots vacíos del equipo
	const teamSlotstoo = document.querySelectorAll(".slot-img4"); // Slots vacíos del equipo
	const blockButtons = document.querySelectorAll(".block-action-button");
	let blockedCount = 0; // Contador de personajes bloqueados
	const maxBlocked = 16; // Límite máximo de bloqueos
	let selectedCharactersTeam1 = [];

	selectTeamButton.addEventListener("click", () => {
		// Filtrar personajes disponibles (que no estén ocultos ni baneados)
		const availableCharacters = Array.from(allCharacters).filter(
			(card) =>
				!card.classList.contains("banned") &&
				!card.classList.contains("hidden")
		);

		if (availableCharacters.length < teamSlots.length) {
			alert("No hay suficientes personajes disponibles.");
			return;
		}

		// Selecciona personajes aleatorios
		selectedCharactersTeam1 = getRandomCharacters(
			availableCharacters,
			teamSlots.length
		);

		// Asigna los personajes seleccionados a los slots del equipo 1
		teamSlots.forEach((slot, index) => {
			slot.src = selectedCharactersTeam1[index].querySelector("img").src; // Actualiza la imagen del slot
		});
	});

	selectTeamButton2.addEventListener("click", () => {
		// Filtrar personajes disponibles (excluyendo los ya seleccionados en el equipo 1)
		const availableCharacters = Array.from(allCharacters).filter(
			(card) =>
				!card.classList.contains("banned") &&
				!card.classList.contains("hidden") &&
				!selectedCharactersTeam1.includes(card) // Excluir personajes ya seleccionados
		);

		if (availableCharacters.length < teamSlotstoo.length) {
			alert(
				"No hay suficientes personajes disponibles para el segundo equipo."
			);
			return;
		}

		// Selecciona personajes aleatorios
		const selectedCharactersTeam2 = getRandomCharacters(
			availableCharacters,
			teamSlotstoo.length
		);

		// Asigna los personajes seleccionados a los slots del equipo 2
		teamSlotstoo.forEach((slot, index) => {
			slot.src = selectedCharactersTeam2[index].querySelector("img").src; // Actualiza la imagen del slot
		});
	});

	// Función para seleccionar elementos aleatorios de un array
	function getRandomCharacters(array, count) {
		const copy = [...array];
		const selected = [];
		while (selected.length < count && copy.length > 0) {
			const idx = Math.floor(Math.random() * copy.length);
			selected.push(copy.splice(idx, 1)[0]);
		}
		return selected;
	}

	blockButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const parentCard = button.closest(".character-card-tourment");
			const image = parentCard.querySelector("img");

			if (image.classList.contains("blocked")) {
				// Si ya está bloqueado, desbloquear
				image.classList.remove("blocked");
				blockedCount--; // Disminuye el contador
			} else {
				// Verifica si no supera el límite
				if (blockedCount < maxBlocked) {
					image.classList.add("blocked");
					blockedCount++; // Incrementa el contador
				} else {
					alert(`Solo puedes bloquear hasta ${maxBlocked} personajes.`);
				}
			}
		});
	});

	//AGRUPAR
	const groupBtn = document.querySelector(".combinacion2");
	let isGroupMode = false;

	groupBtn.addEventListener("click", () => {
		// Alterna el modo de agrupación
		isGroupMode = !isGroupMode;

		// Opcional: muestra visualmente que el botón está activo
		groupBtn.classList.toggle("active", isGroupMode);

		// Aplica el nuevo modo de filtro/agrupación
		applyFilters();
	});

	//BANEAR/DESBANEAR
	const banearDesbanearBtn = document.querySelector(".combinacion3");

	// Alterna la clase .active cada vez que se hace clic
	banearDesbanearBtn.addEventListener("click", () => {
		banearDesbanearBtn.classList.toggle("active");
		// Aquí podrías además llamar a la lógica que banea/desbanea efectivamente
	});

	// Supongamos que ya tienes algo como:
	const banAllBtn = document.querySelector(".combinacion3");
	let isBanAll = false;

	// Cuando el usuario baneé/desbanée a 1 personaje:
	allCharacters.forEach((card) => {
		const banButton = card.querySelector(".ban-button");
		const desbanButton = card.querySelector(".desban-button");

		banButton.addEventListener("click", () => {
			card.classList.add("banned");
			card.querySelector("img").style.opacity = "0.3";

			// Si el botón global no está activo, se activa
			if (!banAllBtn.classList.contains("active")) {
				banAllBtn.classList.add("active");
				isBanAll = true;
			}
		});

		desbanButton.addEventListener("click", () => {
			card.classList.remove("banned");
			card.querySelector("img").style.opacity = "1";

			// Si luego de desbanear este personaje, ya no hay NINGUNO baneado, desactiva
			const anyBanned = [...allCharacters].some((c) =>
				c.classList.contains("banned")
			);
			if (!anyBanned) {
				banAllBtn.classList.remove("active");
				isBanAll = false;
			}
		});
	});

	// Finalmente, tu botón "BANEAR / DESBANEAR" global:
	banAllBtn.addEventListener("click", () => {
		// Alterna isBanAll
		isBanAll = !isBanAll;
		banAllBtn.classList.toggle("active", isBanAll);

		if (isBanAll) {
			// BANEAR A TODOS
			allCharacters.forEach((card) => {
				card.classList.add("banned");
				card.querySelector("img").style.opacity = "0.3";
			});
		} else {
			// DESBANEAR A TODOS
			allCharacters.forEach((card) => {
				card.classList.remove("banned");
				card.querySelector("img").style.opacity = "1";
			});
		}
	});

	//BANEAR POR FILTROS
	const banAllFilterBtn = document.querySelector(".combinacion4");
	banAllFilterBtn.addEventListener("click", () => {
		// Filtrar personajes visibles (los que no tienen '.hidden')
		const visibleCharacters = Array.from(allCharacters).filter(
			(card) => !card.classList.contains("hidden")
		);

		// Banearlos
		visibleCharacters.forEach((card) => {
			card.classList.add("banned");
			card.querySelector("img").style.opacity = "0.3";
		});

		// Activa el botón BANEAR/DESBANEAR
		banearDesbanearBtn.classList.add("active");
		isBanAll = true; // O la variable que uses para indicar "hay baneados"
	});

	//CAMBIAR PERSONAJE DENTRO DEL DRAFT
	// 1) Seleccionas todos los botones de la clase .tourment-action-button
	const tourmentActionButtons = document.querySelectorAll(
		".tourment-action-button"
	);

	tourmentActionButtons.forEach((button) => {
		button.addEventListener("click", () => {
			// 2) Encuentra el contenedor padre .character-card-tourment
			const slotCard = button.closest(".character-card-tourment");
			if (!slotCard) return; // Seguridad por si no lo encuentra

			// 3) Toma los personajes disponibles (no baneados ni ocultos)
			const available = Array.from(allCharacters).filter(
				(card) =>
					!card.classList.contains("banned") &&
					!card.classList.contains("hidden")
			);

			if (available.length === 0) {
				alert("No hay personajes disponibles para cambiar.");
				return;
			}

			// 4) Escoge uno al azar con tu función getRandomCharacters()
			const [newCharacter] = getRandomCharacters(available, 1);

			// 5) Cambia la imagen del slot (el primer <img> de la tarjeta .character-card-tourment)
			const slotImg = slotCard.querySelector("img");
			if (slotImg && newCharacter) {
				slotImg.src = newCharacter.querySelector("img").src;
			}
		});
	});

	// Seleccionar los botones pevepe1 y pevepe2
	const pevepe1Button = document.querySelector(".pevepe1");
	const pevepe2Button = document.querySelector(".pevepe2");

	// Seleccionar las imágenes de los personajes en el contenedor1vs1
	const pvp1Image = document.getElementById("pvp1");
	const pvp2Image = document.getElementById("pvp2");

	// Seleccionar las imágenes imash1 e imash2
	const imash1Image = document.getElementById("eslot1");
	const imash2Image = document.getElementById("eslot2");

	// Función para obtener un personaje aleatorio de la matriz de personajes
	function getRandomCharacter() {
		const availableCharacters = Array.from(allCharacters).filter(
			(card) =>
				!card.classList.contains("banned") &&
				!card.classList.contains("hidden")
		);

		if (availableCharacters.length === 0) {
			alert("No hay personajes disponibles.");
			return null;
		}

		const randomIndex = Math.floor(
			Math.random() * availableCharacters.length
		);
		return availableCharacters[randomIndex];
	}

	// Evento para el botón pevepe1
	pevepe1Button.addEventListener("click", () => {
		const randomCharacter = getRandomCharacter();
		if (randomCharacter) {
			const characterImageSrc = randomCharacter.querySelector("img").src;
			pvp1Image.src = characterImageSrc; // Actualizar pvp1
			imash1Image.src = characterImageSrc; // Actualizar imash1
		}
	});

	// Evento para el botón pevepe2
	pevepe2Button.addEventListener("click", () => {
		const randomCharacter = getRandomCharacter();
		if (randomCharacter) {
			const characterImageSrc = randomCharacter.querySelector("img").src;
			pvp2Image.src = characterImageSrc; // Actualizar pvp2
			imash2Image.src = characterImageSrc; // Actualizar imash2
		}
	});
});
