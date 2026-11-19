import { spacing } from '@hnba/design-tokens'
import { Badge, Button, List, ListItem, Modal, Text, type IconName } from '@hnba/react-ui'
import type { ReactNode } from 'react'
import { columna, fila } from '../../../../styles/disposicion'
import { formatearFechaHora } from '../../../../utils/formato'
import { ESTADO_EVIDENCIA, tamanoLegible, textoDestino, TIPO_EVIDENCIA } from '../../textosEvidencia'
import type { EvidenciaResponse } from '../../typesEvidencia'

interface DetalleEvidenciaProps {
    evidencia: EvidenciaResponse
    // Sin EVIDENCIA:DESCARGAR no hay boton
    onObtener?: () => void
    descargando: boolean
    onCerrar: () => void
}

const texto = (valor: ReactNode) => <Text variant="body-regular-medium">{valor}</Text>

const dato = (icono: IconName, titulo: string, valor: ReactNode) => (
    <ListItem iconName={icono} title={titulo} trailing={<div style={fila(spacing.sm)}>{valor}</div>} />
)

const formatoBytes = new Intl.NumberFormat('es')

const parrafo = (titulo: string, contenido: string, estilo = {}) => (
    <div style={columna(4)}>
        <Text variant="label-semibold-medium">{titulo}</Text>
        <Text variant="body-regular-medium" as="p" style={{ margin: 0, whiteSpace: 'pre-line', ...estilo }}>
            {contenido}
        </Text>
    </div>
)

// Panel de solo lectura con todo lo de la evidencia, tambien la huella SHA-256 completa
export const DetalleEvidencia = ({ evidencia, onObtener, descargando, onCerrar }: DetalleEvidenciaProps) => (
    <Modal
        open
        position="right"
        title={`Evidencia #${evidencia.id}`}
        onClose={onCerrar}
        footer={
            <div style={fila(spacing.sm)}>
                {onObtener && (
                    <Button variant="outlined" iconName="download" loading={descargando} onClick={onObtener}>
                        {evidencia.tipo === 'ENLACE' ? 'Abrir enlace' : 'Descargar'}
                    </Button>
                )}
                <Button variant="primary" onClick={onCerrar}>
                    Cerrar
                </Button>
            </div>
        }
    >
        <div style={columna(spacing.md)}>
            {parrafo('Nombre', evidencia.nombre, { wordBreak: 'break-word' })}
            <List dividers>
                {dato(
                    'check_circle',
                    'Estado',
                    <Badge
                        status={ESTADO_EVIDENCIA[evidencia.estado].estado}
                        label={ESTADO_EVIDENCIA[evidencia.estado].texto}
                    />,
                )}
                {dato('square_list', 'Destino', texto(textoDestino(evidencia)))}
                {dato('file_lines', 'Tipo', texto(TIPO_EVIDENCIA[evidencia.tipo]))}
                {evidencia.tipoContenido && dato('file_check', 'Tipo de contenido', texto(evidencia.tipoContenido))}
                {evidencia.tamanoBytes !== null &&
                    dato(
                        'folder_plus',
                        'Tamaño',
                        texto(
                            `${tamanoLegible(evidencia.tamanoBytes)} (${formatoBytes.format(evidencia.tamanoBytes)} bytes)`,
                        ),
                    )}
                {dato('user_alt', 'Subida por', texto(evidencia.usuarioNombre))}
                {dato('clock', 'Fecha', texto(formatearFechaHora(evidencia.fecha)))}
                {evidencia.reemplazaAId !== null &&
                    dato('sync_alt', 'Reemplaza a', texto(`#${evidencia.reemplazaAId}`))}
                {evidencia.reemplazadaPorId !== null &&
                    dato('sync_alt', 'Reemplazada por', texto(`#${evidencia.reemplazadaPorId}`))}
            </List>
            {evidencia.url && parrafo('URL', evidencia.url, { wordBreak: 'break-all' })}
            {parrafo('Descripción', evidencia.descripcion)}
            {evidencia.hashSha256 &&
                parrafo('Huella SHA-256', evidencia.hashSha256, {
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    userSelect: 'all',
                })}
        </div>
    </Modal>
)
