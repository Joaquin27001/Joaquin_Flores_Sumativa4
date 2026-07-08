import React from 'react';

export function FormularioDatoContacto({
    contactos,
    contactoSeleccionado,
    setContactoSeleccionado,
    tipoDato,
    setTipoDato,
    correo,
    setCorreo,
    telefono,
    setTelefono,
    direccion,
    setDireccion,
    errores,
    onSubmit,
}) {
    // Devuelve la clase visual del select según el tipo seleccionado.
    function obtenerClaseTipoDato() {
        if (tipoDato === 'Personal') {
            return 'form-select form-select--personal';
        }

        if (tipoDato === 'Trabajo') {
            return 'form-select form-select--trabajo';
        }

        if (tipoDato === 'Casa') {
            return 'form-select form-select--casa';
        }

        return 'form-select';
    }

    return (
        <form onSubmit={onSubmit} className='border rounded p-3 mb-4'>
            <h5>Agregar dato de contacto</h5>
            <div className='row g-2'>
                <div className='col-md-3'>
                    <select
                        className='form-select'
                        value={contactoSeleccionado}
                        onChange={(e) => setContactoSeleccionado(e.target.value)}
                    >
                        <option value=''>Selecciona un contacto</option>
                        {contactos.map((contacto) => (
                            <option key={contacto.id_contacto} value={contacto.id_contacto}>
                                {contacto.nombre} {contacto.apellido}
                            </option>
                        ))}
                    </select>
                    {errores?.contactoSeleccionado && (
                        <small className='text-danger d-block mt-2'>{errores.contactoSeleccionado}</small>
                    )}
                </div>
                <div className='col-md-3'>
                    <select
                        className={obtenerClaseTipoDato()}
                        value={tipoDato}
                        onChange={(e) => setTipoDato(e.target.value)}
                    >
                        <option value='Personal'>Personal</option>
                        <option value='Trabajo'>Trabajo</option>
                        <option value='Casa'>Casa</option>
                    </select>
                    {errores?.tipoDato && <small className='text-danger d-block mt-2'>{errores.tipoDato}</small>}
                </div>
                <div className='col-md-2'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='Correo'
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    {errores?.correo && <small className='text-danger d-block mt-2'>{errores.correo}</small>}
                </div>
                <div className='col-md-2'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='Teléfono'
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                    {errores?.telefono && <small className='text-danger d-block mt-2'>{errores.telefono}</small>}
                </div>
                <div className='col-md-2'>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='Dirección Postal'
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                    {errores?.direccion && <small className='text-danger d-block mt-2'>{errores.direccion}</small>}
                </div>
                <div className='col-md-12 d-grid mt-2'>
                    <button className='btn btn-primary' type='submit'>
                        Agregar
                    </button>
                </div>
            </div>
        </form>
    );
}