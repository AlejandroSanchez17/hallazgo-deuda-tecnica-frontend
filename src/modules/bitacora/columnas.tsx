import { Badge, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { TextoCorto } from '../../components/common/TextoCorto/TextoCorto'
import { TextoSinCorte } from '../../components/common/TextoSinCorte/TextoSinCorte'
import { formatearFechaHora } from '../../utils/formato'
import { ESTADO_ACCION, TEXTO_ACCION, textoEntidad } from './textos'
import type { RegistroBitacora } from './types'

export const columnasBitacora: TableColumn<RegistroBitacora>[] = [
    {
        id: 'fecha',
        header: 'Fecha',
        render: (registro) => <TextoSinCorte>{formatearFechaHora(registro.fecha)}</TextoSinCorte>,
    },
    {
        id: 'usuario',
        header: 'Usuario',
        render: (registro) => <TextoCorto texto={registro.usuarioNombre} ancho={200} />,
    },
    { id: 'entidad', header: 'Entidad', render: (registro) => textoEntidad(registro.entidad, registro) },
    // Los parametros se guardan con id 0: su clave va dentro del valor (se ve en el detalle)
    {
        id: 'registro',
        header: 'Registro',
        align: 'center',
        render: (registro) => (registro.entidadId === 0 ? '—' : registro.entidadId),
    },
    {
        id: 'accion',
        header: 'Acción',
        align: 'center',
        render: (registro) => <Badge status={ESTADO_ACCION[registro.accion]} label={TEXTO_ACCION[registro.accion]} />,
    },
    { id: 'ip', header: 'IP', render: (registro) => <TextoCorto texto={registro.ip} ancho={140} /> },
]

export const accionesBitacora = (onVer: (registro: RegistroBitacora) => void): TableRowAction<RegistroBitacora>[] => [
    { id: 'detalle', header: 'Detalle', iconName: 'eye', variant: 'ghost', onClick: onVer },
]
