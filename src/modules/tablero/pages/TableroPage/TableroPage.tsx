import { spacing } from '@hnba/design-tokens'
import { Alert, Loader } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { useEsCompacto } from '../../../../hooks/useEsCompacto'
import { useSaludo } from '../../../../hooks/useSaludo'
import { columna } from '../../../../styles/disposicion'
import { AbiertosPorCriticidad } from '../../components/AbiertosPorCriticidad/AbiertosPorCriticidad'
import { BarraTablero } from '../../components/BarraTablero/BarraTablero'
import { CierrePorCriticidad } from '../../components/CierrePorCriticidad/CierrePorCriticidad'
import { DeudaPorAplicacion } from '../../components/DeudaPorAplicacion/DeudaPorAplicacion'
import { DonaEquipos } from '../../components/DonaEquipos/DonaEquipos'
import { DonaSemaforo } from '../../components/DonaSemaforo/DonaSemaforo'
import { IndicadoresDestacados } from '../../components/IndicadoresDestacados/IndicadoresDestacados'
import { TendenciaMensual } from '../../components/TendenciaMensual/TendenciaMensual'
import { aUrl, deUrl } from '../../filtros'
import { useTablero } from '../../hooks/useTablero'
import type { FiltrosTablero } from '../../types'

// Tres graficos en fila (dona, barras, lineas) y, abajo, equipos y tablas; en modo compacto, uno debajo de otro
const rejillaDe = (esCompacto: boolean, columnas: string, alineacion: CSSProperties['alignItems']): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: esCompacto ? '1fr' : columnas,
    gap: spacing.md,
    alignItems: alineacion,
})

export const TableroPage = () => {
    const [parametros, setParametros] = useSearchParams()
    const filtros = deUrl(parametros)
    const { datos, cargando, error, errorPeriodo } = useTablero(filtros)
    const saludo = useSaludo()
    const esCompacto = useEsCompacto()

    const filtrar = (nuevos: FiltrosTablero) => setParametros(aUrl(nuevos), { replace: true })

    return (
        <Pantalla
            titulo={saludo}
            descripcion="Te damos la bienvenida al tablero de hallazgos y deuda técnica."
            acciones={
                <BarraTablero
                    filtros={filtros}
                    onFiltrar={filtrar}
                    periodoAplicado={datos?.periodo ?? null}
                    errorPeriodo={errorPeriodo}
                />
            }
        >
            {error && !errorPeriodo && <Alert variant="error" description={error.mensaje} />}

            {!datos ? (
                cargando && <Loader tone="dark" label="Cargando el tablero…" />
            ) : (
                <div style={{ ...columna(spacing.md), opacity: cargando ? 0.6 : 1 }} aria-busy={cargando}>
                    <IndicadoresDestacados datos={datos} />

                    <div style={rejillaDe(esCompacto, 'minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr)', 'stretch')}>
                        <DonaSemaforo resumen={datos.resumen} />
                        <CierrePorCriticidad
                            filas={datos.tiempoPromedioCierre.porCriticidad}
                            promedioGlobal={datos.tiempoPromedioCierre.global}
                        />
                        <TendenciaMensual meses={datos.tendencia} periodo={datos.periodo} />
                    </div>

                    <div style={rejillaDe(esCompacto, 'minmax(0, 1.2fr) minmax(0, 1fr)', 'start')}>
                        <div style={columna(spacing.md)}>
                            <DonaEquipos equipos={datos.rankingEquipos} />
                            <AbiertosPorCriticidad filas={datos.abiertosPorTipoCriticidad} />
                        </div>
                        <DeudaPorAplicacion
                            filas={datos.deudaPendiente.porAplicacion}
                            totalHoras={datos.deudaPendiente.totalHoras}
                            elementos={datos.deudaPendiente.elementos}
                        />
                    </div>
                </div>
            )}
        </Pantalla>
    )
}
