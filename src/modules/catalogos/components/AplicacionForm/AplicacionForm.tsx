import { FieldInput, FormModal, LargeTextArea, Select, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { textoArea } from '../../../../utils/areas'
import { aplicacionesApi, areasYGerenciasApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { TEXTOS } from '../../textos'
import type { AplicacionFormulario, AplicacionRequest, AplicacionResponse } from '../../types'

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
    const { formulario, cambiar, asignar } = useFormulario<AplicacionFormulario>({
        nombre: aplicacion?.nombre ?? '',
        descripcion: aplicacion?.descripcion ?? '',
        areaId: aplicacion?.areaId.toString() ?? '',
    })
    // Con las gerencias activas incluidas: una aplicacion antigua puede estar en una gerencia, y eso no es "inactiva"
    const { registros: activas, cargando } = useListaCatalogo(areasYGerenciasApi.listar, 'activos')
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: aplicacionesApi.crear,
        actualizar: aplicacionesApi.actualizar,
        textos: TEXTOS.aplicacion,
        onGuardado,
    })

    // Areas y subareas; una gerencia no se ofrece
    const opcionesArea: Opcion[] = activas
        .filter((area) => area.tipo === 'AREA')
        .map((area) => ({ valor: String(area.id), texto: textoArea(area) }))
    // El valor actual que no viene en la lista se muestra para no perderlo al editar: inactivo, o una gerencia activa
    if (aplicacion && !opcionesArea.some((opcion) => opcion.valor === String(aplicacion.areaId))) {
        const actual = activas.find((area) => area.id === aplicacion.areaId)
        const texto = actual
            ? textoArea(actual)
            : cargando
              ? aplicacion.areaNombre
              : `${aplicacion.areaNombre} (inactiva)`
        opcionesArea.push({ valor: String(aplicacion.areaId), texto })
    }

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title={aplicacion ? 'Editar aplicación' : 'Nueva aplicación'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, aplicacion?.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={120} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
            <FieldInput
                label="Área"
                errorText={errores.areaId}
                helperText="Área o subárea responsable de la aplicación. Solo se listan las activas."
            >
                <Select
                    options={opcionesArea}
                    value={opcionDe(opcionesArea, formulario.areaId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable
                    placeholder="Seleccione…"
                    onChange={(opcion) => asignar('areaId', opcion.valor)}
                />
            </FieldInput>
            <FieldInput label="Descripción" optional errorText={errores.descripcion}>
                <LargeTextArea maxLength={300} value={formulario.descripcion} onChange={cambiar('descripcion')} />
            </FieldInput>
        </FormModal>
    )
}
