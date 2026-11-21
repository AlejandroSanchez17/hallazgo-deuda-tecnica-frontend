import { spacing } from '@hnba/design-tokens'
import type { CSSProperties } from 'react'
import { CALCULO, contar, formatearDias, formatearHoras, formatearPorcentaje } from '../../textos'
import type { Indicador, TableroResponse } from '../../types'
import { TarjetaKpi } from '../TarjetaKpi/TarjetaKpi'

interface IndicadoresTableroProps {
    datos: TableroResponse
}

const rejilla: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: spacing.md,
}

// "6 de 7 cerrados"; sin base, se dice que no hay
const nDeM = ({ numerador, denominador }: Indicador, sustantivo: string, vacio: string) =>
    denominador === 0 ? vacio : `${numerador} de ${denominador} ${sustantivo}`

// Los seis indicadores de la seccion 8.3, con su calculo a la vista (HU-08)
export const IndicadoresTablero = ({ datos }: IndicadoresTableroProps) => {
    const { kpi, tiempoPromedioCierre: tiempo, deudaPendiente: deuda } = datos
    return (
        <div style={rejilla}>
            <TarjetaKpi
                titulo="Cumplimiento en plazo"
                valor={formatearPorcentaje(kpi.cumplimientoPlazo.valor)}
                detalle={nDeM(kpi.cumplimientoPlazo, 'cerrados a tiempo', 'Sin cerrados en el período')}
                calculo={CALCULO.cumplimientoPlazo}
                delPeriodo
            />
            <TarjetaKpi
                titulo="Vencidos"
                valor={formatearPorcentaje(kpi.vencidos.valor)}
                detalle={nDeM(kpi.vencidos, 'abiertos están vencidos', 'Sin elementos abiertos')}
                calculo={CALCULO.vencidos}
                delPeriodo={false}
            />
            <TarjetaKpi
                titulo="Tiempo promedio de cierre"
                valor={formatearDias(tiempo.global)}
                detalle={
                    tiempo.cerrados === 0
                        ? 'Sin cerrados en el período'
                        : contar(tiempo.cerrados, 'cerrado en el período', 'cerrados en el período')
                }
                calculo={CALCULO.tiempoPromedioCierre}
                delPeriodo
            />
            <TarjetaKpi
                titulo="Tasa de prórrogas"
                valor={formatearPorcentaje(kpi.tasaProrrogas.valor)}
                detalle={nDeM(kpi.tasaProrrogas, 'con plan aprobado tuvieron prórroga', 'Sin planes aprobados')}
                calculo={CALCULO.tasaProrrogas}
                delPeriodo={false}
            />
            <TarjetaKpi
                titulo="Tasa de reapertura"
                valor={formatearPorcentaje(kpi.tasaReapertura.valor)}
                detalle={nDeM(
                    kpi.tasaReapertura,
                    'cierres resueltos fueron rechazados',
                    'Sin cierres resueltos en el período',
                )}
                calculo={CALCULO.tasaReapertura}
                delPeriodo
            />
            <TarjetaKpi
                titulo="Deuda técnica pendiente"
                valor={formatearHoras(deuda.totalHoras)}
                detalle={contar(deuda.elementos, 'elemento de deuda', 'elementos de deuda')}
                calculo={CALCULO.deudaPendiente}
                delPeriodo={false}
            />
        </div>
    )
}
