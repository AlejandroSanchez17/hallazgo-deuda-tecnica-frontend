import { colors, spacing } from '@hnba/design-tokens'
import { Button, Text } from '@hnba/react-ui'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraficoDona } from '../../../../components/common/GraficoDona/GraficoDona'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import { enlaceListado } from '../../filtros'
import { contar, formatearPorcentaje } from '../../textos'
import type { EquipoRanking } from '../../types'
import { Bloque } from '../Bloque/Bloque'

interface DonaEquiposProps {
    equipos: EquipoRanking[]
}

// Tonos de rojo (son vencidos) del mas oscuro al mas claro, y un gris para el quinto o para "Otros"
const COLORES = [
    colors.brand.red[900],
    colors.brand.red[700],
    colors.brand.red[500],
    colors.brand.red[400],
    colors.brand.gray[600],
]
const MAXIMO_VISIBLES = COLORES.length - 1

// Cuadro de color, nombre con sus abiertos, cifra, porcentaje y enlace
const filaLeyenda: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '12px minmax(0, 1fr) 32px 48px 36px',
    alignItems: 'center',
    gap: spacing.sm,
}

interface Tramo {
    clave: string
    nombre: string
    vencidos: number
    abiertos: number
    // Solo los equipos reales llevan al listado; "Otros" junta varios
    equipoId?: number
}

// Los equipos con mas vencidos; si sobran, el resto se junta en "Otros" (con uno solo no ahorra nada)
const tramosDe = (equipos: EquipoRanking[]): Tramo[] => {
    const ordenados = [...equipos].sort((a, b) => b.vencidos - a.vencidos)
    const visibles = ordenados.length === COLORES.length ? COLORES.length : MAXIMO_VISIBLES
    const tramos: Tramo[] = ordenados.slice(0, visibles).map((equipo) => ({
        clave: String(equipo.equipoId),
        nombre: equipo.equipo,
        vencidos: equipo.vencidos,
        abiertos: equipo.abiertos,
        equipoId: equipo.equipoId,
    }))
    const resto = ordenados.slice(visibles)
    if (resto.length > 0) {
        tramos.push({
            clave: 'otros',
            nombre: `Otros (${resto.length})`,
            vencidos: resto.reduce((suma, equipo) => suma + equipo.vencidos, 0),
            abiertos: resto.reduce((suma, equipo) => suma + equipo.abiertos, 0),
        })
    }
    return tramos
}

// Como se reparten los vencidos de hoy entre los equipos; cada equipo lleva al listado con sus vencidos
export const DonaEquipos = ({ equipos }: DonaEquiposProps) => {
    const navegar = useNavigate()
    const tramos = tramosDe(equipos)
    const total = tramos.reduce((suma, tramo) => suma + tramo.vencidos, 0)

    return (
        <Bloque
            titulo="Vencidos por equipo"
            nota="Cómo se reparten entre los equipos los elementos vencidos hoy. Hasta 10 equipos con al menos un vencido."
        >
            {tramos.length === 0 ? (
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    Ningún equipo tiene elementos vencidos.
                </Text>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: spacing.lg }}>
                    <GraficoDona
                        titulo="Vencidos por equipo"
                        segmentos={tramos.map((tramo, i) => ({
                            nombre: tramo.nombre,
                            valor: tramo.vencidos,
                            color: COLORES[i],
                        }))}
                        centro={{ valor: String(total), texto: total === 1 ? 'vencido' : 'vencidos' }}
                    />
                    <div style={{ ...columna(spacing.sm), flex: '1 1 280px', minWidth: 0 }}>
                        {tramos.map((tramo, i) => (
                            <div key={tramo.clave} style={filaLeyenda}>
                                <span style={{ width: 12, height: 12, borderRadius: 3, background: COLORES[i] }} />
                                <div style={columna(2)}>
                                    <Text variant="body-bold-medium" as="span">
                                        {tramo.nombre}
                                    </Text>
                                    <Text variant="body-regular-small" as="span" style={textoSecundario}>
                                        de {contar(tramo.abiertos, 'abierto', 'abiertos')}
                                    </Text>
                                </div>
                                <Text variant="body-bold-medium" as="span" style={{ textAlign: 'right' }}>
                                    {tramo.vencidos}
                                </Text>
                                <Text
                                    variant="body-regular-small"
                                    as="span"
                                    style={{ ...textoSecundario, textAlign: 'right' }}
                                >
                                    {formatearPorcentaje(total === 0 ? null : Math.round((tramo.vencidos / total) * 1000) / 10)}
                                </Text>
                                {tramo.equipoId === undefined ? (
                                    <span />
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        iconName="eye"
                                        aria-label={`Ver vencidos de ${tramo.nombre} en el listado`}
                                        onClick={() => void navegar(enlaceListado('VENCIDO', tramo.equipoId))}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Bloque>
    )
}
