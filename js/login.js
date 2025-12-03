// ============================
// MANEJO DEL DOM + VALIDACIONES
// ============================

const form = document.getElementById("formLogin");
const email = document.getElementById("Email");
const password = document.getElementById("Password");
const emailError = document.getElementById("EmailError");
const passwordError = document.getElementById("PasswordError");

// Validación de formato email
function validarEmail(valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
}

// Limpiar errores en tiempo real
email.addEventListener("input", () => {
    emailError.textContent = "";
    email.classList.remove("input-error");
});

password.addEventListener("input", () => {
    passwordError.textContent = "";
    password.classList.remove("input-error");
});

// ============================
// VALIDACIÓN + LOGIN REAL
// ============================

form.addEventListener("submit", (e) => {
    e.preventDefault(); // evitamos recarga

    let valid = true;

    // --- Validaciones del formulario ---
    if (email.value.trim() === "") {
        emailError.textContent = "El correo es obligatorio";
        email.classList.add("input-error");
        valid = false;
    } else if (!validarEmail(email.value)) {
        emailError.textContent = "Ingrese un correo válido";
        email.classList.add("input-error");
        valid = false;
    }

    if (password.value.trim() === "") {
        passwordError.textContent = "La contraseña es obligatoria";
        password.classList.add("input-error");
        valid = false;
    }

    if (!valid) return;

    // ============================
    // OBTENER USUARIO DEL LOCALSTORAGE
    // ============================

    const userData = JSON.parse(localStorage.getItem("VocatioUser"));

    if (!userData) {
        emailError.textContent = "No existe una cuenta con este correo";
        email.classList.add("input-error");
        return;
    }

    // Validar correo
    if (email.value !== userData.email) {
        emailError.textContent = "Correo incorrecto";
        email.classList.add("input-error");
        return;
    }

    // Validar contraseña
    if (password.value !== userData.password) {
        passwordError.textContent = "Contraseña incorrecta";
        password.classList.add("input-error");
        return;
    }

    // ============================
    // LOGIN EXITOSO → GUARDAR SESIÓN
    // ============================

    localStorage.setItem("VocatioIsLoggedIn", "true");

    // Redirigir al dashboard
    window.location.href = "../pages/dashboard.html";
});
