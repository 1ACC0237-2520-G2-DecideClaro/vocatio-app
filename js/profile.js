// ==============================
//  CARGA DE DATOS AL INICIAR
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    const userData = localStorage.getItem("VocatioUser");

    if (userData) {
        const user = JSON.parse(userData);

        const nombreCompleto = `${user.firstName} ${user.lastName}`;
        document.getElementById("nombreUsuario").textContent = nombreCompleto;
    }
});


// ==============================
//  ELEMENTOS DEL DOM
// ==============================

const nombreInput = document.getElementById("Nombre");
const apellidoInput = document.getElementById("Apellido");

const passActualInput = document.getElementById("Contraseña");
const passNuevaInput = document.getElementById("NuevaContraseña");
const passConfirmInput = document.getElementById("ConfirmarNuevaContraseña");

const btnEliminar = document.getElementById("EliminarCuenta");


// ==============================
//  VALIDACIÓN Y GUARDADO GENERAL
// ==============================

function guardarCambios() {
    const storedUser = JSON.parse(localStorage.getItem("userData")) || {};

    // -------- VALIDACIONES --------
    if (nombreInput.value.trim() === "" || apellidoInput.value.trim() === "") {
        alert("Por favor completa nombre y apellido.");
        return;
    }

    // Validación de contraseña si el usuario intenta cambiarla
    if (passActualInput.value || passNuevaInput.value || passConfirmInput.value) {

        if (!storedUser.password) {
            alert("No hay contraseña registrada.");
            return;
        }

        if (passActualInput.value !== storedUser.password) {
            alert("La contraseña actual no es correcta.");
            return;
        }

        if (passNuevaInput.value.length < 6) {
            alert("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (passNuevaInput.value !== passConfirmInput.value) {
            alert("Las contraseñas nuevas no coinciden.");
            return;
        }

        // Asignar nueva contraseña
        storedUser.password = passNuevaInput.value;
    }

    // Guardar nombres
    storedUser.firstName = nombreInput.value.trim();
    storedUser.lastName = apellidoInput.value.trim();

    // Guardar en almacenamiento local
    localStorage.setItem("userData", JSON.stringify(storedUser));

    alert("Datos actualizados correctamente 🎉");

    // Refrescar el nombre mostrado en el h1
    const h1 = document.querySelector("h1");
    if (h1) h1.textContent = storedUser.firstName;
}


// ==============================
//  EVENTOS
// ==============================

// Guardar automáticamente al cambiar un campo
nombreInput.addEventListener("change", guardarCambios);
apellidoInput.addEventListener("change", guardarCambios);

// Guardar al modificar contraseñas
passConfirmInput.addEventListener("change", guardarCambios);


// ==============================
//  BOTÓN DE ELIMINAR CUENTA
// ==============================

btnEliminar.addEventListener("click", () => {
    window.location.href = "delete-acc.html";  // Redirección
});

// ====== NAVEGACIÓN DEL MENÚ SUPERIOR ======

document.getElementById("VistaGeneral")?.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

document.getElementById("IniciarTest")?.addEventListener("click", () => {
    window.location.href = "test.html";
});

document.getElementById("Explorar")?.addEventListener("click", () => {
    window.location.href = "explore.html";
});

document.getElementById("Informes")?.addEventListener("click", () => {
    window.location.href = "reports.html";
});
