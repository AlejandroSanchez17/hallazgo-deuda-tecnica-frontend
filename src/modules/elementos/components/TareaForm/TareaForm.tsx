import { DatePicker, FieldInput, FormModal, LargeTextArea, Select, TextInput } from '@hnba/react-ui'
import { anchoCompleto, rejillaFormulario } from '../../../../styles/disposicion'
import { aFechaApi, formatearFecha } from '../../../../utils/formato'
import { opcionDe, textoDeOpcion, valorDeOpcion } from '../../../../utils/opciones'
import { deFechaApi } from '../../fechas'
import { useTareaForm } from '../../hooks/useTareaForm'
import type { PlanResponse, TareaResponse } from '../../typesPlan'

interface TareaFormProps {
    plan: PlanResponse
    equipoId: number
    // null: tarea nueva
    tarea: TareaResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const TareaForm = ({ plan, equipoId, tarea, onCerrar, onGuardado }: TareaFormProps) => {
    const form = useTareaForm(plan, equipoId, tarea, onGuardado)
    const { formulario, cambiar, asignar, errores } = form

    return (
        <FormModal
            open
            position="right"
            title={tarea ? 'Editar tarea' : 'Nueva tarea'}
            loading={form.guardando}
            onClose={onCerrar}
            onSubmit={form.enviar}
        >
            <div style={rejillaFormulario}>
                <div style={anchoCompleto}>
                    <FieldInput label="Título" errorText={errores.titulo} helperText="Hasta 200 caracteres.">
                        <TextInput value={formulario.titulo} maxLength={200} onChange={cambiar('titulo')} />
                    </FieldInput>
                </div>
                <FieldInput
                    label="Responsable"
                    errorText={errores.responsableId}
                    helperText="Un miembro del equipo del elemento."
                >
                    <Select
                        options={form.opcionesResponsable}
                        value={opcionDe(form.opcionesResponsable, formulario.responsableId)}
                        getLabel={textoDeOpcion}
                        getValue={valorDeOpcion}
                        searchable
                        placeholder="Seleccione…"
                        onChange={(opcion) => asignar('responsableId', opcion.valor)}
                    />
                </FieldInput>
                <FieldInput label="Peso" errorText={errores.peso} helperText={form.ayudaPeso}>
                    <TextInput value={formulario.peso} inputMode="decimal" onChange={cambiar('peso')} />
                </FieldInput>
                <FieldInput label="Fecha de inicio" errorText={errores.fechaInicio}>
                    <DatePicker
                        value={deFechaApi(formulario.fechaInicio)}
                        placeholder="DD/MM/AAAA"
                        onChange={(fecha) => asignar('fechaInicio', aFechaApi(fecha))}
                    />
                </FieldInput>
                <FieldInput
                    label="Fecha de fin"
                    errorText={errores.fechaFin}
                    helperText={`Hasta el ${formatearFecha(plan.fechaCompromiso)}, compromiso del plan.`}
                >
                    <DatePicker
                        value={deFechaApi(formulario.fechaFin)}
                        minDate={deFechaApi(formulario.fechaInicio) ?? undefined}
                        placeholder="DD/MM/AAAA"
                        onChange={(fecha) => asignar('fechaFin', aFechaApi(fecha))}
                    />
                </FieldInput>
                <div style={anchoCompleto}>
                    <FieldInput
                        label="Depende de"
                        optional
                        errorText={errores.dependeDeId}
                        helperText="La tarea que debe terminar antes de empezar esta."
                    >
                        <Select
                            options={form.opcionesDependencia}
                            value={opcionDe(form.opcionesDependencia, formulario.dependeDeId)}
                            getLabel={textoDeOpcion}
                            getValue={valorDeOpcion}
                            searchable
                            onChange={(opcion) => asignar('dependeDeId', opcion.valor)}
                        />
                    </FieldInput>
                </div>
                <div style={anchoCompleto}>
                    <FieldInput label="Descripción" optional errorText={errores.descripcion}>
                        <LargeTextArea value={formulario.descripcion} onChange={cambiar('descripcion')} />
                    </FieldInput>
                </div>
            </div>
        </FormModal>
    )
}
