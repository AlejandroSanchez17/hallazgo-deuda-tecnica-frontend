import { spacing } from '@hnba/design-tokens'
import { Badge, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { columna, textoSecundario } from '../../styles/disposicion'
import { SEMAFORO, textoDias } from './textos'
import type { ElementoResponse } from './types'

// El color lo decide el backend; en cerrados y anulados no hay semaforo
export const columnaSemaforo: TableColumn<ElementoResponse> = {
    id: 'semaforo',
    header: 'Semáforo',
    align: 'center',
    render: (elemento) =>
        elemento.semaforo ? (
            <div style={{ ...columna(spacing.xs), alignItems: 'center' }}>
                <Badge status={SEMAFORO[elemento.semaforo].estado} label={SEMAFORO[elemento.semaforo].texto} />
                <small style={textoSecundario}>{textoDias(elemento.diasRestantes)}</small>
            </div>
        ) : (
            '—'
        ),
}

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
