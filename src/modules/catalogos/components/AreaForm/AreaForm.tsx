import { FieldInput, FormModal, Select, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { areasApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { TEXTOS } from '../../textos'
import type { AreaFormulario, AreaRequest, AreaResponse, TipoArea } from '../../types'

const tiposArea: Opcion[] = [
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
    const { formulario, cambiar, asignar } = useFormulario<AreaFormulario>({
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

    const opcionesPadre: Opcion[] = [
        { valor: '', texto: 'Sin área padre' },
        ...areasActivas
            .filter((areaActiva) => areaActiva.id !== area?.id)
            .map((areaActiva) => ({ valor: String(areaActiva.id), texto: areaActiva.nombre })),
    ]
    // Si el padre actual esta inactivo no viene en la lista; se muestra para no perderlo al editar
    if (area?.areaPadreId && !opcionesPadre.some((opcion) => opcion.valor === String(area.areaPadreId))) {
        opcionesPadre.push({ valor: String(area.areaPadreId), texto: `${area.areaPadreNombre ?? ''} (inactiva)` })
    }

    return (
        <FormModal
            open
            position="right"
            size="sm"
            title={area ? 'Editar área' : 'Nueva área'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, area?.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={120} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
            <FieldInput label="Tipo" errorText={errores.tipo}>
                <Select
                    options={tiposArea}
                    value={opcionDe(tiposArea, formulario.tipo)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    placeholder="Seleccione…"
                    onChange={(opcion) => asignar('tipo', opcion.valor)}
                />
            </FieldInput>
            <FieldInput
                label="Área padre"
                optional
                errorText={errores.areaPadreId}
                helperText="Opcional. Solo se listan las áreas activas."
            >
                <Select
                    options={opcionesPadre}
                    value={opcionDe(opcionesPadre, formulario.areaPadreId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable
                    placeholder="Sin área padre"
                    onChange={(opcion) => asignar('areaPadreId', opcion.valor)}
                />
            </FieldInput>
        </FormModal>
    )
}
