import { Button, DatePicker, FieldInput, LargeTextArea } from '@hnba/react-ui'
import { anchoCompleto } from '../../../../styles/disposicion'
import type { ErroresCampo } from '../../../../utils/erroresCampo'
import { aFechaApi, formatearFecha } from '../../../../utils/formato'
import { deFechaApi } from '../../fechas'
import type { ElementoFormulario } from '../../types'

interface FechasCompromisoProps {
    formulario: ElementoFormulario
    cambiar: (campo: keyof ElementoFormulario) => (valor: string) => void
    asignar: <K extends keyof ElementoFormulario>(campo: K, valor: ElementoFormulario[K]) => void
    errores: ErroresCampo
    fechaSugerida: string
    fechaCompromiso: string
    cambioFecha: boolean
    // Al editar las fechas solo se ven: se cambian con prorrogas y reasignaciones
    soloLectura: boolean
}

// La sugerida es identificacion + plazo de la criticidad (ver useElementoForm)
const ayudaCompromiso = (fechaSugerida: string, cambioFecha: boolean, soloLectura: boolean) => {
    if (fechaSugerida === '') {
        return 'Elija la criticidad para calcular la fecha sugerida.'
    }
    const sugerida = `Sugerida: ${formatearFecha(fechaSugerida)}`
    if (soloLectura) {
        return `${sugerida}.`
    }
    return cambioFecha
        ? `${sugerida}. Al elegir otra fecha debe justificarla.`
        : `${sugerida} (identificación más el plazo de la criticidad).`
}

// Celdas de la rejilla: identificacion y compromiso y, si el usuario cambio la fecha, la justificacion a lo ancho
export const FechasCompromiso = ({
    formulario,
    cambiar,
    asignar,
    errores,
    fechaSugerida,
    fechaCompromiso,
    cambioFecha,
    soloLectura,
}: FechasCompromisoProps) => (
    <>
        <FieldInput
            label="Fecha de identificación"
            errorText={errores.fechaIdentificacion}
            helperText={soloLectura ? undefined : 'Revise las fechas: después de registrar no se pueden cambiar.'}
        >
            <DatePicker
                value={deFechaApi(formulario.fechaIdentificacion)}
                maxDate={new Date()}
                disabled={soloLectura}
                placeholder="DD/MM/AAAA"
                onChange={(fecha) => asignar('fechaIdentificacion', aFechaApi(fecha))}
            />
        </FieldInput>
        <FieldInput
            label={soloLectura ? 'Fecha compromiso original' : 'Fecha compromiso'}
            errorText={errores.fechaCompromisoOriginal}
            helperText={ayudaCompromiso(fechaSugerida, cambioFecha, soloLectura)}
        >
            <DatePicker
                value={deFechaApi(fechaCompromiso)}
                minDate={deFechaApi(formulario.fechaIdentificacion) ?? undefined}
                disabled={soloLectura || fechaSugerida === ''}
                placeholder="DD/MM/AAAA"
                onChange={(fecha) => asignar('fechaCompromiso', aFechaApi(fecha))}
            />
        </FieldInput>
        {cambioFecha && (
            <div style={{ alignSelf: 'center' }}>
                <Button variant="ghost" onClick={() => asignar('fechaCompromiso', '')}>
                    Usar la sugerida
                </Button>
            </div>
        )}
        {(cambioFecha || (soloLectura && formulario.justificacionFecha !== '')) && (
            <div style={anchoCompleto}>
                <FieldInput label="Justificación de la fecha" errorText={errores.justificacionFecha}>
                    <LargeTextArea
                        disabled={soloLectura}
                        value={formulario.justificacionFecha}
                        onChange={cambiar('justificacionFecha')}
                    />
                </FieldInput>
            </div>
        )}
    </>
)
