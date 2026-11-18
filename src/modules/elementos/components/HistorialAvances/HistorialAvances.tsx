import { spacing } from '@hnba/design-tokens'
import { Badge, List, ListItem, Loader, Text } from '@hnba/react-ui'
import { useEffect, useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../../services/api'
import { columna, fila, textoSecundario } from '../../../../styles/disposicion'
import { formatearFechaHora } from '../../../../utils/formato'
import { planesApi } from '../../apiPlan'
import { ESTADO_TAREA, textoPorcentaje } from '../../textosPlan'
import type { AvanceResponse } from '../../typesPlan'

interface HistorialAvancesProps {
    tareaId: number
}

interface Historial {
    tareaId: number
    avances: AvanceResponse[]
}

// Una lista y no una tabla: en el panel de 560 px cinco columnas no caben. El mas reciente primero
export const HistorialAvances = ({ tareaId }: HistorialAvancesProps) => {
    const [historial, setHistorial] = useState<Historial | null>(null)

    useEffect(() => {
        let vigente = true
        planesApi
            .avances(tareaId)
            .then((avances) => vigente && setHistorial({ tareaId, avances }))
            .catch((error: unknown) => {
                if (vigente) {
                    avisarSiNoSeAviso(aErrorApi(error))
                    setHistorial({ tareaId, avances: [] })
                }
            })
        return () => {
            vigente = false
        }
    }, [tareaId])

    const avances = historial?.tareaId === tareaId ? historial.avances : null

    return (
        <div style={columna(spacing.sm)}>
            <Text variant="label-semibold-medium">Historial de avances</Text>
            {avances === null && <Loader />}
            {avances?.length === 0 && (
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    Sin avances registrados
                </Text>
            )}
            {avances && avances.length > 0 && (
                <List dividers>
                    {avances.map((avance) => (
                        <ListItem
                            key={avance.id}
                            title={
                                <div style={fila(spacing.sm)}>
                                    <Badge
                                        status={ESTADO_TAREA[avance.estadoResultante].estado}
                                        label={ESTADO_TAREA[avance.estadoResultante].texto}
                                    />
                                    <span>{textoPorcentaje(avance.porcentaje)}</span>
                                </div>
                            }
                            subtitle={avance.comentario}
                            trailing={
                                <div style={{ ...columna(0), alignItems: 'flex-end' }}>
                                    <small>{formatearFechaHora(avance.fecha)}</small>
                                    <small style={textoSecundario}>{avance.usuarioNombre}</small>
                                </div>
                            }
                        />
                    ))}
                </List>
            )}
        </div>
    )
}
