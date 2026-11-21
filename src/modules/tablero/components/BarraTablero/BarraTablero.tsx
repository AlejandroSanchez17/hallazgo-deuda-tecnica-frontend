import { colors, radius, spacing } from '@hnba/design-tokens'
import { DatePicker, Icon, Select, Text, Tooltip } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { columna, fila } from '../../../../styles/disposicion'
import { aFechaApi, formatearFecha } from '../../../../utils/formato'
import { opcionDe, textoDeOpcion, valorDeOpcion } from '../../../../utils/opciones'
import { deFechaApi } from '../../filtros'
import { OPCIONES_PERIODO } from '../../textos'
import type { FiltrosTablero, OpcionPeriodo } from '../../types'

interface BarraTableroProps {
    filtros: FiltrosTablero
    onFiltrar: (filtros: FiltrosTablero) => void
    // El que aplico el backend: al pasar a Personalizado, las fechas arrancan con el
    periodoAplicado: { desde: string; hasta: string } | null
    errorPeriodo: string | null
}

const AYUDA_PERIODO =
    'El período solo cambia los cerrados, el cumplimiento, el tiempo de cierre y la reapertura; lo demás es la foto de hoy.'

// DatePicker no dibuja borde fuera de FieldInput (que exige etiqueta visible): se enmarca como el Buscador
const marco = (conError: boolean): CSSProperties => ({
    width: 180,
    border: `1px solid ${conError ? colors.semantic.error[700] : colors.brand.gray[400]}`,
    borderRadius: radius.sm,
    background: colors.global.white,
})

// Solo el periodo: la seccion 8.1 no pide otros filtros para el tablero (los demas van en los reportes)
export const BarraTablero = ({ filtros, onFiltrar, periodoAplicado, errorPeriodo }: BarraTableroProps) => {
    const hoy = new Date()

    const elegirPeriodo = (periodo: OpcionPeriodo) =>
        onFiltrar(
            periodo === 'personalizado'
                ? { periodo, desde: periodoAplicado?.desde ?? '', hasta: periodoAplicado?.hasta ?? aFechaApi(hoy) }
                : { periodo, desde: '', hasta: '' },
        )

    const fecha = (campo: 'desde' | 'hasta', etiqueta: string) => {
        const desde = filtros.desde ? deFechaApi(filtros.desde) : undefined
        const hasta = filtros.hasta ? deFechaApi(filtros.hasta) : hoy
        return (
            <div style={fila(spacing.sm)}>
                <Text variant="body-bold-medium" as="span">
                    {etiqueta}
                </Text>
                <div style={marco(campo === 'hasta' && errorPeriodo !== null)}>
                    <DatePicker
                        value={filtros[campo] ? deFechaApi(filtros[campo]) : null}
                        // Desde no pasa de Hasta, y Hasta no baja de Desde ni pasa de hoy
                        minDate={campo === 'hasta' ? desde : undefined}
                        maxDate={campo === 'desde' ? hasta : hoy}
                        placeholder="DD/MM/AAAA"
                        aria-label={etiqueta}
                        aria-invalid={campo === 'hasta' && errorPeriodo !== null}
                        onChange={(nueva) => onFiltrar({ ...filtros, [campo]: aFechaApi(nueva) })}
                    />
                </div>
            </div>
        )
    }

    return (
        <div style={{ ...columna(spacing.xs), alignItems: 'flex-end', flex: '0 0 auto' }}>
            <div style={{ ...fila(spacing.md), justifyContent: 'flex-end' }}>
                <Tooltip content={AYUDA_PERIODO} position="left">
                    <span
                        tabIndex={0}
                        role="img"
                        aria-label={AYUDA_PERIODO}
                        style={{ display: 'inline-flex', color: colors.brand.gray[700], cursor: 'help' }}
                    >
                        <Icon name="info_circle" size={20} />
                    </span>
                </Tooltip>
                <div style={{ width: 220 }}>
                    <Select
                        options={OPCIONES_PERIODO}
                        value={opcionDe(OPCIONES_PERIODO, filtros.periodo)}
                        getLabel={textoDeOpcion}
                        getValue={valorDeOpcion}
                        aria-label="Período"
                        onChange={(opcion) => elegirPeriodo(opcion.valor as OpcionPeriodo)}
                    />
                </div>
                {filtros.periodo === 'personalizado' && (
                    <>
                        {fecha('desde', 'Desde')}
                        {fecha('hasta', 'Hasta')}
                    </>
                )}
            </div>
            {periodoAplicado && (
                <Text variant="body-regular-small" as="p" style={{ color: colors.brand.gray[700], margin: 0 }}>
                    Del <strong>{formatearFecha(periodoAplicado.desde)}</strong> al{' '}
                    <strong>{formatearFecha(periodoAplicado.hasta)}</strong>
                </Text>
            )}
            {errorPeriodo && (
                <Text variant="body-regular-small" as="p" style={{ color: colors.semantic.error[700], margin: 0 }}>
                    {errorPeriodo}
                </Text>
            )}
        </div>
    )
}
