// ============================================
// SCRIPT - GESTOR DE CONTACTOS (CON LOCALSTORAGE)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Referencias al DOM
    const formulario = document.getElementById('formularioContacto');
    const inputNombre = document.getElementById('nombre');
    const inputTelefono = document.getElementById('telefono');
    const inputEmail = document.getElementById('email');
    const listaContactos = document.getElementById('listaContactos');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnCancelar = document.getElementById('btnCancelar');
    const inputBuscar = document.getElementById('inputBuscar');
    const btnOrdenar = document.getElementById('btnOrdenar');
    const totalContactos = document.getElementById('totalContactos');

    const errorNombre = document.getElementById('error-nombre');
    const errorTelefono = document.getElementById('error-telefono');
    const errorEmail = document.getElementById('error-email');

    // 2. Estado de la aplicación
    let contactos = []; // Arreglo principal de contactos
    let contactoEnEdicionId = null; // Guarda el ID del contacto que se edita

    // --- FUNCIONES DE LOCALSTORAGE ---
    const guardarEnLocalStorage = () => {
        localStorage.setItem('contactos', JSON.stringify(contactos));
    };

    const cargarDeLocalStorage = () => {
        const guardados = localStorage.getItem('contactos');
        if (guardados) {
            contactos = JSON.parse(guardados);
        }
    };

    // --- FUNCIONES DE UTILIDAD ---
    const mostrarError = (elementoError, mensaje) => {
        elementoError.textContent = mensaje;
    };

    const limpiarErrores = () => {
        errorNombre.textContent = '';
        errorTelefono.textContent = '';
        errorEmail.textContent = '';
    };

    const salirModoEdicion = () => {
        contactoEnEdicionId = null;
        formulario.reset();
        btnSubmit.textContent = 'Agregar contacto';
        btnCancelar.style.display = 'none';
    };

    // --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---
    const renderizarContactos = () => {
        listaContactos.innerHTML = ''; // Limpiar la pantalla

            // --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---
    const renderizarContactos = () => {
        listaContactos.innerHTML = ''; // Limpiar la pantalla
        
        // Actualizar el contador total (siempre muestra el total real, ignorando el filtro de búsqueda)
        totalContactos.textContent = contactos.length;

        // Aplicar filtro de búsqueda
        const textoBusqueda = inputBuscar.value.toLowerCase().trim();
        // ... resto del código de la función ...
        
        // Aplicar filtro de búsqueda
        const textoBusqueda = inputBuscar.value.toLowerCase().trim();
        const contactosFiltrados = contactos.filter(c => c.nombre.toLowerCase().includes(textoBusqueda));

        // Mostrar mensaje si no hay contactos
        if (contactosFiltrados.length === 0) {
            const p = document.createElement('p');
            p.textContent = textoBusqueda === '' ? 'No hay contactos registrados.' : 'No se encontraron contactos.';
            listaContactos.appendChild(p);
            return;
        }

        // Crear tarjetas para cada contacto
        contactosFiltrados.forEach(contacto => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('contacto-card');

            tarjeta.innerHTML = `
                <h3>${contacto.nombre}</h3>
                <p><strong>Teléfono:</strong> ${contacto.telefono}</p>
                <p><strong>Correo:</strong> ${contacto.email}</p>
                <div class="acciones-tarjeta">
                    <button class="btn-editar" data-id="${contacto.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${contacto.id}">Eliminar</button>
                </div>
            `;

            // Eventos de los botones
            tarjeta.querySelector('.btn-editar').addEventListener('click', () => iniciarEdicion(contacto.id));
            tarjeta.querySelector('.btn-eliminar').addEventListener('click', () => eliminarContacto(contacto.id));

            listaContactos.appendChild(tarjeta);
        });
    };

    // --- FUNCIONES CRUD (Crear, Leer, Actualizar, Eliminar) ---
    
    const iniciarEdicion = (id) => {
        const contacto = contactos.find(c => c.id === id);
        if (!contacto) return;

        inputNombre.value = contacto.nombre;
        inputTelefono.value = contacto.telefono;
        inputEmail.value = contacto.email;
        
        contactoEnEdicionId = id;
        btnSubmit.textContent = 'Guardar Cambios';
        btnCancelar.style.display = 'inline-block';
        inputNombre.focus();
        formulario.scrollIntoView({ behavior: 'smooth' });
    };

       const eliminarContacto = (id) => {
        // Buscar el contacto para obtener su nombre y mostrarlo en el mensaje
        const contacto = contactos.find(c => c.id === id);
        const nombreContacto = contacto ? contacto.nombre : 'este contacto';
        
        // Mostrar ventana de confirmación
        const confirmacion = confirm(`¿Estás seguro de que deseas eliminar a ${nombreContacto}?`);
        
        // Si el usuario presiona "Cancelar", detener la ejecución
        if (!confirmacion) {
            return;
        }

        // Si confirmó, proceder a eliminar
        contactos = contactos.filter(c => c.id !== id);
        guardarEnLocalStorage();
        renderizarContactos();
        
        // Si se eliminó el que estábamos editando, cancelar la edición
        if (contactoEnEdicionId === id) {
            salirModoEdicion();
        }
    };

    // --- EVENTO SUBMIT (Agregar o Guardar) ---
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();

        let esValido = true;
        const nombre = inputNombre.value.trim();
        const telefono = inputTelefono.value.trim();
        const email = inputEmail.value.trim();

        // Validaciones
        if (nombre === '') { mostrarError(errorNombre, 'El nombre es obligatorio.'); esValido = false; }
        if (telefono === '') { mostrarError(errorTelefono, 'El teléfono es obligatorio.'); esValido = false; }
        if (email === '') { mostrarError(errorEmail, 'El correo electrónico es obligatorio.'); esValido = false; } 
        else {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) { mostrarError(errorEmail, 'Ingresa un formato de correo válido.'); esValido = false; }
        }

        if (!esValido) return;

        if (contactoEnEdicionId) {
            // ACTUALIZAR EXISTENTE
            const index = contactos.findIndex(c => c.id === contactoEnEdicionId);
            if (index !== -1) {
                contactos[index] = { id: contactoEnEdicionId, nombre, telefono, email };
            }
            salirModoEdicion();
        } else {
            // AGREGAR NUEVO
            const nuevoContacto = {
                id: Date.now().toString(), // ID único basado en el tiempo
                nombre,
                telefono,
                email
            };
            contactos.push(nuevoContacto);
            formulario.reset();
            inputNombre.focus();
        }

        guardarEnLocalStorage();
        renderizarContactos();
    });

    // --- EVENTOS DE BÚSQUEDA Y ORDENAMIENTO ---
    inputBuscar.addEventListener('input', renderizarContactos);

    btnOrdenar.addEventListener('click', () => {
        contactos.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()));
        guardarEnLocalStorage();
        renderizarContactos();
        
        btnOrdenar.textContent = '¡Ordenado!';
        setTimeout(() => { btnOrdenar.textContent = 'Ordenar A-Z'; }, 1000);
    });

    btnCancelar.addEventListener('click', salirModoEdicion);

    // --- INICIALIZACIÓN ---
    // 1. Cargar datos guardados al iniciar la página
    cargarDeLocalStorage();
    // 2. Dibujar los contactos en la pantalla
    renderizarContactos();

});
// ya hice la 14