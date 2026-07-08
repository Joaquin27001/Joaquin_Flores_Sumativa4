
// Valida los campos del formulario para crear un contacto nuevo.
export function validarCrearContacto(nombre, apellido) {
    if (!nombre.trim() || !apellido.trim()) {
        return "Nombre y apellido son obligatorios.";
    }

    return "";
}

// Valida el formulario de datos asociados a un contacto.
// Se asegura de que exista un contacto seleccionado y de que cada campo
// escrito por el usuario tenga el formato esperado.
export function validarAgregarDatoContacto(contactoSeleccionado, tipoDato, correo, telefono, direccion) {
    const errores = {
        contactoSeleccionado: "",
        tipoDato: "",
        correo: "",
        telefono: "",
        direccion: "",
    };

    if (!contactoSeleccionado) {
        errores.contactoSeleccionado = "Selecciona un contacto.";
    }

    if (tipoDato !== "Personal" && tipoDato !== "Trabajo" && tipoDato !== "Casa") {
        errores.tipoDato = "Selecciona un tipo de dato válido.";
    }

    if (!correo.trim() && !telefono.trim() && !direccion.trim()) {
        errores.correo = "Ingresa al menos un dato de contacto.";
    }

    const errorCorreo = validarCorreo(correo);
    if (errorCorreo) {
        errores.correo = errorCorreo;
    }

    const errorTelefono = validarTelefono(telefono);
    if (errorTelefono) {
        errores.telefono = errorTelefono;
    }

    const errorDireccionPostal = validarDireccionPostal(direccion);
    if (errorDireccionPostal) {
        errores.direccion = errorDireccionPostal;
    }

    return errores;
}

// Valida el formato de correo solamente si el usuario escribió algo.
function validarCorreo(correo) {
    const valor = correo.trim();

    if (valor === "") {
        return "";
    }

    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!patronCorreo.test(valor)) {
        return "Debe ingresar un correo válido.";
    }

    return "";
}

// Valida el teléfono con 9 dígitos numéricos.
function validarTelefono(telefono) {
    const valor = telefono.trim();

    if (valor === "") {
        return "";
    }

    if (validarDigito(valor)) {
        return "El teléfono solo debe contener dígitos.";
    }

    if (valor.length !== 9) {
        return "El teléfono debe tener 9 dígitos.";
    }

    return "";
}

// Valida la dirección postal como código numérico de 7 dígitos.
function validarDireccionPostal(direccion) {
    const valor = direccion.trim();

    if (valor === "") {
        return "";
    }

    if (validarDigito(valor)) {
        return "La dirección postal solo debe contener dígitos.";
    }

    if (valor.length !== 7) {
        return "La dirección postal debe tener 7 dígitos.";
    }

    return "";
}

function validarDigito(palabra){
    for (let i = 0; i < palabra.length; i++){
        if(!(palabra[i] >= '0' && palabra[i] <= '9')){
            return true;
        }
    }
    return false;
}