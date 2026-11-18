import { DatePicker, FieldInput, FormModal, LargeTextArea } from '@hnba/react-ui'
import { anchoCompleto, rejillaFormulario } from '../../../../styles/disposicion'
import { aFechaApi, formatearFecha } from '../../../../utils/formato'
import { deFechaApi } from '../../fechas'
import { usePlanForm } from '../../hooks/usePlanForm'
import type { ElementoDetalleResponse } from '../../types'
import type { PlanResponse } from '../../typesPlan'

interface PlanFormProps {
    ficha: ElementoDetalleResponse
    // null: plan nuevo
    plan: PlanResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const PlanForm = ({ ficha, plan, onCerrar, onGuardado }: PlanFormProps) => {
    const form = usePlanForm(ficha, plan, onGuardado)
    const { formulario, cambiar, asignar, errores } = form

    return (
        <FormModal
            open
            position="right"
            title={plan ? `Editar plan de ${ficha.codigo}` : `Crear plan de ${ficha.codigo}`}
            loading={form.guardando}
            onClose={onCerrar}
            onSubmit={form.enviar}
        >
            <div style={rejillaFormulario}>
                <div style={anchoCompleto}>
                    <FieldInput label="Objetivo" errorText={errores.objetivo} helperText="Qué se quiere lograr.">
                        <LargeTextArea value={formulario.objetivo} onChange={cambiar('objetivo')} />
                    </FieldInput>
                </div>
                <div style={anchoCompleto}>
                    <FieldInput
                        label="Estrategia"
                        errorText={errores.estrategia}
                        helperText="Cómo se va a resolver el elemento."
                    >
                        <LargeTextArea value={formulario.estrategia} onChange={cambiar('estrategia')} />
                    </FieldInput>
                </div>
                <FieldInput label="Fecha de inicio" errorText={errores.fechaInicio}>
                    <DatePicker
                        value={deFechaApi(formulario.fechaInicio)}
                        placeholder="DD/MM/AAAA"
                        onChange={(fecha) => asignar('fechaInicio', aFechaApi(fecha))}
                    />
                </FieldInput>
                <FieldInput
                    label="Fecha compromiso"
                    errorText={errores.fechaCompromiso}
                    helperText={`Hasta el ${formatearFecha(ficha.fechaCompromisoVigente)}, compromiso del elemento.`}
                >
                    <DatePicker
                        value={deFechaApi(formulario.fechaCompromiso)}
                        minDate={deFechaApi(formulario.fechaInicio) ?? undefined}
                        maxDate={deFechaApi(ficha.fechaCompromisoVigente) ?? undefined}
                        placeholder="DD/MM/AAAA"
                        onChange={(fecha) => asignar('fechaCompromiso', aFechaApi(fecha))}
                    />
                </FieldInput>
            </div>
        </FormModal>
    )
}
