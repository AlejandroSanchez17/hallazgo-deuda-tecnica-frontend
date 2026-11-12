import { BotonIcono } from '../../components/ui/BotonIcono/BotonIcono'
import { Etiqueta } from '../../components/ui/Etiqueta/Etiqueta'
import { IconoEditar } from '../../components/ui/Iconos/IconoEditar'
import { IconoInterruptor } from '../../components/ui/Iconos/IconoInterruptor'
import type { ColumnaTabla } from '../../components/ui/Tabla/Tabla'
import { conGenero } from './textos'
import type { RegistroCatalogo, TextosCatalogo } from './types'

export const columnaEstado = <T extends RegistroCatalogo>(textos: TextosCatalogo): ColumnaTabla<T> => ({
    clave: 'activo',
    titulo: 'Estado',
    render: (registro) => (
        <Etiqueta variante={registro.activo ? 'normal' : 'apagada'}>
            {conGenero(textos, registro.activo ? 'Activ' : 'Inactiv')}
        </Etiqueta>
    ),
})

interface AccionesFila<T> {
    onEditar?: (registro: T) => void
    onCambiarEstado?: (registro: T) => void
}

// Devuelve null si el usuario no tiene ninguna accion, para no mostrar la columna vacia
export const columnaAcciones = <T extends RegistroCatalogo>({
    onEditar,
    onCambiarEstado,
}: AccionesFila<T>): ColumnaTabla<T> | null => {
    if (!onEditar && !onCambiarEstado) {
        return null
    }
    return {
        clave: 'acciones',
        titulo: 'Acciones',
        alineacion: 'centro',
        render: (registro) => (
            <div className="inline-flex gap-1">
                {onEditar && (
                    <BotonIcono etiqueta="Editar" onClick={() => onEditar(registro)}>
                        <IconoEditar />
                    </BotonIcono>
                )}
                {onCambiarEstado && (
                    <BotonIcono
                        etiqueta={registro.activo ? 'Desactivar' : 'Activar'}
                        onClick={() => onCambiarEstado(registro)}
                    >
                        <IconoInterruptor encendido={registro.activo} />
                    </BotonIcono>
                )}
            </div>
        ),
    }
}
