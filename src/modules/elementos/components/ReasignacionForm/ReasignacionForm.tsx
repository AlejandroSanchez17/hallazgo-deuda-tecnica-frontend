import { FieldInput, FormModal, LargeTextArea, Select } from '@hnba/react-ui'
import { opcionDe, textoDeOpcion, valorDeOpcion } from '../../../../utils/opciones'
import { useReasignacion } from '../../hooks/useReasignacion'
import type { ElementoDetalleResponse } from '../../types'

interface ReasignacionFormProps {
    ficha: ElementoDetalleResponse
    // Solo con alcance TODO; el lider del equipo (PROPIO) designa al lider entre sus miembros
    cambiaEquipo: boolean
    onCerrar: () => void
    onReasignado: () => void
}

export const ReasignacionForm = ({ ficha, cambiaEquipo, onCerrar, onReasignado }: ReasignacionFormProps) => {
    const form = useReasignacion(ficha, cambiaEquipo, onReasignado)
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
                helperText={
                    cambiaEquipo
                        ? 'Solo equipos activos con líder.'
                        : 'Usted designa al líder entre los miembros de su equipo.'
                }
            >
                <Select
                    options={form.opcionesEquipo}
                    value={opcionDe(form.opcionesEquipo, formulario.equipoId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    disabled={!cambiaEquipo}
                    searchable
                    placeholder="Seleccione…"
                    onChange={(opcion) => form.elegirEquipo(opcion.valor)}
                />
            </FieldInput>
            <FieldInput
                label="Líder"
                errorText={errores.liderId}
                helperText="El líder del equipo o uno de sus miembros. Las fechas no cambian."
            >
                <Select
                    options={form.opcionesLider}
                    value={opcionDe(form.opcionesLider, formulario.liderId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable
                    placeholder="Seleccione…"
                    onChange={(opcion) => form.elegirLider(opcion.valor)}
                />
            </FieldInput>
            <FieldInput label="Motivo" errorText={errores.motivo}>
                <LargeTextArea value={formulario.motivo} onChange={form.cambiar('motivo')} />
            </FieldInput>
        </FormModal>
    )
}
