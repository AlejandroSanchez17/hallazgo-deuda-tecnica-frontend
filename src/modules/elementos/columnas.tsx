import { Badge, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { TextoSinCorte } from '../../components/common/TextoSinCorte/TextoSinCorte'
import { SEMAFORO, textoPlazo } from './textos'
import type { ElementoResponse } from './types'

// El color lo decide el backend; en cerrados y anulados no hay semaforo
export const columnaSemaforo: TableColumn<ElementoResponse> = {
    id: 'Estado',
    header: 'Estado',
    align: 'center',
    render: (elemento) =>
        elemento.semaforo ? (
            <Badge status={SEMAFORO[elemento.semaforo].estado} label={SEMAFORO[elemento.semaforo].texto} />
        ) : (
            '—'
        ),
}

// Los dias para (o desde) el vencimiento, en su propia columna junto al semaforo; sin semaforo no hay plazo.
// No se parte en dos lineas: las celdas saltan de linea por una regla global
export const columnaPlazo: TableColumn<ElementoResponse> = {
    id: 'plazo',
    header: 'Plazo',
    align: 'center',
    render: (elemento) => (
        <TextoSinCorte>{(elemento.semaforo && textoPlazo(elemento.diasRestantes)) || '—'}</TextoSinCorte>
    ),
}

// La accion Ver abre el detalle del elemento; la pueden usar todos los que ven la lista
export const accionVer = (onVer: (elemento: ElementoResponse) => void): TableRowAction<ElementoResponse> => ({
    id: 'ver',
    header: 'Ver',
    iconName: 'eye',
    variant: 'ghost',
    onClick: onVer,
})

// Con onEditar devuelve la accion Editar, deshabilitada en las filas que el usuario no puede editar
export const accionesEditar = (
    onEditar?: (elemento: ElementoResponse) => void,
    puedeEditar?: (elemento: ElementoResponse) => boolean,
): TableRowAction<ElementoResponse>[] =>
    onEditar
        ? [
              {
                  id: 'editar',
                  header: 'Editar',
                  iconName: 'edit',
                  variant: 'ghost',
                  disabled: (elemento) => !(puedeEditar?.(elemento) ?? true),
                  onClick: onEditar,
              },
          ]
        : []
