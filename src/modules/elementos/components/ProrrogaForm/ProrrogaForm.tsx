import { Alert, DatePicker, FieldInput, FormModal, LargeTextArea } from '@hnba/react-ui'
import { aFechaApi, formatearFecha } from '../../../../utils/formato'
import { deFechaApi } from '../../fechas'
import { primeraFechaPosible, useProrrogaForm } from '../../hooks/useProrrogaForm'
import { AVISO_ADICIONAL, textoCantidad } from '../../textosProrroga'
import type { ProrrogasDelElemento } from '../../typesProrroga'

const MAXIMO_JUSTIFICACION = 2000

interface ProrrogaFormProps {
    elementoId: number
    codigo: string
    resumen: ProrrogasDelElemento
    onCerrar: () => void
    onPedida: () => void
}

// Ventana centrada (dos campos). Muestra cuantas lleva y el maximo (HU-06) y avisa si es adicional (RN-08)
export const ProrrogaForm = ({ elementoId, codigo, resumen, onCerrar, onPedida }: ProrrogaFormProps) => {
    const { fechaPropuesta, setFechaPropuesta, justificacion, setJustificacion, errores, guardando, enviar } =
        useProrrogaForm(elementoId, onPedida)
    const desde = primeraFechaPosible(resumen)

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title={`Pedir prórroga de ${codigo}`}
            primaryLabel="Pedir prórroga"
            loading={guardando}
            onClose={onCerrar}
            onSubmit={enviar}
        >
            <Alert
                variant="info"
                description={`Lleva ${textoCantidad(resumen.aprobadas, resumen.maximo)} que permite su criticidad. Fecha compromiso vigente: ${formatearFecha(resumen.fechaCompromisoVigente)}. La aprueba quien puede aprobar prórrogas.`}
            />
            {resumen.siguienteEsAdicional && (
                <Alert variant="warning" title="Prórroga adicional" description={AVISO_ADICIONAL} />
            )}
            <FieldInput
                label="Nueva fecha compromiso"
                errorText={errores.fechaPropuesta}
                helperText={`Desde el ${formatearFecha(desde)}.`}
            >
                <DatePicker
                    value={deFechaApi(fechaPropuesta)}
                    minDate={deFechaApi(desde) ?? undefined}
                    placeholder="DD/MM/AAAA"
                    onChange={(fecha) => setFechaPropuesta(aFechaApi(fecha))}
                />
            </FieldInput>
            <FieldInput
                label="Justificación"
                errorText={errores.justificacion}
                helperText={`${justificacion.length} de ${MAXIMO_JUSTIFICACION} caracteres`}
            >
                <LargeTextArea value={justificacion} maxLength={MAXIMO_JUSTIFICACION} onChange={setJustificacion} />
            </FieldInput>
        </FormModal>
    )
}
