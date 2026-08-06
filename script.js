document.addEventListener('DOMContentLoaded', () => {
    const $ = (selector) => document.querySelector(selector);
    const formulario = $('#formularioContacto');
    const inputNombre = $('#nombre');
    const inputTelefono = $('#telefono');
    const inputEmail = $('#email');
    const selectCategoria = $('#categoria');
    const listaContactos = $('#listaContactos');
    const inputBuscar = $('#inputBuscar');
    const btnOrdenar = $('#btnOrdenar');
    const btnFavoritos = $('#btnFavoritos');
    const btnVerTodos = $('#btnVerTodos');
    const totalContactos = $('#totalContactos');
    const btnTema = $('#btnTema');
    const estadisticaTotal = $('#estadisticaTotal');
    const estadisticaFavoritos = $('#estadisticaFavoritos');
    const estadisticasCategorias = $('#estadisticasCategorias');
    const modalEditar = $('#modalEditar');
    const formularioEditar = $('#formularioEditar');
    const modalVerContacto = $('#modalVerContacto');
    const detalleContacto = $('#detalleContacto');
    const modalLlamada = $('#modalLlamada');

    let contactos = [];
    let mostrandoSoloFavoritos = false;
    let ordenAscendente = true;
    let ultimoAgregadoId = null;
    let temporizadorLlamada = null;
    let temporizadorCierreLlamada = null;

    const errores = {
        nombre: $('#error-nombre'), telefono: $('#error-telefono'), email: $('#error-email'),
        categoria: $('#error-categoria'), editar: $('#error-editar')
    };
    const telefonoValido = (telefono) => /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/.test(telefono);
    const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const limpiarErrores = () => Object.values(errores).forEach(error => error.textContent = '');
    const guardar = () => localStorage.setItem('contactos', JSON.stringify(contactos));
    const aplicarTema = (tema) => {
        const oscuro = tema === 'oscuro';
        document.body.classList.toggle('modo-oscuro', oscuro);
        btnTema.textContent = oscuro ? '☀ Modo claro' : '☾ Modo oscuro';
        btnTema.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
        btnTema.setAttribute('aria-pressed', String(oscuro));
    };

    const cargar = () => {
        try {
            const guardados = JSON.parse(localStorage.getItem('contactos'));
            contactos = Array.isArray(guardados) ? guardados
                .filter(c => c && typeof c === 'object')
                .map(c => ({
                    ...c,
                    id: String(c.id ?? Date.now()),
                    nombre: String(c.nombre ?? ''),
                    telefono: String(c.telefono ?? ''),
                    email: String(c.email ?? ''),
                    categoria: String(c.categoria || 'Otros'),
                    esFavorito: Boolean(c.esFavorito)
                })) : [];
        } catch {
            contactos = [];
        }
    };
    const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }) * (ordenAscendente ? 1 : -1);
    const crearBoton = (texto, clase, titulo, accion) => {
        const boton = document.createElement('button');
        boton.type = 'button'; boton.className = clase; boton.title = titulo; boton.setAttribute('aria-label', titulo);
        boton.textContent = texto; boton.addEventListener('click', accion);
        return boton;
    };

    const renderizarContactos = () => {
        listaContactos.replaceChildren();
        totalContactos.textContent = contactos.length;
        renderizarEstadisticas();
        const busqueda = inputBuscar.value.trim().toLocaleLowerCase('es');
        const visibles = contactos
            .filter(c => c.nombre.toLocaleLowerCase('es').includes(busqueda))
            .filter(c => !mostrandoSoloFavoritos || c.esFavorito)
            .sort(porNombre);

        if (!visibles.length) {
            const mensaje = document.createElement('p');
            mensaje.textContent = busqueda ? 'No se encontraron contactos.' : mostrandoSoloFavoritos ? 'No tienes contactos marcados como favoritos.' : 'No hay contactos registrados.';
            listaContactos.appendChild(mensaje);
            return;
        }
        visibles.forEach(contacto => listaContactos.appendChild(crearTarjeta(contacto)));
        ultimoAgregadoId = null;
    };

    const renderizarEstadisticas = () => {
        const categorias = ['Familia', 'Trabajo', 'Amigos', 'Otros'];
        estadisticaTotal.textContent = contactos.length;
        estadisticaFavoritos.textContent = contactos.filter(c => c.esFavorito).length;
        estadisticasCategorias.replaceChildren();
        categorias.forEach(nombre => {
            const item = document.createElement('li');
            item.textContent = `${nombre}: ${contactos.filter(c => c.categoria === nombre).length}`;
            estadisticasCategorias.appendChild(item);
        });
    };

    const crearTarjeta = (contacto) => {
        const tarjeta = document.createElement('article');
        tarjeta.className = `contacto-card${contacto.id === ultimoAgregadoId ? ' animacion-agregar' : ''}`;
        tarjeta.setAttribute('role', 'listitem');
        const avatar = document.createElement('div'); avatar.className = 'avatar-contacto'; avatar.textContent = contacto.nombre.charAt(0).toUpperCase();
        const info = document.createElement('div'); info.className = 'info-contacto';
        const encabezado = document.createElement('div'); encabezado.className = 'encabezado-tarjeta';
        const datosTitulo = document.createElement('div');
        const categoria = document.createElement('span'); categoria.className = `badge-categoria categoria-${contacto.categoria.toLowerCase()}`; categoria.textContent = contacto.categoria;
        const nombre = document.createElement('h3'); nombre.textContent = contacto.nombre;
        datosTitulo.append(categoria, nombre);
        const favorito = crearBoton(contacto.esFavorito ? '★' : '☆', `btn-favorito${contacto.esFavorito ? ' favorito-activo' : ''}`, contacto.esFavorito ? 'Quitar de favoritos' : 'Marcar como favorito', () => toggleFavorito(contacto.id));
        favorito.setAttribute('aria-pressed', String(contacto.esFavorito));
        encabezado.append(datosTitulo, favorito);
        const telefono = document.createElement('p'); telefono.innerHTML = '<strong>Teléfono:</strong> '; telefono.append(document.createTextNode(contacto.telefono));
        const email = document.createElement('p'); email.innerHTML = '<strong>Correo:</strong> '; email.append(document.createTextNode(contacto.email));
        const acciones = document.createElement('div'); acciones.className = 'acciones-tarjeta';
        const llamada = crearBoton('☎ Llamar', 'btn-llamar', `Llamar a ${contacto.nombre}`, () => iniciarLlamada(contacto));
        acciones.append(
            llamada,
            crearBoton('Ver contacto', 'btn-ver', `Ver a ${contacto.nombre}`, () => verContacto(contacto.id)),
            crearBoton('Editar', 'btn-editar', `Editar a ${contacto.nombre}`, () => abrirEditar(contacto.id)),
            crearBoton('Eliminar', 'btn-eliminar', `Eliminar a ${contacto.nombre}`, () => eliminarContacto(contacto.id))
        );
        info.append(encabezado, telefono, email, acciones); tarjeta.append(avatar, info);
        return tarjeta;
    };

    const toggleFavorito = (id) => {
        const contacto = contactos.find(c => c.id === String(id));
        if (!contacto) return;
        contacto.esFavorito = !contacto.esFavorito; guardar(); renderizarContactos();
    };
    const abrirEditar = (id) => {
        const c = contactos.find(contacto => contacto.id === String(id)); if (!c) return;
        $('#editarId').value = c.id; $('#editarNombre').value = c.nombre; $('#editarTelefono').value = c.telefono;
        $('#editarEmail').value = c.email; $('#editarCategoria').value = c.categoria; limpiarErrores();
        modalEditar.classList.add('active');
    };
    const cerrarEditar = () => { modalEditar.classList.remove('active'); formularioEditar.reset(); };
    const verContacto = (id) => {
        const c = contactos.find(contacto => contacto.id === String(id)); if (!c) return;
        detalleContacto.replaceChildren();
        const nombre = document.createElement('h4'); nombre.textContent = c.nombre;
        const categoria = document.createElement('span'); categoria.className = `badge-categoria categoria-${c.categoria.toLowerCase()}`; categoria.textContent = c.categoria;
        const tel = document.createElement('p'); tel.innerHTML = '<strong>Teléfono:</strong> '; const enlace = document.createElement('a'); enlace.href = `tel:${c.telefono.replace(/[^+\d]/g, '')}`; enlace.textContent = c.telefono; tel.append(enlace);
        const correo = document.createElement('p'); correo.innerHTML = '<strong>Correo:</strong> '; correo.append(document.createTextNode(c.email));
        detalleContacto.append(nombre, categoria, tel, correo); modalVerContacto.classList.add('active');
    };
    const cerrarDetalle = () => modalVerContacto.classList.remove('active');
    const iniciarLlamada = (contacto) => {
        clearTimeout(temporizadorLlamada);
        clearTimeout(temporizadorCierreLlamada);
        $('#avatarLlamada').textContent = contacto.nombre.charAt(0).toUpperCase();
        $('#nombreLlamada').textContent = contacto.nombre;
        $('#telefonoLlamada').textContent = contacto.telefono;
        $('#estadoLlamada').innerHTML = 'Sonando<span></span>';
        modalLlamada.classList.remove('llamada-finalizada');
        modalLlamada.classList.add('active');
        temporizadorLlamada = setTimeout(() => finalizarLlamada('Llamada finalizada'), 5000);
    };
    const finalizarLlamada = (mensaje = 'Llamada cancelada', cerrarDeInmediato = false) => {
        clearTimeout(temporizadorLlamada);
        clearTimeout(temporizadorCierreLlamada);
        $('#estadoLlamada').textContent = mensaje;
        modalLlamada.classList.add('llamada-finalizada');
        temporizadorCierreLlamada = setTimeout(() => {
            modalLlamada.classList.remove('active', 'llamada-finalizada');
        }, cerrarDeInmediato ? 0 : 2200);
    };
    const eliminarContacto = (id) => {
        const c = contactos.find(contacto => contacto.id === String(id));
        if (c && confirm(`¿Estás seguro de que deseas eliminar a ${c.nombre}?`)) { contactos = contactos.filter(contacto => contacto.id !== String(id)); guardar(); renderizarContactos(); }
    };

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); limpiarErrores();
        const nombre = inputNombre.value.trim(), telefono = inputTelefono.value.trim(), email = inputEmail.value.trim(), categoria = selectCategoria.value;
        let valido = true;
        if (!nombre) { errores.nombre.textContent = 'El nombre es obligatorio.'; valido = false; }
        if (!telefono) { errores.telefono.textContent = 'El teléfono es obligatorio.'; valido = false; } else if (!telefonoValido(telefono)) { errores.telefono.textContent = 'Formato inválido. Usa 8 dígitos.'; valido = false; }
        if (!email) { errores.email.textContent = 'El correo es obligatorio.'; valido = false; } else if (!emailValido(email)) { errores.email.textContent = 'Ingresa un correo válido.'; valido = false; }
        if (!categoria) { errores.categoria.textContent = 'Debes seleccionar una categoría.'; valido = false; }
        if (!valido) return;
        const nuevo = { id: String(Date.now()), nombre, telefono, email, categoria, esFavorito: false };
        contactos.push(nuevo); ultimoAgregadoId = nuevo.id; guardar(); formulario.reset(); inputNombre.focus(); renderizarContactos();
    });

    formularioEditar.addEventListener('submit', (evento) => {
        evento.preventDefault(); limpiarErrores();
        const id = $('#editarId').value, nombre = $('#editarNombre').value.trim(), telefono = $('#editarTelefono').value.trim(), email = $('#editarEmail').value.trim(), categoria = $('#editarCategoria').value;
        if (!nombre || !telefono || !email || !categoria) { errores.editar.textContent = 'Todos los campos son obligatorios.'; return; }
        if (!telefonoValido(telefono)) { errores.editar.textContent = 'Formato de teléfono inválido. Usa 8 dígitos.'; return; }
        if (!emailValido(email)) { errores.editar.textContent = 'Ingresa un correo válido.'; return; }
        const indice = contactos.findIndex(c => c.id === id);
        if (indice >= 0) contactos[indice] = { ...contactos[indice], nombre, telefono, email, categoria };
        guardar(); cerrarEditar(); renderizarContactos();
    });

    inputBuscar.addEventListener('input', renderizarContactos);
    btnVerTodos.addEventListener('click', () => {
        cargar(); // Recupera también los contactos guardados antes de abrir la página.
        inputBuscar.value = '';
        mostrandoSoloFavoritos = false;
        btnFavoritos.textContent = 'Mostrar Favoritos';
        btnFavoritos.classList.remove('active-filtro');
        renderizarContactos();
    });
    btnFavoritos.addEventListener('click', () => { mostrandoSoloFavoritos = !mostrandoSoloFavoritos; btnFavoritos.textContent = mostrandoSoloFavoritos ? 'Ver todos' : 'Mostrar Favoritos'; btnFavoritos.classList.toggle('active-filtro', mostrandoSoloFavoritos); btnFavoritos.setAttribute('aria-pressed', String(mostrandoSoloFavoritos)); renderizarContactos(); });
    btnOrdenar.addEventListener('click', () => { ordenAscendente = !ordenAscendente; btnOrdenar.textContent = ordenAscendente ? 'Ordenar A-Z' : 'Ordenar Z-A'; btnOrdenar.setAttribute('aria-label', ordenAscendente ? 'Ordenar contactos de A a Z' : 'Ordenar contactos de Z a A'); renderizarContactos(); });
    $('#btnCerrarModal').addEventListener('click', cerrarEditar); $('#btnCancelarEdicion').addEventListener('click', cerrarEditar);
    $('#btnCerrarDetalle').addEventListener('click', cerrarDetalle); $('#btnCerrarDetallePie').addEventListener('click', cerrarDetalle);
    $('#btnColgar').addEventListener('click', () => finalizarLlamada('Llamada cancelada', true));
    btnTema.addEventListener('click', () => {
        const tema = document.body.classList.contains('modo-oscuro') ? 'claro' : 'oscuro';
        localStorage.setItem('tema-contactos', tema);
        aplicarTema(tema);
    });
    [modalEditar, modalVerContacto].forEach(modal => modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); }));
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        cerrarEditar(); cerrarDetalle();
        if (modalLlamada.classList.contains('active')) finalizarLlamada('Llamada cancelada', true);
    });
    document.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
    aplicarTema(localStorage.getItem('tema-contactos') || 'claro');
    cargar(); renderizarContactos();
});
