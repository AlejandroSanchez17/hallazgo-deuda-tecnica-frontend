import { spacing } from '@hnba/design-tokens'
import { Badge, Button, List, ListItem, Loader, Text } from '@hnba/react-ui'
import { useState } from 'react'
import { columna, fila, filaEntreExtremos, textoSecundario } from '../../../../styles/disposicion'
import { formatearFechaHora } from '../../../../utils/formato'
import { referencias } from '../../columnasEvidencias'
import { useDescarga } from '../../hooks/useDescarga'
import { useEvidencias } from '../../hooks/useEvidencias'
import { usePermisosEvidencias, type ElementoDeEvidencias } from '../../hooks/usePermisosEvidencias'
import { ESTADO_EVIDENCIA, tamanoLegible, TIPO_EVIDENCIA } from '../../textosEvidencia'
import type { ObjetivoSubida } from '../../typesEvidencia'
import type { PlanResponse, TareaResponse } from '../../typesPlan'
import { EvidenciaForm } from '../EvidenciaForm/EvidenciaForm'

interface EvidenciasTareaProps {
    elemento: ElementoDeEvidencias
    // El plan que se esta viendo; en una version anterior no se sube nada
    plan: PlanResponse
    tarea: TareaResponse
}

// Seccion "Evidencias" dentro de Ver tarea. Una lista y no una tabla, como el historial de avances (panel de 560 px)
export const EvidenciasTarea = ({ elemento, plan, tarea }: EvidenciasTareaProps) => {
    const { evidencias, cargando, recargar } = useEvidencias(elemento.id, tarea.id)
    const permisos = usePermisosEvidencias(elemento, plan)
    const descarga = useDescarga()
    const [subida, setSubida] = useState<ObjetivoSubida | null>(null)
    const destino = permisos.destinos.find((opcion) => opcion.destino === 'TAREA' && opcion.id === tarea.id)

    const alGuardar = () => {
        setSubida(null)
        recargar()
    }

    return (
        <div style={columna(spacing.sm)}>
            <div style={filaEntreExtremos}>
                <Text variant="label-semibold-medium">Evidencias</Text>
                {destino && (
                    <Button
                        variant="outlined"
                        size="sm"
                        iconName="upload"
                        onClick={() => setSubida({ tipo: 'nueva', destinos: [destino] })}
                    >
                        Subir evidencia
                    </Button>
                )}
            </div>
            {cargando && <Loader />}
            {!cargando && evidencias.length === 0 && (
                <Text variant="body-regular-medium" as="p" style={textoSecundario}>
                    {plan.requiereEvidencia
                        ? 'Sin evidencias. El plan exige una para finalizar la tarea.'
                        : 'Sin evidencias.'}
                </Text>
            )}
            {evidencias.length > 0 && (
                <List dividers>
                    {evidencias.map((evidencia) => (
                        <ListItem
                            key={evidencia.id}
                            style={evidencia.estado === 'REEMPLAZADA' ? { opacity: 0.6 } : undefined}
                            title={
                                <div style={fila(spacing.sm)}>
                                    <span style={{ wordBreak: 'break-word' }}>{evidencia.nombre}</span>
                                    {evidencia.estado === 'REEMPLAZADA' && (
                                        <Badge
                                            status={ESTADO_EVIDENCIA.REEMPLAZADA.estado}
                                            label={ESTADO_EVIDENCIA.REEMPLAZADA.texto}
                                        />
                                    )}
                                </div>
                            }
                            subtitle={`${TIPO_EVIDENCIA[evidencia.tipo]}${evidencia.tipo === 'ARCHIVO' ? ` · ${tamanoLegible(evidencia.tamanoBytes)}` : ''} · ${referencias(evidencia)} · ${evidencia.descripcion}`}
                            trailing={
                                <div style={fila(spacing.sm)}>
                                    <div style={{ ...columna(0), alignItems: 'flex-end' }}>
                                        <small>{formatearFechaHora(evidencia.fecha)}</small>
                                        <small style={textoSecundario}>{evidencia.usuarioNombre}</small>
                                    </div>
                                    {permisos.puedeDescargar && (
                                        <Button
                                            variant="ghost"
                                            iconName="download"
                                            aria-label={`${evidencia.tipo === 'ENLACE' ? 'Abrir' : 'Descargar'} ${evidencia.nombre}`}
                                            onClick={() => descarga.obtener(evidencia)}
                                        />
                                    )}
                                    {permisos.puedeReemplazar(evidencia) && (
                                        <Button
                                            variant="ghost"
                                            iconName="sync_alt"
                                            aria-label={`Reemplazar ${evidencia.nombre}`}
                                            onClick={() => setSubida({ tipo: 'reemplazo', evidencia })}
                                        />
                                    )}
                                </div>
                            }
                        />
                    ))}
                </List>
            )}
            {subida && <EvidenciaForm objetivo={subida} onCerrar={() => setSubida(null)} onGuardado={alGuardar} />}
        </div>
    )
}
