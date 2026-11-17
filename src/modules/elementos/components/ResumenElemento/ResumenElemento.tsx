import { spacing } from '@hnba/design-tokens'
import { Badge, Card, List, ListItem, Text, type IconName } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { fila } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { SEMAFORO, TEXTO_ESTADO, TEXTO_TIPO, textoDias } from '../../textos'
import type { ElementoDetalleResponse, EstadoElemento } from '../../types'

interface ResumenElementoProps {
    ficha: ElementoDetalleResponse
}

const ESTADO_BADGE: Partial<Record<EstadoElemento, 'success' | 'neutral' | 'error'>> = {
    CERRADO: 'success',
    ANULADO: 'error',
}

// Dos listas lado a lado; en una pantalla angosta bajan a una columna
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

// Datos que identifican al elemento y dicen como va, sobre las pestanas
export const ResumenElemento = ({ ficha }: ResumenElementoProps) => (
    <Card padding={16}>
        <div style={rejillaResumen}>
            <List dividers>
                {dato('file_lines', 'Tipo', texto(TEXTO_TIPO[ficha.tipo]))}
                {dato(
                    'check_circle',
                    'Estado',
                    <Badge status={ESTADO_BADGE[ficha.estado] ?? 'info'} label={TEXTO_ESTADO[ficha.estado]} />,
                )}
                {dato('exclamation_triangle', 'Criticidad', texto(ficha.criticidadNombre))}
                {dato('building_memo', 'Origen', texto(ficha.origenNombre))}
            </List>
            <List dividers>
                {dato('people_group', 'Equipo', texto(ficha.equipoNombre))}
                {dato('user_shield_solid', 'Líder', texto(ficha.liderNombre ?? '—'))}
                {dato('calendar_check', 'Fecha compromiso', texto(formatearFecha(ficha.fechaCompromisoVigente)))}
                {dato(
                    'clock',
                    'Semáforo',
                    ficha.semaforo ? (
                        <>
                            <Badge status={SEMAFORO[ficha.semaforo].estado} label={SEMAFORO[ficha.semaforo].texto} />
                            {texto(textoDias(ficha.diasRestantes))}
                        </>
                    ) : (
                        texto('—')
                    ),
                )}
            </List>
        </div>
    </Card>
)
