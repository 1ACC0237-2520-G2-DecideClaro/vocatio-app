const actual = document.getElementById("ContraseñaActual");
const confirmar = document.getElementById("ConfirmarContraseña");
const errorActual = document.getElementById("errorActual");
const errorConfirmar = document.getElementById("errorConfirmar");

const btnEliminar = document.getElementById("EliminarCuenta");

const modal = document.getElementById("modal");
const cancelarModal = document.getElementById("cancelarModal");
const confirmarModal = document.getElementById("confirmarModal");


// ==== VALIDACIONES EN TIEMPO REAL ====

actual.addEventListener("input", () => {
    if (actual.value.trim().length < 4) {
        errorActual.textContent = "La contraseña debe tener mínimo 4 caracteres";
    } else {
        errorActual.textContent = "";
    }
});

confirmar.addEventListener("input", () => {
    if (confirmar.value !== actual.value) {
        errorConfirmar.textContent = "Las contraseñas no coinciden";
    } else {
        errorConfirmar.textContent = "";
    }
});


// ==== BOTÓN ELIMINAR ====

btnEliminar.addEventListener("click", () => {

    if (actual.value.trim().length < 4) {
        errorActual.textContent = "Contraseña inválida";
        return;
    }

    if (confirmar.value !== actual.value) {
        errorConfirmar.textContent = "Las contraseñas no coinciden";
        return;
    }

    modal.classList.remove("oculto");
});


// ==== MODAL ====

cancelarModal.addEventListener("click", () => {
    modal.classList.add("oculto");
});

confirmarModal.addEventListener("click", () => {
    modal.classList.add("oculto");

    // ============================
    // ELIMINAR DEL LOCALSTORAGE
    // ============================
    localStorage.removeItem("VocatioUser");
    localStorage.removeItem("VocatioIsLoggedIn");

    alert("Tu cuenta ha sido eliminada correctamente.");

    // Redirigir a inicio
    window.location.href = "../index.html";

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

// ====== BOTÓN REGRESAR ======
document.getElementById("Regresar").addEventListener("click", () => {
    window.location.href = "profile.html"; 
});