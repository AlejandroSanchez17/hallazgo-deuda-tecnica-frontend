import { spacing } from '@hnba/design-tokens'
import { Badge, Card, List, ListItem, Text, type IconName } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { fila } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { ESTADO_PLAN, textoNumero } from '../../textosPlan'
import type { PlanResponse } from '../../typesPlan'
import { BarraAvance } from '../BarraAvance/BarraAvance'

interface ResumenPlanProps {
    plan: PlanResponse
}

// Dos columnas de datos, nunca mas (con el minimo de 45 % no caben tres, aunque la pantalla sea ancha); en una pantalla
// angosta, cuando dos de 320 px ya no caben, bajan a una columna
const rejillaResumen = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(max(320px, 45%), 1fr))',
    columnGap: spacing.lg,
}

const texto = (valor: ReactNode) => <Text variant="body-regular-medium">{valor}</Text>

// Todas las filas con el alto de un Badge, para que las lineas de las dos columnas queden a la misma altura
const altoFila = { ...fila(spacing.sm), minHeight: 32 }

const dato = (icono: IconName, titulo: string, valor: ReactNode) => (
    <ListItem iconName={icono} title={titulo} trailing={<div style={altoFila}>{valor}</div>} />
)

// Texto largo (objetivo, estrategia): va como subtitulo de la fila, con salto de linea en vez de cortarse con "…". Se respetan los saltos de linea del texto y va justificado (la libreria no trae opcion: va en el estilo)
const textoLargo = { display: 'block', whiteSpace: 'pre-line', overflowWrap: 'anywhere', textAlign: 'justify' } as const

const datoLargo = (icono: IconName, titulo: string, valor: string) => (
    <ListItem iconName={icono} title={titulo} subtitle={<span style={textoLargo}>{valor}</span>} />
)

// Cada dato en su propia lista de una fila: asi las filas de una y otra columna comparten la misma fila de la rejilla y
// quedan a la par aunque el objetivo o la estrategia ocupen varias lineas
const celda = (item: ReactNode) => <List>{item}</List>

// Pares por fila: a la izquierda, que se busca y quien lo lleva (objetivo, lider, plazos); a la derecha, la estrategia y
// como va el plan (estado, version, avance, suma de pesos y quien aprueba). En pantalla angosta bajan a una columna, en
// ese orden. La suma de pesos tiene que llegar a 100 para enviar a aprobacion
export const ResumenPlan = ({ plan }: ResumenPlanProps) => (
    <Card padding={16}>
        <div style={rejillaResumen}>
            {celda(datoLargo('lightbulb', 'Objetivo', plan.objetivo))}
            {celda(datoLargo('lightbulb_gear', 'Estrategia', plan.estrategia))}
            {celda(dato('user_shield_solid', 'Líder', texto(plan.liderNombre)))}
            {celda(
                dato(
                    'check_circle',
                    'Estado',
                    <Badge status={ESTADO_PLAN[plan.estado].estado} label={ESTADO_PLAN[plan.estado].texto} />,
                ),
            )}
            {celda(dato('calendar_alt', 'Inicio', texto(formatearFecha(plan.fechaInicio))))}
            {celda(dato('square_list', 'Versión', texto(plan.vigente ? `${plan.version} · vigente` : plan.version)))}
            {celda(dato('calendar_check', 'Fecha compromiso', texto(formatearFecha(plan.fechaCompromiso))))}
            {celda(dato('chart_pie', 'Avance', <BarraAvance valor={plan.avance} ancho={120} enLinea />))}
            {celda(dato('file_check', 'Evidencia para finalizar', texto(plan.requiereEvidencia ? 'Sí' : 'No')))}
            {celda(
                dato(
                    'percentage',
                    'Suma de pesos',
                    <Badge
                        status={plan.sumaPesos === 100 ? 'success' : 'warning'}
                        label={`${textoNumero(plan.sumaPesos)} de 100`}
                    />,
                ),
            )}
            <div />
            {celda(dato('vote_yea', 'Aprueba', texto(plan.rolAprobadorNombre)))}
        </div>
    </Card>
)
