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
    const inputBuscar = document.getElementById('inputBuscar'); // Nuevo: Campo de búsqueda

    // Referencias a los contenedores de error
    const errorNombre = document.getElementById('error-nombre');
    const errorTelefono = document.getElementById('error-telefono');
    const errorEmail = document.getElementById('error-email');

    // Variable para saber si estamos editando
    let contactoEnEdicion = null;

    // --- FUNCIONES DE UTILIDAD ---

    const mostrarError = (elementoError, mensaje) => {
        elementoError.textContent = mensaje;
    };

    const limpiarErrores = () => {
        errorNombre.textContent = '';
        errorTelefono.textContent = '';
        errorEmail.textContent = '';
    };

    const verificarListaVacia = () => {
        // Solo muestra el mensaje si no hay tarjetas en el DOM
        const tarjetas = listaContactos.querySelectorAll('.contacto-card');
        if (tarjetas.length === 0) {
            listaContactos.innerHTML = '<p>No hay contactos registrados.</p>';
        }
    };

    const salirModoEdicion = () => {
        contactoEnEdicion = null;
        formulario.reset();
        btnSubmit.textContent = 'Agregar contacto';
        btnCancelar.style.display = 'none';
    };

    // --- FUNCIÓN DE BÚSQUEDA EN TIEMPO REAL ---
    const filtrarContactos = () => {
        const textoBusqueda = inputBuscar.value.toLowerCase().trim();
        const tarjetas = listaContactos.querySelectorAll('.contacto-card');
        
        let coincidencias = 0;

        tarjetas.forEach(tarjeta => {
            const nombreContacto = tarjeta.querySelector('h3').textContent.toLowerCase();
            
            if (nombreContacto.includes(textoBusqueda)) {
                tarjeta.style.display = ''; // Mostrar tarjeta (restablece el display flex del CSS)
                coincidencias++;
            } else {
                tarjeta.style.display = 'none'; // Ocultar tarjeta
            }
        });

        // Gestionar el mensaje de "No hay contactos" o "No se encontraron"
        const mensajeActual = listaContactos.querySelector('p');
        if (coincidencias === 0) {
            if (!mensajeActual) {
                const p = document.createElement('p');
                p.textContent = textoBusqueda === '' ? 'No hay contactos registrados.' : 'No se encontraron contactos.';
                listaContactos.insertBefore(p, listaContactos.firstChild);
            } else {
                mensajeActual.textContent = textoBusqueda === '' ? 'No hay contactos registrados.' : 'No se encontraron contactos.';
            }
        } else {
            // Si hay coincidencias, nos aseguramos de quitar el mensaje
            if (mensajeActual) {
                mensajeActual.remove();
            }
        }
    };

    // Escuchar el evento 'input' en la barra de búsqueda
    inputBuscar.addEventListener('input', filtrarContactos);


    // --- LÓGICA DEL FORMULARIO (AGREGAR / EDITAR) ---

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();

        let esValido = true;

        const nombre = inputNombre.value.trim();
        const telefono = inputTelefono.value.trim();
        const email = inputEmail.value.trim();

        // Validaciones
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

        // Eliminar el mensaje de "No hay contactos" si es el primer registro
        const mensajeVacio = listaContactos.querySelector('p');
        if (mensajeVacio) {
            mensajeVacio.remove();
        }

        if (contactoEnEdicion) {
            // MODO EDICIÓN: Actualizar tarjeta existente
            contactoEnEdicion.querySelector('h3').textContent = nombre;
            const parrafos = contactoEnEdicion.querySelectorAll('p');
            parrafos[0].innerHTML = `<strong>Teléfono:</strong> ${telefono}`;
            parrafos[1].innerHTML = `<strong>Correo:</strong> ${email}`;
            
            salirModoEdicion();
            console.log("Contacto actualizado:", nombre);
        } else {
            // MODO CREACIÓN: Crear nueva tarjeta
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('contacto-card');

            const tituloNombre = document.createElement('h3');
            tituloNombre.textContent = nombre;

            const parrafoTelefono = document.createElement('p');
            parrafoTelefono.innerHTML = `<strong>Teléfono:</strong> ${telefono}`;

            const parrafoEmail = document.createElement('p');
            parrafoEmail.innerHTML = `<strong>Correo:</strong> ${email}`;

            // Botón Eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.classList.add('btn-eliminar');
            btnEliminar.addEventListener('click', () => {
                tarjeta.remove();
                verificarListaVacia();
                if (contactoEnEdicion === tarjeta) salirModoEdicion();
            });

            // Botón Editar
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn-editar');
            btnEditar.addEventListener('click', () => {
                inputNombre.value = nombre;
                inputTelefono.value = telefono;
                inputEmail.value = email;
                
                contactoEnEdicion = tarjeta;
                btnSubmit.textContent = 'Guardar Cambios';
                btnCancelar.style.display = 'inline-block';
                inputNombre.focus();
                formulario.scrollIntoView({ behavior: 'smooth' });
            });

            // Ensamblar tarjeta
            tarjeta.appendChild(tituloNombre);
            tarjeta.appendChild(parrafoTelefono);
            tarjeta.appendChild(parrafoEmail);
            
            const contenedorBotones = document.createElement('div');
            contenedorBotones.classList.add('acciones-tarjeta');
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);
            tarjeta.appendChild(contenedorBotones);

            listaContactos.appendChild(tarjeta);

            formulario.reset();
            inputNombre.focus();
            console.log("Contacto agregado:", nombre);
        }

        // Ejecutar el filtro por si acaso acabamos de agregar un contacto que no coincide con la búsqueda actual
        filtrarContactos();
    });

    btnCancelar.addEventListener('click', salirModoEdicion);

});