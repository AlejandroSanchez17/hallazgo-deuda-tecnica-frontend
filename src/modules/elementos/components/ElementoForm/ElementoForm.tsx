import { Alert, FieldInput, FormModal, LargeTextArea, MultiSelect, Select, Text, TextInput } from '@hnba/react-ui'
import { anchoCompleto, rejillaFormulario } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion } from '../../../../utils/opciones'
import { useElementoForm } from '../../hooks/useElementoForm'
import { OPCIONES_TIPO } from '../../textos'
import type { ElementoDetalleResponse, TipoElemento } from '../../types'
import { DatosDeuda } from '../DatosDeuda/DatosDeuda'
import { DatosHallazgo } from '../DatosHallazgo/DatosHallazgo'
import { FechasCompromiso } from '../FechasCompromiso/FechasCompromiso'

interface ElementoFormProps {
    // null: elemento nuevo
    ficha: ElementoDetalleResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const ElementoForm = ({ ficha, onCerrar, onGuardado }: ElementoFormProps) => {
    const form = useElementoForm(ficha, onGuardado)
    const { formulario, cambiar, asignar, opciones, errores, esNuevo } = form
    // 422 en el bloque: falta el del tipo o se mando el del otro tipo
    const errorBloque = errores.hallazgo ?? errores.deuda
    const aplicacionesElegidas = opciones.aplicaciones.filter((opcion) =>
        formulario.aplicacionIds.includes(opcion.valor),
    )

    return (
        <>
            <FormModal
                open
                position="right"
                title={ficha ? `Editar ${ficha.codigo}` : 'Nuevo elemento'}
                loading={form.guardando}
                onClose={onCerrar}
                onSubmit={form.enviar}
            >
                <div style={rejillaFormulario}>
                    <FieldInput
                        label="Tipo"
                        errorText={errores.tipo}
                        helperText={esNuevo ? undefined : 'El tipo no cambia.'}
                    >
                        <Select
                            options={OPCIONES_TIPO}
                            value={opcionDe(OPCIONES_TIPO, formulario.tipo)}
                            getLabel={textoDeOpcion}
                            getValue={valorDeOpcion}
                            disabled={!esNuevo}
                            placeholder="Seleccione…"
                            onChange={(opcion) => asignar('tipo', opcion.valor as TipoElemento)}
                        />
                    </FieldInput>
                    <FieldInput label="Origen" errorText={errores.origenId}>
                        <Select
                            options={opciones.origenes}
                            value={opcionDe(opciones.origenes, formulario.origenId)}
                            getLabel={textoDeOpcion}
                            getValue={valorDeOpcion}
                            searchable
                            placeholder="Seleccione…"
                            onChange={(opcion) => asignar('origenId', opcion.valor)}
                        />
                    </FieldInput>
                    <div style={anchoCompleto}>
                        <FieldInput label="Título" errorText={errores.titulo}>
                            <TextInput maxLength={200} value={formulario.titulo} onChange={cambiar('titulo')} />
                        </FieldInput>
                    </div>
                    <div style={anchoCompleto}>
                        <FieldInput label="Descripción" errorText={errores.descripcion}>
                            <LargeTextArea value={formulario.descripcion} onChange={cambiar('descripcion')} />
                        </FieldInput>
                    </div>
                    <FieldInput
                        label="Criticidad"
                        errorText={errores.criticidadId}
                        helperText={esNuevo ? 'Define el plazo de la fecha sugerida.' : 'La criticidad no cambia.'}
                    >
                        <Select
                            options={opciones.criticidades}
                            value={opcionDe(opciones.criticidades, formulario.criticidadId)}
                            getLabel={textoDeOpcion}
                            getValue={valorDeOpcion}
                            disabled={!esNuevo}
                            placeholder="Seleccione…"
                            onChange={(opcion) => asignar('criticidadId', opcion.valor)}
                        />
                    </FieldInput>
                    <FieldInput
                        label="Equipo"
                        errorText={errores.equipoId}
                        helperText={esNuevo ? 'Solo equipos activos con líder.' : 'Se cambia con una reasignación.'}
                    >
                        <Select
                            options={opciones.equipos}
                            value={opcionDe(opciones.equipos, formulario.equipoId)}
                            getLabel={textoDeOpcion}
                            getValue={valorDeOpcion}
                            disabled={!esNuevo}
                            searchable
                            placeholder="Seleccione…"
                            onChange={(opcion) => asignar('equipoId', opcion.valor)}
                        />
                    </FieldInput>
                    <div style={anchoCompleto}>
                        <FieldInput label="Aplicaciones" optional errorText={errores.aplicacionIds}>
                            <MultiSelect
                                options={opciones.aplicaciones}
                                value={aplicacionesElegidas}
                                getLabel={textoDeOpcion}
                                getValue={valorDeOpcion}
                                searchable
                                placeholder="Seleccione…"
                                onChange={(lista) =>
                                    asignar(
                                        'aplicacionIds',
                                        lista.map((opcion) => opcion.valor),
                                    )
                                }
                            />
                        </FieldInput>
                    </div>
                    <FechasCompromiso
                        formulario={formulario}
                        cambiar={cambiar}
                        asignar={asignar}
                        errores={errores}
                        fechaSugerida={form.fechaSugerida}
                        fechaCompromiso={form.fechaCompromiso}
                        cambioFecha={form.cambioFecha}
                        soloLectura={!esNuevo}
                    />

                    {formulario.tipo !== '' && (
                        <div style={anchoCompleto}>
                            <Text variant="label-bold-large">
                                {formulario.tipo === 'HALLAZGO' ? 'Datos del hallazgo' : 'Datos de la deuda técnica'}
                            </Text>
                        </div>
                    )}
                    {errorBloque && (
                        <div style={anchoCompleto}>
                            <Alert variant="error" description={errorBloque} />
                        </div>
                    )}
                    {formulario.tipo === 'HALLAZGO' && (
                        <DatosHallazgo formulario={formulario} cambiar={cambiar} errores={errores} />
                    )}
                    {formulario.tipo === 'DEUDA' && (
                        <DatosDeuda
                            formulario={formulario}
                            cambiar={cambiar}
                            asignar={asignar}
                            errores={errores}
                            categorias={opciones.categorias}
                        />
                    )}
                </div>
            </FormModal>
            {form.dialogo}
        </>
    )
}
