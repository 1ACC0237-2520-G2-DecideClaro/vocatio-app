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

    // Simulación de eliminación REAL
    alert("Tu cuenta ha sido eliminada correctamente.");
    console.log("Cuenta eliminada en servidor (simulado)");

    // Redirigir a inicio
    window.location.href = "index.html";
});
