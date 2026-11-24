import { spacing } from '@hnba/design-tokens'
import { Badge, Card, Text, type BadgeStatus } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { columna, filaEntreExtremos, textoSecundario } from '../../../../styles/disposicion'
import { enlaceListado } from '../../filtros'
import type { ResumenTablero as Resumen } from '../../types'

interface ResumenTableroProps {
    resumen: Resumen
}

interface Cifra {
    titulo: string
    valor: number
    detalle: string
    // Con semaforo, la tarjeta lleva al listado filtrado
    semaforo?: { valor: string; estado: BadgeStatus }
}

const rejilla: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: spacing.md,
}

export const ResumenTablero = ({ resumen }: ResumenTableroProps) => {
    const { ir } = useNavegacion()

    const cifras: Cifra[] = [
        { titulo: 'Abiertos', valor: resumen.abiertos, detalle: 'Sin cerrar ni anular, hoy' },
        {
            titulo: 'Vencidos',
            valor: resumen.vencidos,
            detalle: 'Pasaron su fecha compromiso',
            semaforo: { valor: 'VENCIDO', estado: 'error' },
        },
        {
            titulo: 'En riesgo',
            valor: resumen.enRiesgo,
            detalle: 'Cerca de su fecha compromiso',
            semaforo: { valor: 'EN_RIESGO', estado: 'warning' },
        },
        {
            titulo: 'En tiempo',
            valor: resumen.enTiempo,
            detalle: 'Con margen hasta su fecha',
            semaforo: { valor: 'EN_TIEMPO', estado: 'success' },
        },
        { titulo: 'Cerrados', valor: resumen.cerradosPeriodo, detalle: 'Cerrados en el período' },
    ]

    return (
        <div style={rejilla}>
            {cifras.map(({ titulo, valor, detalle, semaforo }) => {
                const enlace = semaforo ? enlaceListado(semaforo.valor) : null
                return (
                    <Card
                        key={titulo}
                        padding={spacing.md}
                        onClick={enlace ? () => ir(enlace) : undefined}
                        aria-label={enlace ? `${titulo}: ${valor}. Ver en el listado` : undefined}
                        style={{ textAlign: 'left', width: '100%' }}
                    >
                        <div style={columna(spacing.xs)}>
                            <div style={{ ...filaEntreExtremos, alignItems: 'center', flexWrap: 'nowrap' }}>
                                {semaforo ? (
                                    <Badge status={semaforo.estado} label={titulo} />
                                ) : (
                                    <Text variant="body-bold-medium" as="span">
                                        {titulo}
                                    </Text>
                                )}
                                {enlace && (
                                    <Text variant="link-medium" as="span">
                                        Ver
                                    </Text>
                                )}
                            </div>
                            <Text variant="h2" as="p" style={{ margin: 0 }}>
                                {valor}
                            </Text>
                            <Text variant="body-regular-small" as="p" style={textoSecundario}>
                                {detalle}
                            </Text>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
