import { FieldInput, FormModal, LargeTextArea, Select } from '@hnba/react-ui'
import { opcionDe, textoDeOpcion, valorDeOpcion } from '../../../../utils/opciones'
import { useReasignacion } from '../../hooks/useReasignacion'
import type { ElementoDetalleResponse } from '../../types'

interface ReasignacionFormProps {
    ficha: ElementoDetalleResponse
    onCerrar: () => void
    onReasignado: () => void
}

// Solo con alcance TODO (la pantalla oculta el boton a los demas): se elige el equipo destino y su lider vigente
// pasa a ser el lider del elemento
export const ReasignacionForm = ({ ficha, onCerrar, onReasignado }: ReasignacionFormProps) => {
    const form = useReasignacion(ficha, onReasignado)
    const { formulario, errores } = form

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title={`Reasignar ${ficha.codigo}`}
            primaryLabel="Reasignar"
            loading={form.guardando}
            onClose={onCerrar}
            onSubmit={form.enviar}
        >
            <FieldInput
                label="Equipo"
                errorText={errores.equipoId}
                helperText="Solo equipos activos con líder, distintos del actual. Su líder pasa a ser el líder del elemento. Las fechas no cambian."
            >
                <Select
                    options={form.opcionesEquipo}
                    value={opcionDe(form.opcionesEquipo, formulario.equipoId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable
                    placeholder="Seleccione…"
                    onChange={(opcion) => form.elegirEquipo(opcion.valor)}
                />
            </FieldInput>
            <FieldInput label="Motivo" errorText={errores.motivo}>
                <LargeTextArea value={formulario.motivo} onChange={form.cambiar('motivo')} />
            </FieldInput>
        </FormModal>
    )
}
