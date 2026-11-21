import { spacing } from '@hnba/design-tokens'
import { Badge, Card, Text } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { useEsCompacto } from '../../../../hooks/useEsCompacto'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { contar, formatearNumero, formatearPorcentaje } from '../../textos'
import type { Indicador, TableroResponse } from '../../types'
import { TarjetaKpi } from '../TarjetaKpi/TarjetaKpi'

interface IndicadoresDestacadosProps {
    datos: TableroResponse
}

// "6 de 7 cerrados"; sin base, se dice que no hay
const nDeM = ({ numerador, denominador }: Indicador, sustantivo: string, vacio: string) =>
    denominador === 0 ? vacio : `${numerador} de ${denominador} ${sustantivo}`

// Fila superior: la cifra grande (tiempo de cierre) y tres indicadores con su barra
export const IndicadoresDestacados = ({ datos }: IndicadoresDestacadosProps) => {
    const esCompacto = useEsCompacto()
    const { kpi, tiempoPromedioCierre: tiempo } = datos
    const rejilla: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: esCompacto ? '1fr' : 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))',
        gap: spacing.md,
        alignItems: 'stretch',
    }

    return (
        <div style={rejilla}>
            <Card padding={spacing.md} style={{ height: '100%' }}>
                <div style={columna(spacing.sm)}>
                    <Text variant="body-bold-medium" as="h3" style={{ margin: 0 }}>
                        Tiempo promedio de cierre
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.sm }}>
                        <Text variant="h1" as="p" style={{ margin: 0, fontSize: 56, lineHeight: 1 }}>
                            {tiempo.global === null ? '—' : formatearNumero(tiempo.global)}
                        </Text>
                        {tiempo.global !== null && (
                            <Text variant="body-bold-large" as="span" style={textoSecundario}>
                                {tiempo.global === 1 ? 'día' : 'días'}
                            </Text>
                        )}
                    </div>
                    <Text variant="body-regular-small" as="p" style={textoSecundario}>
                        Entre la identificación y el cierre, de los elementos cerrados en el período.
                    </Text>
                    <div>
                        <Badge
                            status="info"
                            label={
                                tiempo.cerrados === 0
                                    ? 'Sin cerrados en el período'
                                    : contar(tiempo.cerrados, 'cerrado en el período', 'cerrados en el período')
                            }
                        />
                    </div>
                </div>
            </Card>
            <TarjetaKpi
                titulo="Cumplimiento en plazo"
                valor={formatearPorcentaje(kpi.cumplimientoPlazo.valor)}
                progreso={kpi.cumplimientoPlazo.valor}
                detalle={nDeM(kpi.cumplimientoPlazo, 'cerrados a tiempo', 'Sin cerrados en el período')}
                calculo=""
                delPeriodo
            />
            <TarjetaKpi
                titulo="Tasa de prórrogas"
                valor={formatearPorcentaje(kpi.tasaProrrogas.valor)}
                progreso={kpi.tasaProrrogas.valor}
                detalle={nDeM(kpi.tasaProrrogas, 'con plan aprobado tuvieron prórroga', 'Sin planes aprobados')}
                calculo=""
                delPeriodo={false}
            />
            <TarjetaKpi
                titulo="Tasa de reapertura"
                valor={formatearPorcentaje(kpi.tasaReapertura.valor)}
                progreso={kpi.tasaReapertura.valor}
                detalle={nDeM(kpi.tasaReapertura, 'cierres resueltos fueron rechazados', 'Sin cierres resueltos')}
                calculo=""
                delPeriodo
            />
        </div>
    )
}
