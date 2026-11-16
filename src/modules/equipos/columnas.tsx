import { Badge, Toggle, type TableColumn, type TableRowAction } from '@hnba/react-ui'
import { conGenero } from './textos'
import type { RegistroActivable, TextosRegistro } from './types'

// Columna "Estado": muestra si el registro esta activo o inactivo
export const columnaEstado = <T extends RegistroActivable>(textos: TextosRegistro): TableColumn<T> => ({
    id: 'activo',
    header: 'Estado',
    align: 'center',
    render: (registro) => (
        <Badge
            status={registro.activo ? 'success' : 'neutral'}
            label={conGenero(textos, registro.activo ? 'Activ' : 'Inactiv')}
        />
    ),
})

// Columna "Activar/Desactivar" con el interruptor; sin onCambiarEstado (el usuario no puede cambiarlo) no hay columna
export const columnasActivar = <T extends RegistroActivable>(
    textos: TextosRegistro,
    onCambiarEstado?: (registro: T) => void,
): TableColumn<T>[] =>
    onCambiarEstado
        ? [
              {
                  id: 'activar',
                  header: 'Activar/Desactivar',
                  align: 'center',
                  // Controlado: el interruptor solo cambia cuando el registro cambia, despues de confirmar.
                  // Sin texto visible; el grupo le da nombre a los lectores de pantalla porque Toggle no acepta aria-label
                  render: (registro) => {
                      const etiqueta = conGenero(textos, registro.activo ? 'Activ' : 'Inactiv')
                      return (
                          <div role="group" aria-label={`Activar o desactivar: ${etiqueta}`} title={etiqueta}>
                              <Toggle checked={registro.activo} onChange={() => onCambiarEstado(registro)} />
                          </div>
                      )
                  },
              },
          ]
        : []

// Nombre del lider o, si el equipo no tiene (al reactivarlo), una etiqueta de advertencia
export const nombreLider = (nombre: string | null) => nombre ?? <Badge status="warning" label="Sin líder" />

// La accion Ver abre el detalle del equipo con sus miembros; la pueden usar todos los que ven la lista
export const accionVer = <T,>(onVer: (registro: T) => void): TableRowAction<T> => ({
    id: 'ver',
    header: 'Ver',
    iconName: 'eye',
    variant: 'ghost',
    onClick: onVer,
})

// Con onEditar devuelve la accion Editar (rowActions de la libreria); sin el, ninguna y no se dibuja la columna
export const accionesEditar = <T,>(onEditar?: (registro: T) => void): TableRowAction<T>[] =>
    onEditar ? [{ id: 'editar', header: 'Editar', iconName: 'edit', variant: 'ghost', onClick: onEditar }] : []
