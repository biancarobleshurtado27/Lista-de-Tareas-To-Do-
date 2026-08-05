// ============================================
// SCRIPT - GESTOR DE CONTACTOS
// ============================================

// Esperamos a que todo el HTML se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Obtener referencias a los elementos del DOM
    const formulario = document.getElementById('formularioContacto');
    const inputNombre = document.getElementById('nombre');
    const inputTelefono = document.getElementById('telefono');
    const inputEmail = document.getElementById('email');

    // 2. Escuchar el evento 'submit' del formulario
    formulario.addEventListener('submit', (e) => {
        // Evitar que la página se recargue al enviar el formulario
        e.preventDefault();

        // 3. Capturar los valores ingresados en los campos
        const nombre = inputNombre.value;
        const telefono = inputTelefono.value;
        const email = inputEmail.value;

        // 4. Mostrar los datos en la consola
        console.log("=== Nuevo Contacto Registrado ===");
        console.log("Nombre:", nombre);
        console.log("Teléfono:", telefono);
        console.log("Correo Electrónico:", email);
        console.log("----------------------------------");

        // (Opcional) Limpiar los campos del formulario después de capturar los datos
        formulario.reset();
    });

});