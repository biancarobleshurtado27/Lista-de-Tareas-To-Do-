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
    const btnSubmit = document.getElementById('btnSubmit');
    const btnCancelar = document.getElementById('btnCancelar');

    // Referencias a los contenedores de error
    const errorNombre = document.getElementById('error-nombre');
    const errorTelefono = document.getElementById('error-telefono');
    const errorEmail = document.getElementById('error-email');

    // Variable para saber si estamos editando y qué tarjeta estamos editando
    let contactoEnEdicion = null;

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

    // Función para salir del modo edición
    const salirModoEdicion = () => {
        contactoEnEdicion = null;
        formulario.reset();
        btnSubmit.textContent = 'Agregar contacto';
        btnCancelar.style.display = 'none';
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

        // --- LÓGICA DE EDICIÓN O CREACIÓN ---
        if (contactoEnEdicion) {
            // Si estamos editando, actualizamos los elementos existentes
            contactoEnEdicion.querySelector('h3').textContent = nombre;
            const parrafos = contactoEnEdicion.querySelectorAll('p');
            parrafos[0].innerHTML = `<strong>Teléfono:</strong> ${telefono}`;
            parrafos[1].innerHTML = `<strong>Correo:</strong> ${email}`;
            
            salirModoEdicion();
            console.log("Contacto actualizado:", nombre);
        } else {
            // Si no estamos editando, creamos una tarjeta nueva
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
            btnEliminar.addEventListener('click', () => {
                tarjeta.remove();
                verificarListaVacia();
                // Si eliminamos el que estábamos editando, salimos del modo edición
                if (contactoEnEdicion === tarjeta) {
                    salirModoEdicion();
                }
            });

            // --- BOTÓN EDITAR ---
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn-editar');
            btnEditar.addEventListener('click', () => {
                // Cargar datos al formulario
                inputNombre.value = nombre;
                inputTelefono.value = telefono;
                inputEmail.value = email;
                
                // Cambiar a modo edición
                contactoEnEdicion = tarjeta;
                btnSubmit.textContent = 'Guardar Cambios';
                btnCancelar.style.display = 'inline-block'; // Mostrar botón cancelar
                inputNombre.focus();
                
                // Desplazar la pantalla hacia el formulario en móviles
                formulario.scrollIntoView({ behavior: 'smooth' });
            });

            // Ensamblar la tarjeta
            tarjeta.appendChild(tituloNombre);
            tarjeta.appendChild(parrafoTelefono);
            tarjeta.appendChild(parrafoEmail);
            
            // Contenedor para los botones
            const contenedorBotones = document.createElement('div');
            contenedorBotones.classList.add('acciones-tarjeta');
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);
            tarjeta.appendChild(contenedorBotones);

            // Agregar la tarjeta al DOM
            listaContactos.appendChild(tarjeta);

            // Limpiar el formulario
            formulario.reset();
            inputNombre.focus();
            console.log("Contacto agregado:", nombre);
        }
    });

    // Evento para el botón Cancelar
    btnCancelar.addEventListener('click', salirModoEdicion);

});