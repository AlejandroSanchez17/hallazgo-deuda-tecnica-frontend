import { spacing } from '@hnba/design-tokens'
import { Badge, Card, List, ListItem, Text, type IconName } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { fila } from '../../../../styles/disposicion'
import { nombreLider } from '../../columnas'
import type { EquipoDetalleResponse } from '../../types'

interface ResumenEquipoProps {
    equipo: EquipoDetalleResponse
}

// Dos columnas de datos, nunca mas (con el minimo de 45 % no caben tres, aunque la pantalla sea ancha); en una pantalla
// angosta, cuando dos de 320 px ya no caben, bajan a una columna
const rejillaResumen = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(max(320px, 45%), 1fr))',
    columnGap: spacing.lg,
}

// Todas las filas con el alto de un Badge, para que las lineas de las dos columnas queden a la misma altura
const altoFila = { ...fila(spacing.sm), minHeight: 32 }

const dato = (icono: IconName, titulo: string, valor: ReactNode) => (
    <ListItem iconName={icono} title={titulo} trailing={<div style={altoFila}>{valor}</div>} />
)

// Texto largo (la descripcion): va como subtitulo de la fila, con salto de linea en vez de cortarse con "…". Se respetan
// los saltos de linea del texto y va justificado (la libreria no trae opcion: va en el estilo)
const textoLargo = { display: 'block', whiteSpace: 'pre-line', overflowWrap: 'anywhere', textAlign: 'justify' } as const

const datoLargo = (icono: IconName, titulo: string, valor: string) => (
    <ListItem iconName={icono} title={titulo} subtitle={<span style={textoLargo}>{valor}</span>} />
)

const texto = (valor: ReactNode) => <Text variant="body-regular-medium">{valor}</Text>

// Las dos columnas se arman por pares: cada dato de la izquierda queda en la misma fila de la rejilla que el de la
// derecha (cada uno en su propia lista de una fila), asi las filas quedan a la par aunque la descripcion ocupe varias
// lineas. Si una columna tiene menos datos, la celda queda vacia
const enParejas = (izquierda: ReactNode[], derecha: ReactNode[]) =>
    Array.from({ length: Math.max(izquierda.length, derecha.length) }, (_, posicion) =>
        [izquierda[posicion], derecha[posicion]].map((item, lado) =>
            item ? <List key={`${posicion}-${lado}`}>{item}</List> : <div key={`${posicion}-${lado}`} />,
        ),
    ).flat()

// Datos generales del equipo, sobre las pestanas de miembros. La descripcion, si la tiene, va arriba a todo el ancho (una
// sola descripcion larga junto a datos cortos dejaba un hueco al lado); debajo, a la izquierda, que es y quien lo lleva
// (area, lider y estado) y, a la derecha, los numeros del equipo (miembros y tareas)
export const ResumenEquipo = ({ equipo }: ResumenEquipoProps) => {
    const izquierda = [
        dato('building', 'Área', texto(equipo.areaNombre)),
        dato('user_shield_solid', 'Líder', texto(nombreLider(equipo.liderNombre))),
        dato(
            'check_circle',
            'Estado',
            <Badge status={equipo.activo ? 'success' : 'neutral'} label={equipo.activo ? 'Activo' : 'Inactivo'} />,
        ),
    ]
    const derecha = [
        dato('people_group', 'Miembros vigentes', <Text variant="body-bold-medium">{equipo.miembros.length}</Text>),
        dato('square_list', 'Tareas pendientes', <Text variant="body-bold-medium">{equipo.tareasPendientes ?? 0}</Text>),
        dato(
            'clock',
            'Tareas vencidas',
            <Badge
                status={(equipo.tareasVencidas ?? 0) > 0 ? 'error' : 'success'}
                label={String(equipo.tareasVencidas ?? 0)}
            />,
        ),
    ]

    return (
        <Card padding={16}>
            <div style={rejillaResumen}>
                {equipo.descripcion && (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <List>{datoLargo('file_lines', 'Descripción', equipo.descripcion)}</List>
                    </div>
                )}
                {enParejas(izquierda, derecha)}
            </div>
        </Card>
    )
}
