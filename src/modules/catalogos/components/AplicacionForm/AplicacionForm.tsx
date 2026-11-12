import { AreaTexto } from '../../../../components/ui/AreaTexto/AreaTexto'
import { Campo } from '../../../../components/ui/Campo/Campo'
import { Selector } from '../../../../components/ui/Selector/Selector'
import { useFormulario } from '../../../../hooks/useFormulario'
import { aplicacionesApi, areasApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { TEXTOS } from '../../textos'
import type { AplicacionFormulario, AplicacionRequest, AplicacionResponse } from '../../types'
import { ModalFormulario } from '../../../../components/ui/ModalFormulario/ModalFormulario'

const aSolicitud = (formulario: AplicacionFormulario): AplicacionRequest => ({
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim() === '' ? null : formulario.descripcion.trim(),
    areaId: formulario.areaId === '' ? null : Number(formulario.areaId),
})

interface AplicacionFormProps {
    aplicacion: AplicacionResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const AplicacionForm = ({ aplicacion, onCerrar, onGuardado }: AplicacionFormProps) => {
    const { formulario, cambiar } = useFormulario<AplicacionFormulario>({
        nombre: aplicacion?.nombre ?? '',
        descripcion: aplicacion?.descripcion ?? '',
        areaId: aplicacion?.areaId.toString() ?? '',
    })
    const { registros: areasActivas } = useListaCatalogo(areasApi.listar, 'activos')
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: aplicacionesApi.crear,
        actualizar: aplicacionesApi.actualizar,
        textos: TEXTOS.aplicacion,
        onGuardado,
    })

    const opcionesArea = areasActivas.map((area) => ({ valor: area.id, texto: area.nombre }))
    // Si el area actual esta inactiva no viene en la lista; se muestra para no perderla al editar
    if (aplicacion && !opcionesArea.some((opcion) => opcion.valor === aplicacion.areaId)) {
        opcionesArea.push({ valor: aplicacion.areaId, texto: `${aplicacion.areaNombre} (inactiva)` })
    }

    return (
        <ModalFormulario
            titulo={aplicacion ? 'Editar aplicación' : 'Nueva aplicación'}
            guardando={guardando}
            onCerrar={onCerrar}
            onEnviar={() => void guardar(formulario, aplicacion?.id)}
        >
            <Campo
                etiqueta="Nombre"
                obligatorio
                maxLength={120}
                value={formulario.nombre}
                onChange={cambiar('nombre')}
                error={errores.nombre}
            />
            <Selector
                etiqueta="Área"
                obligatorio
                opciones={opcionesArea}
                value={formulario.areaId}
                onChange={cambiar('areaId')}
                error={errores.areaId}
                ayuda="Área responsable de la aplicación. Solo se listan las áreas activas."
            />
            <AreaTexto
                etiqueta="Descripción"
                maxLength={300}
                value={formulario.descripcion}
                onChange={cambiar('descripcion')}
                error={errores.descripcion}
                ayuda="Opcional"
            />
        </ModalFormulario>
    )
}
