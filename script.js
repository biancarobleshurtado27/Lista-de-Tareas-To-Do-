// ============================================
// SCRIPT - GESTOR DE CONTACTOS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Obtener referencias a los elementos del DOM
    const formulario = document.getElementById('formularioContacto');
    const inputNombre = document.getElementById('nombre');
    const inputTelefono = document.getElementById('telefono');
    const inputEmail = document.getElementById('email');
    const listaContactos = document.getElementById('listaContactos');

    // Referencias a los contenedores de error
    const errorNombre = document.getElementById('error-nombre');
    const errorTelefono = document.getElementById('error-telefono');
    const errorEmail = document.getElementById('error-email');

    // Función para mostrar errores
    const mostrarError = (elementoError, mensaje) => {
        elementoError.textContent = mensaje;
    };

    // Función para limpiar errores
    const limpiarErrores = () => {
        errorNombre.textContent = '';
        errorTelefono.textContent = '';
        errorEmail.textContent = '';
    };

    // 2. Escuchar el evento 'submit' del formulario
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores(); // Limpiar errores previos antes de validar

        let esValido = true;

        // 3. Capturar valores
        const nombre = inputNombre.value.trim();
        const telefono = inputTelefono.value.trim();
        const email = inputEmail.value.trim();

        // --- VALIDACIONES ---

        // Validar Nombre (no vacío)
        if (nombre === '') {
            mostrarError(errorNombre, 'El nombre es obligatorio.');
            esValido = false;
        }

        // Validar Teléfono (no vacío)
        if (telefono === '') {
            mostrarError(errorTelefono, 'El teléfono es obligatorio.');
            esValido = false;
        }

        // Validar Email (no vacío y formato válido)
        if (email === '') {
            mostrarError(errorEmail, 'El correo electrónico es obligatorio.');
            esValido = false;
        } else {
            // Expresión regular básica para validar formato de email
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                mostrarError(errorEmail, 'Ingresa un formato de correo válido.');
                esValido = false;
            }
        }

        // Si hay errores, detener la ejecución y no guardar el contacto
        if (!esValido) {
            return;
        }

        // 4. Eliminar el mensaje de "No hay contactos" si es el primer registro
        const mensajeVacio = listaContactos.querySelector('p');
        if (mensajeVacio) {
            mensajeVacio.remove();
        }

        // 5. Crear la estructura HTML para la tarjeta del contacto
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('contacto-card');

        const tituloNombre = document.createElement('h3');
        tituloNombre.textContent = nombre;

        const parrafoTelefono = document.createElement('p');
        parrafoTelefono.innerHTML = `<strong>Teléfono:</strong> ${telefono}`;

        const parrafoEmail = document.createElement('p');
        parrafoEmail.innerHTML = `<strong>Correo:</strong> ${email}`;

        // 6. Ensamblar la tarjeta
        tarjeta.appendChild(tituloNombre);
        tarjeta.appendChild(parrafoTelefono);
        tarjeta.appendChild(parrafoEmail);

        // 7. Agregar la tarjeta al DOM
        listaContactos.appendChild(tarjeta);

        // 8. Limpiar el formulario automáticamente
        formulario.reset();
        
        // (Opcional) Poner el foco nuevamente en el campo nombre para agregar otro contacto rápido
        inputNombre.focus();

        console.log("Contacto agregado exitosamente:", nombre);
    });

});