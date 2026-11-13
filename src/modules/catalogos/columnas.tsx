import { Badge, Button, Toggle, type TableColumn } from '@hnba/react-ui'
import { conGenero } from './textos'
import type { RegistroCatalogo, TextosCatalogo } from './types'

// Con onCambiarEstado el estado se muestra y se cambia con un interruptor; sin el, solo se muestra
export const columnaEstado = <T extends RegistroCatalogo>(
    textos: TextosCatalogo,
    onCambiarEstado?: (registro: T) => void,
): TableColumn<T> => ({
    id: 'activo',
    header: 'Estado',
    render: (registro) => {
        const etiqueta = conGenero(textos, registro.activo ? 'Activ' : 'Inactiv')
        if (!onCambiarEstado) {
            return <Badge status={registro.activo ? 'success' : 'neutral'} label={etiqueta} />
        }
        // Controlado: el interruptor solo cambia cuando el registro cambia, despues de confirmar.
        // Sin texto visible; el grupo le da nombre a los lectores de pantalla porque Toggle no acepta aria-label
        return (
            <div role="group" aria-label={`Estado: ${etiqueta}`} title={etiqueta}>
                <Toggle checked={registro.activo} onChange={() => onCambiarEstado(registro)} />
            </div>
        )
    },
})

// Devuelve null si el usuario no puede editar, para no mostrar la columna vacia
export const columnaAcciones = <T extends RegistroCatalogo>(
    onEditar?: (registro: T) => void,
): TableColumn<T> | null => {
    if (!onEditar) {
        return null
    }
    return {
        id: 'acciones',
        header: 'Acciones',
        align: 'center',
        render: (registro) => (
            <Button
                variant="ghost"
                size="sm"
                iconName="edit"
                aria-label="Editar"
                title="Editar"
                onClick={() => onEditar(registro)}
            />
        ),
    }
}
