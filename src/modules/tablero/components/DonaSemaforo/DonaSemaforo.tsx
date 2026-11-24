import { colors, spacing } from '@hnba/design-tokens'
import { Button, Text } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { GraficoDona } from '../../../../components/common/GraficoDona/GraficoDona'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { enlaceListado } from '../../filtros'
import { formatearPorcentaje } from '../../textos'
import type { ResumenTablero } from '../../types'
import { Bloque } from '../Bloque/Bloque'

interface DonaSemaforoProps {
    resumen: ResumenTablero
}

// Cuadro de color, nombre, cifra, porcentaje y enlace; anchos fijos para que las cifras queden en la misma columna
const filaLeyenda: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '12px 1fr 32px 48px 28px',
    alignItems: 'center',
    gap: spacing.sm,
}

// Proporcion de los abiertos de hoy por semaforo; cada fila lleva al listado con ese semaforo
export const DonaSemaforo = ({ resumen }: DonaSemaforoProps) => {
    const { ir } = useNavegacion()
    const tramos = [
        { nombre: 'Vencidos', valor: resumen.vencidos, color: colors.semantic.error[700], semaforo: 'VENCIDO' },
        { nombre: 'En riesgo', valor: resumen.enRiesgo, color: colors.semantic.warning[600], semaforo: 'EN_RIESGO' },
        { nombre: 'En tiempo', valor: resumen.enTiempo, color: colors.semantic.success[600], semaforo: 'EN_TIEMPO' },
    ]
    const parte = (valor: number) =>
        formatearPorcentaje(resumen.abiertos === 0 ? null : Math.round((valor / resumen.abiertos) * 1000) / 10)

    return (
        <Bloque titulo="Abiertos por semáforo" nota="Qué parte de lo abierto hoy está vencido, en riesgo o en tiempo.">
            <div style={{ ...columna(spacing.md), alignItems: 'center' }}>
                <GraficoDona
                    titulo="Abiertos por semáforo"
                    segmentos={tramos}
                    centro={{ valor: String(resumen.abiertos), texto: 'abiertos' }}
                />
                <div style={{ ...columna(spacing.sm), width: '100%' }}>
                    {tramos.map((tramo) => (
                        <div key={tramo.nombre} style={filaLeyenda}>
                            <span style={{ width: 12, height: 12, borderRadius: 3, background: tramo.color }} />
                            <Text variant="body-bold-medium" as="span">
                                {tramo.nombre}
                            </Text>
                            <Text variant="body-bold-medium" as="span" style={{ textAlign: 'right' }}>
                                {tramo.valor}
                            </Text>
                            <Text
                                variant="body-regular-small"
                                as="span"
                                style={{ ...textoSecundario, textAlign: 'right' }}
                            >
                                {parte(tramo.valor)}
                            </Text>
                            <Button
                                variant="ghost"
                                size="sm"
                                iconName="eye"
                                aria-label={`Ver ${tramo.nombre.toLowerCase()} en el listado`}
                                onClick={() => ir(enlaceListado(tramo.semaforo))}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Bloque>
    )
}
