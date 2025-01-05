document.addEventListener('DOMContentLoaded', () => {
    const rectContainers = document.querySelectorAll('.rectangulo-contenedor');
    const cardGroups = document.querySelectorAll('.card-group');
    const cards = document.querySelectorAll('.card');

    // Toggle the visibility of the card group
    rectContainers.forEach((rectContainer, index) => {
        rectContainer.addEventListener('click', () => {
            const cardGroup = cardGroups[index];

            if (!cardGroup) {
                console.error(`No se encontró card-group para rectangulo-contenedor ${index}`);
                return;
            }

            // Oculta otros grupos y reinicia su z-index
            cardGroups.forEach((group, groupIndex) => {
                if (groupIndex !== index) {
                    group.classList.remove('active');
                    group.style.zIndex = '1';
                    group.style.opacity = '0';
                }
            });

            // Obtén las coordenadas absolutas del rectangulo-contenedor
            const rectContainerRect = rectContainer.getBoundingClientRect();
            const rectContainerTop = rectContainerRect.top + window.scrollY;
            const rectContainerLeft = rectContainerRect.left + window.scrollX;

            // Ajusta la posición absoluta del cardGroup
            cardGroup.style.position = 'absolute';
            cardGroup.style.top = `${rectContainerTop + rectContainer.offsetHeight}px`;
            cardGroup.style.left = `${rectContainerLeft}px`;

            // Activa el grupo actual y asegura un z-index alto
            cardGroup.classList.toggle('active');
            cardGroup.style.zIndex = cardGroup.classList.contains('active') ? '10' : '1';
            cardGroup.style.opacity = cardGroup.classList.contains('active') ? '1' : '0';
        });
    });

    // Sidebar expansion logic
    const barraLateral = document.querySelector('.barra-lateral');
    const spans = barraLateral.querySelectorAll('span');

    barraLateral.addEventListener("mouseover", () => {
        barraLateral.classList.add("expandida");
        spans.forEach(span => {
            span.classList.remove("oculto");
        });
    });

    barraLateral.addEventListener("mouseout", () => {
        barraLateral.classList.remove("expandida");
        spans.forEach(span => {
            span.classList.add("oculto");
        });
    });

    // Apply 3D effect to cards
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 3);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 3);

            card.style.transform = `
                perspective(1000px)
                rotateY(${x * 15}deg)
                rotateX(${-y * 15}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });

    // Reset 3D effect on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cards.forEach(card => {
                card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
            });
        }
    });

    // Reset 3D effect on window blur
    window.addEventListener('blur', () => {
        cards.forEach(card => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });
});
    