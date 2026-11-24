import { Badge, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import type { CSSProperties, ReactNode } from 'react'
import { TextoCorto } from '../../components/common/TextoCorto/TextoCorto'
import { TextoSinCorte } from '../../components/common/TextoSinCorte/TextoSinCorte'
import { formatearFechaHora } from '../../utils/formato'
import { ESTADO_EVIDENCIA, textoDestino, TIPO_EVIDENCIA } from './textosEvidencia'
import type { EvidenciaResponse } from './typesEvidencia'

// Las reemplazadas se siguen viendo, atenuadas
const atenuada = (evidencia: EvidenciaResponse): CSSProperties =>
    evidencia.estado === 'REEMPLAZADA' ? { opacity: 0.6 } : {}

const celda = (evidencia: EvidenciaResponse, contenido: ReactNode, alineacion?: 'center') => (
    <div
        style={{
            ...atenuada(evidencia),
            ...(alineacion ? { display: 'flex', justifyContent: alineacion } : {}),
        }}
    >
        {contenido}
    </div>
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

// Cada dato en su columna; los textos largos se cortan con puntos suspensivos y el completo sale al pasar el cursor.
// El tamano del archivo no va en la tabla: esta en el detalle (boton Ver)
export const columnasEvidencias: TableColumn<EvidenciaResponse>[] = [
    {
        id: 'referencia',
        header: 'N.º',
        render: (evidencia) => celda(evidencia, <TextoCorto texto={referencias(evidencia)} ancho={90} />),
    },
    {
        id: 'evidencia',
        header: 'Evidencia',
        render: (evidencia) => celda(evidencia, <TextoCorto texto={evidencia.nombre} ancho={150} />),
    },
    {
        id: 'descripcion',
        header: 'Descripción',
        render: (evidencia) => celda(evidencia, <TextoCorto texto={evidencia.descripcion} ancho={200} />),
    },
    {
        id: 'destino',
        header: 'Destino',
        render: (evidencia) => celda(evidencia, <TextoCorto texto={textoDestino(evidencia)} ancho={200} />),
    },
    {
        id: 'tipo',
        header: 'Tipo',
        render: (evidencia) => celda(evidencia, <TextoSinCorte>{TIPO_EVIDENCIA[evidencia.tipo]}</TextoSinCorte>),
    },
    {
        id: 'subida',
        header: 'Subida por',
        render: (evidencia) => celda(evidencia, <TextoCorto texto={evidencia.usuarioNombre} ancho={160} />),
    },
    {
        id: 'fecha',
        header: 'Fecha',
        align: 'center',
        render: (evidencia) => celda(evidencia, <TextoSinCorte>{formatearFechaHora(evidencia.fecha)}</TextoSinCorte>),
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
