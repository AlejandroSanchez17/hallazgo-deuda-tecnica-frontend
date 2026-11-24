import { spacing } from '@hnba/design-tokens'
import { Badge, Card, List, ListItem, Text, Tooltip, type IconName } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { fila } from '../../../../styles/disposicion'
import { formatearFecha } from '../../../../utils/formato'
import { SEMAFORO, TEXTO_ESTADO, TEXTO_TIPO, textoDias } from '../../textos'
import { textoCantidad } from '../../textosProrroga'
import type { ElementoDetalleResponse, EstadoElemento, ParticipanteResponse } from '../../types'

interface ResumenElementoProps {
    ficha: ElementoDetalleResponse
    // Maximo de prorrogas de la criticidad; solo llega con PRORROGA:LEER
    maximoProrrogas?: number
}

const ESTADO_BADGE: Partial<Record<EstadoElemento, 'success' | 'neutral' | 'error'>> = {
    CERRADO: 'success',
    ANULADO: 'error',
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

// Para un valor que puede ser largo (los participantes): el espacio final de la fila no se parte en lineas y empujaba
// el rotulo fuera de la pantalla; va como subtitulo, que salta de linea en vez de cortarse con "…"
const textoPartido = { whiteSpace: 'normal', overflowWrap: 'anywhere' } as const

const datoLargo = (icono: IconName, titulo: string, valor: ReactNode) => (
    <ListItem iconName={icono} title={titulo} subtitle={valor} />
)

// Hasta 3 participantes salen completos; con mas, los dos primeros y cuantos faltan (la lista completa va en el tooltip)
const MAXIMO_NOMBRES = 3
// El tooltip no hace salto de linea ni se desplaza: se lista un nombre por linea y, si son demasiados, se corta aqui
const MAXIMO_NOMBRES_TOOLTIP = 10

const listaNombres = (nombres: string[]) => {
    const visibles = nombres.slice(0, MAXIMO_NOMBRES_TOOLTIP)
    const restantes = nombres.length - visibles.length
    return (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {visibles.map((nombre) => (
                <span key={nombre}>{nombre}</span>
            ))}
            {restantes > 0 && <span>y {restantes} más</span>}
        </span>
    )
}

const participantes = (lista: ParticipanteResponse[]) => {
    if (lista.length === 0) {
        return <span style={textoPartido}>—</span>
    }
    const nombres = lista.map((participante) => participante.nombre)
    if (lista.length <= MAXIMO_NOMBRES) {
        return <span style={textoPartido}>{nombres.join(', ')}</span>
    }
    return (
        <Tooltip content={listaNombres(nombres)} position="top">
            <span tabIndex={0} style={textoPartido}>
                {`${nombres.slice(0, 2).join(', ')} y ${lista.length - 2} más`}
            </span>
        </Tooltip>
    )
}

// Las dos columnas se arman por pares: cada dato de la izquierda queda en la misma fila de la rejilla que el de la
// derecha (cada uno en su propia lista de una fila), asi las filas quedan a la par aunque los participantes ocupen
// varias lineas. Si una columna tiene menos datos, la celda queda vacia
const enParejas = (izquierda: ReactNode[], derecha: ReactNode[]) =>
    Array.from({ length: Math.max(izquierda.length, derecha.length) }, (_, posicion) =>
        [izquierda[posicion], derecha[posicion]].map((item, lado) =>
            item ? <List key={`${posicion}-${lado}`}>{item}</List> : <div key={`${posicion}-${lado}`} />,
        ),
    ).flat()

// Datos que identifican al elemento y dicen como va, sobre las pestanas. A la izquierda, que es y quien lo lleva (tipo,
// criticidad, origen, equipo y lider); a la derecha, como va (estado, semaforo, fecha compromiso, prorrogas) y los
// participantes, que son lo unico que puede ser largo y por eso van en la ultima fila
export const ResumenElemento = ({ ficha, maximoProrrogas }: ResumenElementoProps) => {
    const izquierda = [
        dato('file_lines', 'Tipo', texto(TEXTO_TIPO[ficha.tipo])),
        dato('exclamation_triangle', 'Criticidad', texto(ficha.criticidadNombre)),
        dato('building_memo', 'Origen', texto(ficha.origenNombre)),
        dato('people_group', 'Equipo', texto(ficha.equipoNombre)),
        dato('user_shield_solid', 'Líder', texto(ficha.liderNombre ?? '—')),
    ]
    const derecha = [
        dato(
            'check_circle',
            'Estado',
            <Badge status={ESTADO_BADGE[ficha.estado] ?? 'info'} label={TEXTO_ESTADO[ficha.estado]} />,
        ),
        dato(
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
        ),
        dato('calendar_check', 'Fecha compromiso', texto(formatearFecha(ficha.fechaCompromisoVigente))),
        dato('calendar_clock', 'Prórrogas', texto(textoCantidad(ficha.prorrogasAprobadas, maximoProrrogas))),
        datoLargo('users', 'Participantes', participantes(ficha.participantes)),
    ]

    return (
        <Card padding={16}>
            <div style={rejillaResumen}>{enParejas(izquierda, derecha)}</div>
        </Card>
    )
}
