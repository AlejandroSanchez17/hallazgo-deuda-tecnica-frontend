import { AreaTexto } from '../../../../components/ui/AreaTexto/AreaTexto'
import { Campo } from '../../../../components/ui/Campo/Campo'
import { Interruptor } from '../../../../components/ui/Interruptor/Interruptor'
import { useFormulario } from '../../../../hooks/useFormulario'
import { categoriasApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { TEXTOS } from '../../textos'
import type { CategoriaFormulario, CategoriaRequest, CategoriaResponse } from '../../types'
import { ModalFormulario } from '../../../../components/ui/ModalFormulario/ModalFormulario'

const aSolicitud = (formulario: CategoriaFormulario): CategoriaRequest => ({
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim() === '' ? null : formulario.descripcion.trim(),
    restringida: formulario.restringida,
})

interface CategoriaFormProps {
    categoria: CategoriaResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const CategoriaForm = ({ categoria, onCerrar, onGuardado }: CategoriaFormProps) => {
    const { formulario, cambiar, asignar } = useFormulario<CategoriaFormulario>({
        nombre: categoria?.nombre ?? '',
        descripcion: categoria?.descripcion ?? '',
        restringida: categoria?.restringida ?? false,
    })
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: categoriasApi.crear,
        actualizar: categoriasApi.actualizar,
        textos: TEXTOS.categoria,
        onGuardado,
    })

    return (
        <ModalFormulario
            titulo={categoria ? 'Editar categoría de deuda' : 'Nueva categoría de deuda'}
            guardando={guardando}
            onCerrar={onCerrar}
            onEnviar={() => void guardar(formulario, categoria?.id)}
        >
            <Campo
                etiqueta="Nombre"
                obligatorio
                maxLength={80}
                value={formulario.nombre}
                onChange={cambiar('nombre')}
                error={errores.nombre}
            />
            <AreaTexto
                etiqueta="Descripción"
                maxLength={300}
                value={formulario.descripcion}
                onChange={cambiar('descripcion')}
                error={errores.descripcion}
                ayuda="Opcional"
            />
            <div className="space-y-1">
                <Interruptor
                    etiqueta="Restringida"
                    activo={formulario.restringida}
                    onCambiar={(restringida) => asignar('restringida', restringida)}
                />
                <p className="text-xs text-texto-secundario">
                    La deuda de una categoría restringida solo la ven los roles con permiso para ello.
                </p>
            </div>
        </ModalFormulario>
    )
}
