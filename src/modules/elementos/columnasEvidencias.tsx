import { spacing } from '@hnba/design-tokens'
import { Badge, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import type { CSSProperties, ReactNode } from 'react'
import { columna, textoSecundario } from '../../styles/disposicion'
import { formatearFechaHora } from '../../utils/formato'
import { ESTADO_EVIDENCIA, tamanoLegible, textoDestino, TIPO_EVIDENCIA } from './textosEvidencia'
import type { EvidenciaResponse } from './typesEvidencia'
import { TextoCorto } from '../../components/common/TextoCorto/TextoCorto'

// Las reemplazadas se siguen viendo, atenuadas
const atenuada = (evidencia: EvidenciaResponse): CSSProperties =>
    evidencia.estado === 'REEMPLAZADA' ? { opacity: 0.6 } : {}

const celda = (evidencia: EvidenciaResponse, contenido: ReactNode, alineacion?: 'center') => (
    <div style={{ ...columna(spacing.xs), ...atenuada(evidencia), alignItems: alineacion }}>{contenido}</div>
)

// "#12 · Reemplaza a #9 · Reemplazada por #15"
export const referencias = (evidencia: EvidenciaResponse) =>
    [
        `#${evidencia.id}`,
        evidencia.reemplazaAId !== null ? `Reemplaza a #${evidencia.reemplazaAId}` : null,
        evidencia.reemplazadaPorId !== null ? `Reemplazada por #${evidencia.reemplazadaPorId}` : null,
    ]
        .filter((parte) => parte !== null)
        .join(' · ')

export const columnasEvidencias: TableColumn<EvidenciaResponse>[] = [
    {
        id: 'evidencia',
        header: 'Evidencia',
        render: (evidencia) =>
            celda(
                evidencia,
                <>
                    <TextoCorto texto={evidencia.nombre} ancho={260} />
                    <small style={textoSecundario}>
                        <TextoCorto texto={evidencia.descripcion} ancho={260} />
                    </small>
                    <small style={textoSecundario}>{referencias(evidencia)}</small>
                </>,
            ),
    },
    {
        id: 'destino',
        header: 'Destino',
        render: (evidencia) => celda(evidencia, textoDestino(evidencia)),
    },
    {
        id: 'tipo',
        header: 'Tipo',
        render: (evidencia) =>
            celda(
                evidencia,
                <>
                    <span>{TIPO_EVIDENCIA[evidencia.tipo]}</span>
                    {evidencia.tipo === 'ARCHIVO' && (
                        <small style={textoSecundario}>{tamanoLegible(evidencia.tamanoBytes)}</small>
                    )}
                </>,
            ),
    },
    {
        id: 'subida',
        header: 'Subida por',
        render: (evidencia) =>
            celda(
                evidencia,
                <>
                    <TextoCorto texto={evidencia.usuarioNombre} ancho={160} />
                    <small style={textoSecundario}>{formatearFechaHora(evidencia.fecha)}</small>
                </>,
            ),
    },
    {
        id: 'estado',
        header: 'Estado',
        align: 'center',
        render: (evidencia) =>
            celda(
                evidencia,
                <Badge
                    status={ESTADO_EVIDENCIA[evidencia.estado].estado}
                    label={ESTADO_EVIDENCIA[evidencia.estado].texto}
                />,
                'center',
            ),
    },
]

interface AccionesEvidencias {
    onVer: (evidencia: EvidenciaResponse) => void
    // Sin EVIDENCIA:DESCARGAR no se dibuja. Un enlace se abre en otra pestana
    onObtener?: (evidencia: EvidenciaResponse) => void
    // Sin ninguna que se pueda reemplazar no se dibuja; en las demas queda deshabilitada
    onReemplazar?: (evidencia: EvidenciaResponse) => void
    puedeReemplazar: (evidencia: EvidenciaResponse) => boolean
}

export const accionesEvidencias = ({
    onVer,
    onObtener,
    onReemplazar,
    puedeReemplazar,
}: AccionesEvidencias): TableRowAction<EvidenciaResponse>[] => [
    { id: 'ver', header: 'Ver', iconName: 'eye', variant: 'ghost', onClick: onVer },
    ...(onObtener
        ? [
              {
                  id: 'descargar',
                  header: 'Descargar',
                  iconName: 'download' as const,
                  variant: 'ghost' as const,
                  onClick: onObtener,
              },
          ]
        : []),
    ...(onReemplazar
        ? [
              {
                  id: 'reemplazar',
                  header: 'Reemplazar',
                  iconName: 'sync_alt' as const,
                  variant: 'ghost' as const,
                  disabled: (evidencia: EvidenciaResponse) => !puedeReemplazar(evidencia),
                  onClick: onReemplazar,
              },
          ]
        : []),
]
