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

    // 2. Escuchar el evento 'submit' del formulario
    formulario.addEventListener('submit', (e) => {
        // Evitar que la página se recargue
        e.preventDefault();

        // 3. Capturar los valores ingresados
        const nombre = inputNombre.value;
        const telefono = inputTelefono.value;
        const email = inputEmail.value;

        // 4. Eliminar el mensaje de "No hay contactos" si es el primer registro
        const mensajeVacio = listaContactos.querySelector('p');
        if (mensajeVacio) {
            mensajeVacio.remove();
        }

        // 5. Crear la estructura HTML para la tarjeta del contacto
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('contacto-card'); // Clase para estilos futuros

        const tituloNombre = document.createElement('h3');
        tituloNombre.textContent = nombre;

        const parrafoTelefono = document.createElement('p');
        parrafoTelefono.innerHTML = `<strong>Teléfono:</strong> ${telefono}`;

        const parrafoEmail = document.createElement('p');
        parrafoEmail.innerHTML = `<strong>Correo:</strong> ${email}`;

        // 6. Ensamblar la tarjeta agregando los párrafos al div principal
        tarjeta.appendChild(tituloNombre);
        tarjeta.appendChild(parrafoTelefono);
        tarjeta.appendChild(parrafoEmail);

        // 7. Agregar la tarjeta creada al contenedor de la lista en el HTML
        listaContactos.appendChild(tarjeta);

        // 8. Limpiar el formulario para el siguiente contacto
        formulario.reset();
        
        // Nota: Los datos seguirán apareciendo en la consola si quieres mantenerlo, 
        // pero ya son visibles en la pantalla.
        console.log("Contacto agregado:", nombre);
    });

});