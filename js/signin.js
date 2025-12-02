document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login_form");

    const firstName = document.getElementById("first_name");
    const lastName = document.getElementById("last_name");
    const birthdate = document.getElementById("birthdate");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");

    // --- CREAR ELEMENTOS DE ERROR (DOM dinámico) ---
    const fields = [firstName, lastName, birthdate, email, password, confirmPassword];

    fields.forEach(field => {
        const error = document.createElement("p");
        error.className = "error-msg";
        error.style.color = "red";
        error.style.fontSize = "13px";
        error.style.margin = "0";
        error.style.display = "none";
        field.parentElement.appendChild(error);
    });

    // --- VALIDACIONES ---
    function showError(input, message) {
        const errorMsg = input.parentElement.querySelector(".error-msg");
        errorMsg.textContent = message;
        errorMsg.style.display = "block";
        input.style.borderColor = "red";
    }

    function clearError(input) {
        const errorMsg = input.parentElement.querySelector(".error-msg");
        errorMsg.style.display = "none";
        input.style.borderColor = "#d4d4d4";
    }

    function validateEmail(emailValue) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    }

    function validateBirthdate(dateValue) {
        const date = new Date(dateValue);
        const today = new Date();
        return date < today; // no admite fechas futuras
    }

    // --- EVENTOS EN TIEMPO REAL ---
    firstName.addEventListener("input", () => clearError(firstName));
    lastName.addEventListener("input", () => clearError(lastName));
    birthdate.addEventListener("change", () => clearError(birthdate));
    email.addEventListener("input", () => clearError(email));
    password.addEventListener("input", () => clearError(password));
    confirmPassword.addEventListener("input", () => clearError(confirmPassword));

    // --- VALIDACIÓN DEL FORMULARIO ---
    form.addEventListener("submit", (e) => {
        let valid = true;

        if (firstName.value.trim() === "") {
            showError(firstName, "El nombre es obligatorio.");
            valid = false;
        }

        if (lastName.value.trim() === "") {
            showError(lastName, "Los apellidos son obligatorios.");
            valid = false;
        }

        if (birthdate.value === "" || !validateBirthdate(birthdate.value)) {
            showError(birthdate, "Ingrese una fecha válida.");
            valid = false;
        }

        if (!validateEmail(email.value)) {
            showError(email, "Correo electrónico inválido.");
            valid = false;
        }

        if (password.value.length < 8) {
            showError(password, "La contraseña debe tener al menos 8 caracteres.");
            valid = false;
        }

        if (confirmPassword.value !== password.value) {
            showError(confirmPassword, "Las contraseñas no coinciden.");
            valid = false;
        }

        if (!valid) {
            e.preventDefault();
        }
    });
});
