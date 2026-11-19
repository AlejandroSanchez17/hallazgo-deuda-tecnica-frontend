import { spacing } from '@hnba/design-tokens'
import { Alert, Badge, Button, List, ListItem, Modal, Text, type IconName } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { columna, fila } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { formatearFecha, formatearFechaHora } from '../../../../utils/formato'
import type { ElementoDeEvidencias } from '../../hooks/usePermisosEvidencias'
import { ESTADO_TAREA, textoNumero } from '../../textosPlan'
import type { PlanResponse, ProblemaPlan, TareaResponse } from '../../typesPlan'
import { BarraAvance } from '../BarraAvance/BarraAvance'
import { EvidenciasTarea } from '../EvidenciasTarea/EvidenciasTarea'
import { HistorialAvances } from '../HistorialAvances/HistorialAvances'

interface DetalleTareaProps {
    elemento: ElementoDeEvidencias
    plan: PlanResponse
    tarea: TareaResponse
    // Los problemas del plan que senalan a esta tarea
    problemas: ProblemaPlan[]
    onCerrar: () => void
}

const texto = (valor: ReactNode) => <Text variant="body-regular-medium">{valor}</Text>

const dato = (icono: IconName, titulo: string, valor: ReactNode) => (
    <ListItem iconName={icono} title={titulo} trailing={<div style={fila(spacing.sm)}>{valor}</div>} />
)

const parrafo = (titulo: string, contenido: string) => (
    <div style={columna(4)}>
        <Text variant="label-semibold-medium">{titulo}</Text>
        <Text variant="body-regular-medium" as="p" style={{ margin: 0, whiteSpace: 'pre-line' }}>
            {contenido}
        </Text>
    </div>
)

// Solo lectura, para todos los que ven el plan; sobre todo para quien lo aprueba (Gerencia de TI o Registrador)
export const DetalleTarea = ({ elemento, plan, tarea, problemas, onCerrar }: DetalleTareaProps) => {
    const veEvidencias = usePermiso(PERMISOS.evidenciaLeer)
    return (
        <Modal
            open
            position="right"
            title={tarea.titulo}
            onClose={onCerrar}
            footer={
                <Button variant="primary" onClick={onCerrar}>
                    Cerrar
                </Button>
            }
        >
            <div style={columna(spacing.md)}>
                {problemas.length > 0 && (
                    <Alert variant="warning" title="Revise:">
                        <ul style={{ margin: 0, paddingLeft: spacing.lg }}>
                            {problemas.map((problema) => (
                                <li key={`${problema.campo}-${problema.mensaje}`}>{problema.mensaje}</li>
                            ))}
                        </ul>
                    </Alert>
                )}
                <List dividers>
                    {dato(
                        'check_circle',
                        'Estado',
                        <>
                            <Badge
                                status={ESTADO_TAREA[tarea.estado].estado}
                                label={ESTADO_TAREA[tarea.estado].texto}
                            />
                            {tarea.vencida && <Badge status="error" label="Vencida" />}
                        </>,
                    )}
                    {dato('user_alt', 'Responsable', texto(tarea.responsableNombre))}
                    {dato('calendar_alt', 'Inicio', texto(formatearFecha(tarea.fechaInicio)))}
                    {dato('calendar_check', 'Fin', texto(formatearFecha(tarea.fechaFin)))}
                    {dato('percentage', 'Peso', texto(`${textoNumero(tarea.peso)} de 100`))}
                    {dato('chart_pie', 'Avance', <BarraAvance valor={tarea.avance} ancho={120} enLinea />)}
                    {dato(
                        'clock',
                        'Último avance',
                        texto(tarea.ultimoAvanceFecha ? formatearFechaHora(tarea.ultimoAvanceFecha) : 'Sin avances'),
                    )}
                    {dato('square_list', 'Depende de', texto(tarea.dependeDeTitulo ?? 'Sin dependencia'))}
                    {tarea.tareaOrigenId !== null && dato('copy', 'Origen', texto('Copiada de la versión anterior'))}
                </List>
                {parrafo('Descripción', tarea.descripcion ?? 'Sin descripción')}
                {tarea.motivoEstado &&
                    parrafo(
                        tarea.estado === 'CANCELADA'
                            ? 'Justificación de la cancelación'
                            : tarea.estado === 'BLOQUEADA'
                              ? 'Motivo del bloqueo'
                              : 'Motivo del estado',
                        tarea.motivoEstado,
                    )}
                {veEvidencias && <EvidenciasTarea elemento={elemento} plan={plan} tarea={tarea} />}
                <HistorialAvances tareaId={tarea.id} />
            </div>
        </Modal>
    )
}
