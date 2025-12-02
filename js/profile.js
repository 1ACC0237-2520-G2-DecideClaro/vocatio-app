// --------------------
// MENÚ HAMBURGUESA
// --------------------
const btnHamburger = document.getElementById("hamburger");
const menuNav = document.querySelector(".header-nav");

btnHamburger.addEventListener("click", () => {
  menuNav.classList.toggle("show");
});


// --------------------
// VALIDACIÓN DEL FORMULARIO
// --------------------

// Selección de campos
const form = document.querySelector(".profile-form");

const campoNombre = document.getElementById("Nombre");
const campoApellido = document.getElementById("Apellido");
const campoContrasena = document.getElementById("Contraseña");
const campoNueva = document.getElementById("NuevaContraseña");
const campoConfirmar = document.getElementById("ConfirmarNuevaContraseña");

// Función para crear mensaje de error
function mostrarError(input, mensaje) {
  limpiarError(input);

  const error = document.createElement("p");
  error.classList.add("error-msg");
  error.textContent = mensaje;

  input.classList.add("input-error");
  input.insertAdjacentElement("afterend", error);
}

// Limpia mensaje de error
function limpiarError(input) {
  input.classList.remove("input-error");

  const siguiente = input.nextElementSibling;
  if (siguiente && siguiente.classList.contains("error-msg")) {
    siguiente.remove();
  }
}

// Validación del nombre
function validarNombre() {
  const valor = campoNombre.value.trim();

  if (valor === "") {
    mostrarError(campoNombre, "El nombre es obligatorio.");
    return false;
  }
  if (valor.length < 2) {
    mostrarError(campoNombre, "Debe tener al menos 2 caracteres.");
    return false;
  }
  if (/\d/.test(valor)) {
    mostrarError(campoNombre, "No debe contener números.");
    return false;
  }

  limpiarError(campoNombre);
  return true;
}

// Validación de apellidos
function validarApellido() {
  const valor = campoApellido.value.trim();

  if (valor === "") {
    mostrarError(campoApellido, "El apellido es obligatorio.");
    return false;
  }
  if (valor.length < 2) {
    mostrarError(campoApellido, "Debe tener al menos 2 caracteres.");
    return false;
  }
  if (/\d/.test(valor)) {
    mostrarError(campoApellido, "No debe contener números.");
    return false;
  }

  limpiarError(campoApellido);
  return true;
}

// Validación de contraseña actual
function validarContrasenaActual() {
  const valor = campoContrasena.value.trim();

  if (valor === "") {
    mostrarError(campoContrasena, "Ingresa tu contraseña actual.");
    return false;
  }

  limpiarError(campoContrasena);
  return true;
}

// Validación nueva contraseña
function validarNuevaContrasena() {
  const valor = campoNueva.value.trim();

  if (valor.length < 6) {
    mostrarError(campoNueva, "Debe tener al menos 6 caracteres.");
    return false;
  }

  limpiarError(campoNueva);
  return true;
}

// Confirmación de nueva contraseña
function validarConfirmacion() {
  if (campoConfirmar.value.trim() !== campoNueva.value.trim()) {
    mostrarError(campoConfirmar, "Las contraseñas no coinciden.");
    return false;
  }

  limpiarError(campoConfirmar);
  return true;
}


// --------------------
// EVENTOS EN LOS INPUTS
// --------------------
campoNombre.addEventListener("input", validarNombre);
campoApellido.addEventListener("input", validarApellido);
campoContrasena.addEventListener("input", validarContrasenaActual);
campoNueva.addEventListener("input", validarNuevaContrasena);
campoConfirmar.addEventListener("input", validarConfirmacion);


// --------------------
// ENVÍO DEL FORMULARIO
// --------------------
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Previene recarga

  const v1 = validarNombre();
  const v2 = validarApellido();
  const v3 = validarContrasenaActual();
  const v4 = validarNuevaContrasena();
  const v5 = validarConfirmacion();

  if (v1 && v2 && v3 && v4 && v5) {
    alert("¡Datos actualizados correctamente!");
    form.reset();
  }
});

  // ==============
  // ELIMINAR CUENTA
  // ==============
  const btnEliminar = document.getElementById("EliminarCuenta");

  btnEliminar.addEventListener("click", (e) => {
    e.preventDefault(); // evita recarga accidental

    // Paso 1: Confirmación inicial
    const confirmacion = confirm("⚠ ¿Seguro que deseas eliminar tu cuenta? Esta acción es irreversible.");

    if (!confirmacion) return;

    // Paso 2: Obtener contraseña actual escrita en el formulario
    const passActual = document.getElementById("Contraseña").value.trim();

    if (passActual === "") {
      alert("Por favor ingresa tu contraseña actual antes de continuar.");
      return;
    }

    // Paso 3: Solicitar confirmación adicional al usuario
    const passIngresada = prompt("Para continuar, escribe tu contraseña actual:");

    // Si cancela el prompt:
    if (passIngresada === null) return;

    // Paso 4: Validar coincidencia
    if (passIngresada === passActual) {
      alert("✅ Tu cuenta ha sido eliminada correctamente.");
      // Ejemplo de redirección:
      // window.location.href = "login.html";
    } else {
      alert("❌ Contraseña incorrecta. No se pudo eliminar tu cuenta.");
    }
  });