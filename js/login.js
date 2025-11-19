
        // ============================
        // MANEJO DEL DOM + VALIDACIONES
        // ============================

        const form = document.getElementById("formLogin");
        const email = document.getElementById("Email");
        const password = document.getElementById("Password");
        const emailError = document.getElementById("EmailError");
        const passwordError = document.getElementById("PasswordError");

        function validarEmail(valor) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(valor);
        }

        email.addEventListener("input", () => {
            emailError.textContent = "";
            email.classList.remove("input-error");
        });

        password.addEventListener("input", () => {
            passwordError.textContent = "";
            password.classList.remove("input-error");
        });

        form.addEventListener("submit", (e) => {
            let valid = true;

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
            } else if (password.value.length < 6) {
                passwordError.textContent = "La contraseña debe tener al menos 6 caracteres";
                password.classList.add("input-error");
                valid = false;
            }

            if (!valid) e.preventDefault();
        });