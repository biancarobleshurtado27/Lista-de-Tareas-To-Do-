// ============================================
// SCRIPT - GESTOR DE CONTACTOS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Referencias al DOM (Formulario Principal)
    const formulario = document.getElementById('formularioContacto');
    const inputNombre = document.getElementById('nombre');
    const inputTelefono = document.getElementById('telefono');
    const inputEmail = document.getElementById('email');
    const selectCategoria = document.getElementById('categoria');
    
    // Referencias Lista y Filtros
    const listaContactos = document.getElementById('listaContactos');
    const inputBuscar = document.getElementById('inputBuscar');
    const btnOrdenar = document.getElementById('btnOrdenar');
    const btnFavoritos = document.getElementById('btnFavoritos');
    const totalContactos = document.getElementById('totalContactos');

    // Referencias Errores Form Principal
    const errorNombre = document.getElementById('error-nombre');
    const errorTelefono = document.getElementById('error-telefono');
    const errorEmail = document.getElementById('error-email');
    const errorCategoria = document.getElementById('error-categoria');

    // Referencias Modal de Edición
    const modalEditar = document.getElementById('modalEditar');
    const formularioEditar = document.getElementById('formularioEditar');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');
    const editarId = document.getElementById('editarId');
    const editarNombre = document.getElementById('editarNombre');
    const editarTelefono = document.getElementById('editarTelefono');
    const editarEmail = document.getElementById('editarEmail');
    const editarCategoria = document.getElementById('editarCategoria');
    const errorEditar = document.getElementById('error-editar');

    // 2. Estado de la aplicación
    let contactos = [];
    let mostrandoSoloFavoritos = false;

    // --- FUNCIONES DE LOCALSTORAGE ---
    const guardarEnLocalStorage = () => localStorage.setItem('contactos', JSON.stringify(contactos));
    const cargarDeLocalStorage = () => {
        const guardados = localStorage.getItem('contactos');
        if (guardados) contactos = JSON.parse(guardados);
    };

    // --- FUNCIONES DE UTILIDAD ---
    const mostrarError = (elementoError, mensaje) => elementoError.textContent = mensaje;
    const limpiarErrores = () => {
        errorNombre.textContent = ''; errorTelefono.textContent = '';
        errorEmail.textContent = ''; errorCategoria.textContent = '';
        errorEditar.textContent = '';
    };

    // --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---
    const renderizarContactos = () => {
        listaContactos.innerHTML = '';
        totalContactos.textContent = contactos.length;

        const textoBusqueda = inputBuscar.value.toLowerCase().trim();
        let contactosFiltrados = contactos.filter(c => c.nombre.toLowerCase().includes(textoBusqueda));
        
        if (mostrandoSoloFavoritos) {
            contactosFiltrados = contactosFiltrados.filter(c => c.esFavorito);
        }

        if (contactosFiltrados.length === 0) {
            const p = document.createElement('p');
            let mensaje = 'No hay contactos registrados.';
            if (textoBusqueda !== '') mensaje = 'No se encontraron contactos.';
            else if (mostrandoSoloFavoritos) mensaje = 'No tienes contactos marcados como favoritos.';
            p.textContent = mensaje;
            listaContactos.appendChild(p);
            return;
        }

        contactosFiltrados.forEach(contacto => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('contacto-card');

            const claseCategoria = `categoria-${contacto.categoria.toLowerCase()}`;
            const claseFavorito = contacto.esFavorito ? 'favorito-activo' : '';

            tarjeta.innerHTML = `
                <div class="avatar-contacto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <div class="info-contacto">
                    <div class="encabezado-tarjeta">
                        <div>
                            <div class="badge-categoria ${claseCategoria}">${contacto.categoria}</div>
                            <h3>${contacto.nombre}</h3>
                        </div>
                        <button class="btn-favorito ${claseFavorito}" data-id="${contacto.id}" title="Marcar como favorito">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                        </button>
                    </div>
                    <p><strong>Teléfono:</strong> ${contacto.telefono}</p>
                    <p><strong>Correo:</strong> ${contacto.email}</p>
                    <div class="acciones-tarjeta">
                        <button class="btn-editar" data-id="${contacto.id}">Editar</button>
                        <button class="btn-eliminar" data-id="${contacto.id}">Eliminar</button>
                    </div>
                </div>
            `;

            tarjeta.querySelector('.btn-editar').addEventListener('click', () => abrirModalEditar(contacto.id));
            tarjeta.querySelector('.btn-eliminar').addEventListener('click', () => eliminarContacto(contacto.id));
            tarjeta.querySelector('.btn-favorito').addEventListener('click', () => toggleFavorito(contacto.id));

            listaContactos.appendChild(tarjeta);
        });
    };

    // --- FUNCIONES CRUD ---
    
    const abrirModalEditar = (id) => {
        const contacto = contactos.find(c => c.id === id);
        if (!contacto) return;

        editarId.value = contacto.id;
        editarNombre.value = contacto.nombre;
        editarTelefono.value = contacto.telefono;
        editarEmail.value = contacto.email;
        editarCategoria.value = contacto.categoria;
        
        limpiarErrores();
        modalEditar.classList.add('active');
    };

    const cerrarModalEditar = () => {
        modalEditar.classList.remove('active');
        formularioEditar.reset();
    };

    const eliminarContacto = (id) => {
        const contacto = contactos.find(c => c.id === id);
        const nombreContacto = contacto ? contacto.nombre : 'este contacto';
        const confirmacion = confirm(`¿Estás seguro de que deseas eliminar a ${nombreContacto}?`);
        if (!confirmacion) return;

        contactos = contactos.filter(c => c.id !== id);
        guardarEnLocalStorage();
        renderizarContactos();
    };

    const toggleFavorito = (id) => {
        const contacto = contactos.find(c => c.id === id);
        if (contacto) {
            contacto.esFavorito = !contacto.esFavorito; 
            guardarEnLocalStorage();
            renderizarContactos();
        }
    };

    // --- EVENTO SUBMIT FORMULARIO PRINCIPAL (AGREGAR) ---
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();

        let esValido = true;
        const nombre = inputNombre.value.trim();
        const telefono = inputTelefono.value.trim();
        const email = inputEmail.value.trim();
        const categoria = selectCategoria.value;

        if (nombre === '') { mostrarError(errorNombre, 'El nombre es obligatorio.'); esValido = false; }
        if (telefono === '') { mostrarError(errorTelefono, 'El teléfono es obligatorio.'); esValido = false; } 
        else {
            const regexTelefonoCR = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
            if (!regexTelefonoCR.test(telefono)) { mostrarError(errorTelefono, 'Formato inválido. Use 8 dígitos.'); esValido = false; }
        }
        if (email === '') { mostrarError(errorEmail, 'El correo es obligatorio.'); esValido = false; } 
        else {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) { mostrarError(errorEmail, 'Ingresa un formato de correo válido.'); esValido = false; }
        }
        if (categoria === '') { mostrarError(errorCategoria, 'Debes seleccionar una categoría.'); esValido = false; }

        if (!esValido) return;

        const nuevoContacto = {
            id: Date.now().toString(),
            nombre, telefono, email, categoria,
            esFavorito: false 
        };
        contactos.push(nuevoContacto);
        
        guardarEnLocalStorage();
        renderizarContactos();
        formulario.reset();
        inputNombre.focus();
    });

    // --- EVENTO SUBMIT MODAL (EDITAR) ---
    formularioEditar.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();

        let esValido = true;
        const id = editarId.value;
        const nombre = editarNombre.value.trim();
        const telefono = editarTelefono.value.trim();
        const email = editarEmail.value.trim();
        const categoria = editarCategoria.value;

        if (nombre === '' || telefono === '' || email === '') {
            mostrarError(errorEditar, 'Todos los campos son obligatorios.');
            esValido = false;
        }
        const regexTelefonoCR = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
        if (telefono !== '' && !regexTelefonoCR.test(telefono)) {
            mostrarError(errorEditar, 'Formato de teléfono inválido. Use 8 dígitos.');
            esValido = false;
        }

        if (!esValido) return;

        const index = contactos.findIndex(c => c.id === id);
        if (index !== -1) {
            // Mantener el estado de favorito
            const esFavorito = contactos[index].esFavorito;
            contactos[index] = { id, nombre, telefono, email, categoria, esFavorito };
        }

        guardarEnLocalStorage();
        renderizarContactos();
        cerrarModalEditar();
    });

    // --- EVENTOS DE FILTROS, BÚSQUEDA Y MODAL ---
    inputBuscar.addEventListener('input', renderizarContactos);

    btnFavoritos.addEventListener('click', () => {
        mostrandoSoloFavoritos = !mostrandoSoloFavoritos;
        if (mostrandoSoloFavoritos) {
            btnFavoritos.textContent = 'Ver Todos';
            btnFavoritos.classList.add('active-filtro');
        } else {
            btnFavoritos.textContent = 'Mostrar Favoritos';
            btnFavoritos.classList.remove('active-filtro');
        }
        renderizarContactos();
    });

    btnOrdenar.addEventListener('click', () => {
        contactos.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()));
        guardarEnLocalStorage();
        renderizarContactos();
        btnOrdenar.textContent = '¡Ordenado!';
        setTimeout(() => { btnOrdenar.textContent = 'Ordenar A-Z'; }, 1000);
    });

    btnCerrarModal.addEventListener('click', cerrarModalEditar);
    btnCancelarEdicion.addEventListener('click', cerrarModalEditar);

    // Cerrar modal si se hace clic fuera de la tarjeta
    modalEditar.addEventListener('click', (e) => {
        if (e.target === modalEditar) cerrarModalEditar();
    });

    // --- INICIALIZACIÓN ---
    cargarDeLocalStorage();
    renderizarContactos();

});