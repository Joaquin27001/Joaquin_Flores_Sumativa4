import React, { useEffect, useState } from 'react';
import { supabase } from '../js/supabase';
import { FormularioDatoContacto } from './FormularioDatoContacto';
import { ContactoItem } from './ContactoItem';
import { validarAgregarDatoContacto, validarCrearContacto } from '../js/ValidacionesFormulario';

export function ListaContactos() {
    // Lista principal de contactos cargada desde Supabase.
    const [contactos, setContactos] = useState([]);
    // Indica si la consulta inicial sigue en curso.
    const [loading, setLoading] = useState(true);
    // Guarda cualquier error de lectura, inserción o eliminación.
    const [error, setError] = useState('');

    // Campos del formulario para crear un contacto nuevo.
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');

    // Campos del formulario para agregar un dato asociado a un contacto.
    const [contactoSeleccionado, setContactoSeleccionado] = useState('');
    const [tipoDato, setTipoDato] = useState('Personal');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [erroresDatos, setErroresDatos] = useState({
        contactoSeleccionado: '',
        tipoDato: '',
        correo: '',
        telefono: '',
        direccion: '',
    });

    function obtenerValorDato(dato) {
        // Devuelve el valor disponible según el campo que tenga contenido.
        return dato.correo || dato.telefono || dato.direccion || '';
    }

    async function cargarContactos() {
        // Activa el indicador de carga antes de consultar la base.
        setLoading(true);

        // Trae contactos y sus datos relacionados en una sola consulta.
        const { data, error: queryError } = await supabase
            .from('contacto')
            .select(
                `
                id_contacto,
                nombre,
                apellido,
                dato_contacto (
                    id_dato_contacto,
                    tipo,
                    correo,
                    telefono,
                    direccion
                )
                `,
            )
            .order('id_contacto', { ascending: true });

        if (queryError) {
            setError(queryError.message);
            setLoading(false);
            return;
        }

        setContactos(data ?? []);
        setError('');
        setLoading(false);
    }

    useEffect(() => {
        // Carga la información apenas monta el componente.
        cargarContactos();
    }, []);

    async function crearContacto(event) {
        event.preventDefault();

        const errorValidacion = validarCrearContacto(nombre, apellido);

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        // Inserta el contacto principal sin datos asociados.
        const { error: insertError } = await supabase.from('contacto').insert({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
        });

        if (insertError) {
            setError(insertError.message);
            return;
        }

        setNombre('');
        setApellido('');
        setError('');
        await cargarContactos();
    }

    async function agregarDatoContacto(event) {
        event.preventDefault();

        const erroresValidacion = validarAgregarDatoContacto(
            contactoSeleccionado,
            tipoDato,
            correo,
            telefono,
            direccion,
        );

        setErroresDatos(erroresValidacion);

        const hayErrores = Object.values(erroresValidacion).some((mensaje) => mensaje !== '');

        if (hayErrores) {
            setError('');
            return;
        }

        // Prepara el payload para la tabla dato_contacto.
        const payload = {
            id_contacto: Number(contactoSeleccionado),
            tipo: tipoDato,
            correo: correo.trim() || null,
            telefono: telefono.trim() || null,
            direccion: direccion.trim() || null,
        };

        const { error: insertError } = await supabase.from('dato_contacto').insert(payload);

        if (insertError) {
            setError(insertError.message);
            return;
        }

        setTipoDato('Personal');
        setCorreo('');
        setTelefono('');
        setDireccion('');
        setErroresDatos({
            contactoSeleccionado: '',
            tipoDato: '',
            correo: '',
            telefono: '',
            direccion: '',
        });
        setError('');
        await cargarContactos();
    }

    async function eliminarDatoContacto(idDatoContacto) {
        const { error: deleteError } = await supabase
            .from('dato_contacto')
            .delete()
            .eq('id_dato_contacto', idDatoContacto);

        if (deleteError) {
            setError(deleteError.message);
            return;
        }

        setError('');
        await cargarContactos();
    }

    async function eliminarContacto(idContacto) {
        // Primero elimina los datos relacionados y luego el contacto principal.
        const { error: deleteDataError } = await supabase
            .from('dato_contacto')
            .delete()
            .eq('id_contacto', idContacto);

        if (deleteDataError) {
            setError(deleteDataError.message);
            return;
        }

        const { error: deleteContactError } = await supabase
            .from('contacto')
            .delete()
            .eq('id_contacto', idContacto);

        if (deleteContactError) {
            setError(deleteContactError.message);
            return;
        }

        setError('');
        await cargarContactos();
    }

    return (
        <div className='container'>
            <h2>Agenda de contactos</h2>

            {/* Muestra el error si alguna operación falla. */}
            {error && <p className='text-danger'>{error}</p>}

            <div className='agenda-layout'>
                <section className='agenda-panel agenda-panel--forms'>
                    {/* Formulario para crear un contacto nuevo. */}
                    <form onSubmit={crearContacto} className='border rounded p-3 mb-3'>
                        <h5>Crear contacto</h5>
                        <div className='row g-2'>
                            <div className='col-md-5'>
                                <input
                                    className='form-control'
                                    type='text'
                                    placeholder='Nombre'
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className='col-md-5'>
                                <input
                                    className='form-control'
                                    type='text'
                                    placeholder='Apellido'
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                            </div>
                            <div className='col-md-2 d-grid'>
                                <button className='btn btn-success' type='submit'>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </form>

                    <FormularioDatoContacto
                        contactos={contactos}
                        contactoSeleccionado={contactoSeleccionado}
                        setContactoSeleccionado={setContactoSeleccionado}
                        tipoDato={tipoDato}
                        setTipoDato={setTipoDato}
                        correo={correo}
                        setCorreo={setCorreo}
                        telefono={telefono}
                        setTelefono={setTelefono}
                        direccion={direccion}
                        setDireccion={setDireccion}
                        errores={erroresDatos}
                        onSubmit={agregarDatoContacto}
                    />
                </section>

                <section className='agenda-panel agenda-panel--list'>
                    {/* Estado de carga de la consulta inicial. */}
                    {loading && <p>Cargando contactos...</p>}

                    {/* Mensaje cuando no hay resultados. */}
                    {!loading && contactos.length === 0 && <p>No hay contactos registrados.</p>}

                    {/* Lista visual de contactos con sus datos asociados. */}
                    {!loading && contactos.length > 0 && (
                        <ul className='list-group'>
                            {contactos.map((contacto) => (
                                <ContactoItem
                                    key={contacto.id_contacto}
                                    contacto={contacto}
                                    obtenerValorDato={obtenerValorDato}
                                    onEliminarContacto={eliminarContacto}
                                    onEliminarDato={eliminarDatoContacto}
                                />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
