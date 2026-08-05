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

    // Función para verificar si la lista quedó vacía
    const verificarListaVacia = () => {
        const tarjetas = listaContactos.querySelectorAll('.contacto-card');
        if (tarjetas.length === 0) {
            listaContactos.innerHTML = '<p>No hay contactos registrados.</p>';
        }
    };

    // 2. Escuchar el evento 'submit' del formulario
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();

        let esValido = true;

        // 3. Capturar valores
        const nombre = inputNombre.value.trim();
        const telefono = inputTelefono.value.trim();
        const email = inputEmail.value.trim();

        // --- VALIDACIONES ---
        if (nombre === '') {
            mostrarError(errorNombre, 'El nombre es obligatorio.');
            esValido = false;
        }

        if (telefono === '') {
            mostrarError(errorTelefono, 'El teléfono es obligatorio.');
            esValido = false;
        }

        if (email === '') {
            mostrarError(errorEmail, 'El correo electrónico es obligatorio.');
            esValido = false;
        } else {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                mostrarError(errorEmail, 'Ingresa un formato de correo válido.');
                esValido = false;
            }
        }

        if (!esValido) return;

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

        // --- BOTÓN ELIMINAR ---
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btn-eliminar');
        // Evento para eliminar la tarjeta actual
        btnEliminar.addEventListener('click', () => {
            tarjeta.remove(); // Elimina el div completo de la tarjeta
            verificarListaVacia(); // Verifica si debemos mostrar el mensaje de vacío
        });

        // 6. Ensamblar la tarjeta
        tarjeta.appendChild(tituloNombre);
        tarjeta.appendChild(parrafoTelefono);
        tarjeta.appendChild(parrafoEmail);
        tarjeta.appendChild(btnEliminar); // Agregamos el botón a la tarjeta

        // 7. Agregar la tarjeta al DOM
        listaContactos.appendChild(tarjeta);

        // 8. Limpiar el formulario y enfocar el nombre
        formulario.reset();
        inputNombre.focus();

        console.log("Contacto agregado exitosamente:", nombre);
    });

});