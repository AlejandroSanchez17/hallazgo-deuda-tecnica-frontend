import { spacing } from '@hnba/design-tokens'
import { Badge, Card, List, ListItem, Text, type IconName } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { columna, fila } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { ESTADO_PLAN, textoNumero } from '../../textosPlan'
import type { PlanResponse } from '../../typesPlan'
import { BarraAvance } from '../BarraAvance/BarraAvance'

interface ResumenPlanProps {
    plan: PlanResponse
}

// Dos listas lado a lado (como ResumenElemento); en una pantalla angosta bajan a una columna
const rejillaResumen = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    columnGap: spacing.lg,
}

const texto = (valor: ReactNode) => <Text variant="body-regular-medium">{valor}</Text>

// Todas las filas con el alto de un Badge, para que las lineas de las dos columnas queden a la misma altura
const altoFila = { ...fila(spacing.sm), minHeight: 32 }

const dato = (icono: IconName, titulo: string, valor: ReactNode) => (
    <ListItem iconName={icono} title={titulo} trailing={<div style={altoFila}>{valor}</div>} />
)

const parrafo = (titulo: string, contenido: string) => (
    <div style={columna(4)}>
        <Text variant="label-semibold-medium">{titulo}</Text>
        <Text variant="body-regular-medium" as="p" style={{ margin: 0, whiteSpace: 'pre-line' }}>
            {contenido}
        </Text>
    </div>
)

// La suma de pesos tiene que llegar a 100 para enviar a aprobacion
export const ResumenPlan = ({ plan }: ResumenPlanProps) => (
    <Card padding={16}>
        <div style={columna(spacing.md)}>
            <div style={rejillaResumen}>
                <List>
                    {dato(
                        'check_circle',
                        'Estado',
                        <Badge status={ESTADO_PLAN[plan.estado].estado} label={ESTADO_PLAN[plan.estado].texto} />,
                    )}
                    {dato('user_shield_solid', 'Líder', texto(plan.liderNombre))}
                    {dato('calendar_alt', 'Inicio', texto(formatearFecha(plan.fechaInicio)))}
                    {dato('calendar_check', 'Fecha compromiso', texto(formatearFecha(plan.fechaCompromiso)))}
                    {dato('file_check', 'Evidencia para finalizar', texto(plan.requiereEvidencia ? 'Sí' : 'No'))}
                </List>
                <List>
                    {dato('square_list', 'Versión', texto(plan.vigente ? `${plan.version} · vigente` : plan.version))}
                    {dato('chart_pie', 'Avance', <BarraAvance valor={plan.avance} ancho={120} enLinea />)}
                    {dato(
                        'percentage',
                        'Suma de pesos',
                        <Badge
                            status={plan.sumaPesos === 100 ? 'success' : 'warning'}
                            label={`${textoNumero(plan.sumaPesos)} de 100`}
                        />,
                    )}
                    {dato('vote_yea', 'Aprueba', texto(plan.rolAprobadorNombre))}
                </List>
            </div>
            {parrafo('Objetivo', plan.objetivo)}
            {parrafo('Estrategia', plan.estrategia)}
        </div>
    </Card>
)
