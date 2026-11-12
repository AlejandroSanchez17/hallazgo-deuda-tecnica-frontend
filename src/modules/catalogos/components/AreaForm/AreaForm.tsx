import { Campo } from '../../../../components/ui/Campo/Campo'
import { Selector } from '../../../../components/ui/Selector/Selector'
import { useFormulario } from '../../../../hooks/useFormulario'
import { areasApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { TEXTOS } from '../../textos'
import type { AreaFormulario, AreaRequest, AreaResponse, TipoArea } from '../../types'
import { ModalFormulario } from '../../../../components/ui/ModalFormulario/ModalFormulario'

const tiposArea = [
    { valor: 'GERENCIA', texto: 'Gerencia' },
    { valor: 'AREA', texto: 'Área' },
]

const aSolicitud = (formulario: AreaFormulario): AreaRequest => ({
    nombre: formulario.nombre.trim(),
    tipo: formulario.tipo === '' ? null : (formulario.tipo as TipoArea),
    areaPadreId: formulario.areaPadreId === '' ? null : Number(formulario.areaPadreId),
})

interface AreaFormProps {
    area: AreaResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const AreaForm = ({ area, onCerrar, onGuardado }: AreaFormProps) => {
    const { formulario, cambiar } = useFormulario<AreaFormulario>({
        nombre: area?.nombre ?? '',
        tipo: area?.tipo ?? '',
        areaPadreId: area?.areaPadreId?.toString() ?? '',
    })
    const { registros: areasActivas } = useListaCatalogo(areasApi.listar, 'activos')
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: areasApi.crear,
        actualizar: areasApi.actualizar,
        textos: TEXTOS.area,
        onGuardado,
    })

    const opcionesPadre = areasActivas
        .filter((areaActiva) => areaActiva.id !== area?.id)
        .map((areaActiva) => ({ valor: areaActiva.id, texto: areaActiva.nombre }))
    // Si el padre actual esta inactivo no viene en la lista; se muestra para no perderlo al editar
    if (area?.areaPadreId && !opcionesPadre.some((opcion) => opcion.valor === area.areaPadreId)) {
        opcionesPadre.push({ valor: area.areaPadreId, texto: `${area.areaPadreNombre ?? ''} (inactiva)` })
    }

    return (
        <ModalFormulario
            titulo={area ? 'Editar área' : 'Nueva área'}
            guardando={guardando}
            onCerrar={onCerrar}
            onEnviar={() => void guardar(formulario, area?.id)}
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
                etiqueta="Tipo"
                obligatorio
                opciones={tiposArea}
                value={formulario.tipo}
                onChange={cambiar('tipo')}
                error={errores.tipo}
            />
            <Selector
                etiqueta="Área padre"
                opciones={opcionesPadre}
                textoVacio="Sin área padre"
                value={formulario.areaPadreId}
                onChange={cambiar('areaPadreId')}
                error={errores.areaPadreId}
                ayuda="Opcional. Solo se listan las áreas activas."
            />
        </ModalFormulario>
    )
}
