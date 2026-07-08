import React from "react";

export function ContactoItem({ contacto, obtenerValorDato, onEliminar }) {
    // Devuelve el nombre visible del dato según el campo almacenado.
    function obtenerEtiquetaDato(dato) {
        if (dato.correo) {
            return "correo";
        }

        if (dato.telefono) {
            return "telefono";
        }

        if (dato.direccion) {
            return "dirección postal";
        }

        return "dato";
    }

    // Asigna una clase visual al tipo de dato (Personal, Trabajo o Casa).
    function obtenerClaseTipo(tipo) {
        if (tipo === "Personal") {
            return "dato-tipo dato-tipo--personal";
        }

        if (tipo === "Trabajo") {
            return "dato-tipo dato-tipo--trabajo";
        }

        if (tipo === "Casa") {
            return "dato-tipo dato-tipo--casa";
        }

        return "dato-tipo";
    }

    return (
        <li className='list-group-item'>
            <div className='d-flex justify-content-between align-items-start'>
                <div>
                    <strong>
                        {contacto.nombre} {contacto.apellido}
                    </strong>

                    <ul className='mt-2 mb-0'>
                        {(contacto.dato_contacto ?? []).map((dato) => (
                            <li key={dato.id_dato_contacto}>
                                <span className={obtenerClaseTipo(dato.tipo)}>{obtenerEtiquetaDato(dato)}:</span>{' '}
                                {obtenerValorDato(dato) || 'Sin dato'}
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    className='btn btn-sm btn-outline-danger'
                    onClick={() => onEliminar(contacto.id_contacto)}
                    type='button'
                >
                    Eliminar
                </button>
            </div>
        </li>
    );
}