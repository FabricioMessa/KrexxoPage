document.addEventListener('DOMContentLoaded', () => {
    // BARRA LATERAL
    const barraLateral = document.querySelector(".barra-lateral");
    const spans = document.querySelectorAll("span");

    // Mostrar barra lateral al pasar el cursor
    barraLateral.addEventListener("mouseover", () => {
        barraLateral.classList.remove("mini-barra-lateral");
        spans.forEach(span => {
            span.classList.remove("oculto");
        });
    });

    // Ocultar barra lateral al retirar el cursor
    barraLateral.addEventListener("mouseout", () => {
        barraLateral.classList.add("mini-barra-lateral");
        spans.forEach(span => {
            span.classList.add("oculto");
        });
    });

    //CONTRASEÑA
    const randomLink = document.getElementById('randomLink');
    const modal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    // Mostrar el modal al hacer clic en el enlace
    randomLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previene la navegación predeterminada
        modal.style.display = 'flex'; // Muestra el modal
    });

    // Validar la contraseña
    confirmButton.addEventListener('click', () => {
        const password = passwordInput.value;
        if (password === 'ArequipaGodTier') {
            window.location.href = 'random.html'; // Redirige si la contraseña es correcta
        } else {
            alert('Contraseña incorrecta');
        }
        passwordInput.value = ''; // Limpia el campo de contraseña
        modal.style.display = 'none'; // Oculta el modal
    });

    // Cancelar y cerrar el modal
    cancelButton.addEventListener('click', () => {
        passwordInput.value = ''; // Limpia el campo de contraseña
        modal.style.display = 'none'; // Oculta el modal
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            passwordInput.value = ''; // Limpia el campo de contraseña
            modal.style.display = 'none'; // Oculta el modal
        }
    });
});
