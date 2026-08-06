// ============================================
// SCRIPT - GESTOR DE CONTACTOS (CON LOCALSTORAGE)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Referencias al DOM
    const formulario = document.getElementById('formularioContacto');
    const inputNombre = document.getElementById('nombre');
    const inputTelefono = document.getElementById('telefono');
    const inputEmail = document.getElementById('email');
    const selectCategoria = document.getElementById('categoria');
    const listaContactos = document.getElementById('listaContactos');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnCancelar = document.getElementById('btnCancelar');
    const inputBuscar = document.getElementById('inputBuscar');
    const btnOrdenar = document.getElementById('btnOrdenar');
    const totalContactos = document.getElementById('totalContactos');

    const errorNombre = document.getElementById('error-nombre');
    const errorTelefono = document.getElementById('error-telefono');
    const errorEmail = document.getElementById('error-email');
    const errorCategoria = document.getElementById('error-categoria');

    // 2. Estado de la aplicación
    let contactos = [];
    let contactoEnEdicionId = null;

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
        errorCategoria.textContent = '';
    };

    const salirModoEdicion = () => {
        contactoEnEdicionId = null;
        formulario.reset();
        btnSubmit.textContent = 'Agregar contacto';
        btnCancelar.style.display = 'none';
    };

    // --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---
    const renderizarContactos = () => {
        listaContactos.innerHTML = '';
        totalContactos.textContent = contactos.length;

        const textoBusqueda = inputBuscar.value.toLowerCase().trim();
        const contactosFiltrados = contactos.filter(c => c.nombre.toLowerCase().includes(textoBusqueda));

        if (contactosFiltrados.length === 0) {
            const p = document.createElement('p');
            p.textContent = textoBusqueda === '' ? 'No hay contactos registrados.' : 'No se encontraron contactos.';
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

            tarjeta.querySelector('.btn-editar').addEventListener('click', () => iniciarEdicion(contacto.id));
            tarjeta.querySelector('.btn-eliminar').addEventListener('click', () => eliminarContacto(contacto.id));
            tarjeta.querySelector('.btn-favorito').addEventListener('click', () => toggleFavorito(contacto.id));

            listaContactos.appendChild(tarjeta);
        });
    };

    // --- FUNCIONES CRUD ---
    
    const iniciarEdicion = (id) => {
        const contacto = contactos.find(c => c.id === id);
        if (!contacto) return;

        inputNombre.value = contacto.nombre;
        inputTelefono.value = contacto.telefono;
        inputEmail.value = contacto.email;
        selectCategoria.value = contacto.categoria;
        
        contactoEnEdicionId = id;
        btnSubmit.textContent = 'Guardar Cambios';
        btnCancelar.style.display = 'inline-block';
        inputNombre.focus();
        formulario.scrollIntoView({ behavior: 'smooth' });
    };

    const eliminarContacto = (id) => {
        const contacto = contactos.find(c => c.id === id);
        const nombreContacto = contacto ? contacto.nombre : 'este contacto';
        
        const confirmacion = confirm(`¿Estás seguro de que deseas eliminar a ${nombreContacto}?`);
        if (!confirmacion) return;

        contactos = contactos.filter(c => c.id !== id);
        guardarEnLocalStorage();
        renderizarContactos();
        
        if (contactoEnEdicionId === id) {
            salirModoEdicion();
        }
    };

    const toggleFavorito = (id) => {
        const contacto = contactos.find(c => c.id === id);
        if (contacto) {
            contacto.esFavorito = !contacto.esFavorito; // Cambia el estado
            guardarEnLocalStorage();
            renderizarContactos();
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
        const categoria = selectCategoria.value;

        // Validación Nombre
        if (nombre === '') { 
            mostrarError(errorNombre, 'El nombre es obligatorio.'); 
            esValido = false; 
        }
        
        // Validación Teléfono Costa Rica
        if (telefono === '') { 
            mostrarError(errorTelefono, 'El teléfono es obligatorio.'); 
            esValido = false; 
        } else {
            const regexTelefonoCR = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
            if (!regexTelefonoCR.test(telefono)) { 
                mostrarError(errorTelefono, 'Formato inválido. Use 8 dígitos (Ej: 8888-8888 o +506 8888 8888).'); 
                esValido = false; 
            }
        }

        // Validación Email
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

        // Validación Categoría
        if (categoria === '') {
            mostrarError(errorCategoria, 'Debes seleccionar una categoría.');
            esValido = false;
        }

        if (!esValido) return;

        if (contactoEnEdicionId) {
            // ACTUALIZAR EXISTENTE
            const index = contactos.findIndex(c => c.id === contactoEnEdicionId);
            if (index !== -1) {
                // Mantenemos el estado de esFavorito que ya tenía
                const esFavorito = contactos[index].esFavorito;
                contactos[index] = { id: contactoEnEdicionId, nombre, telefono, email, categoria, esFavorito };
            }
            salirModoEdicion();
        } else {
            // AGREGAR NUEVO
            const nuevoContacto = {
                id: Date.now().toString(),
                nombre,
                telefono,
                email,
                categoria,
                esFavorito: false // Nuevo contacto empieza sin ser favorito
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
    cargarDeLocalStorage();
    renderizarContactos();

});