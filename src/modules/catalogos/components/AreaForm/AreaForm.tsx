import { FieldInput, FormModal, Select, TextInput } from '@hnba/react-ui'
import { useFormulario } from '../../../../hooks/useFormulario'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { areasApi, gerenciasApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { TEXTOS } from '../../textos'
import type { AreaFormulario, AreaRequest, AreaResponse } from '../../types'

// El area depende de su area superior y, si no tiene, directamente de su gerencia
const aSolicitud = (formulario: AreaFormulario): AreaRequest => {
    const padre = formulario.areaSuperiorId !== '' ? formulario.areaSuperiorId : formulario.gerenciaId
    return { nombre: formulario.nombre.trim(), tipo: 'AREA', areaPadreId: padre === '' ? null : Number(padre) }
}

interface AreaFormProps {
    area: AreaResponse | null
    onCerrar: () => void
    onGuardado: () => void
}

export const AreaForm = ({ area, onCerrar, onGuardado }: AreaFormProps) => {
    // Un area antigua sin gerencia (o colgada de otra area sin gerencia) empieza sin ninguna: hay que elegir un padre valido
    const gerenciaActual = area?.gerenciaId ?? null
    const superiorActual =
        area !== null && gerenciaActual !== null && area.areaPadreId !== null && area.areaPadreId !== gerenciaActual
            ? String(area.areaPadreId)
            : ''
    const { formulario, cambiar, asignar } = useFormulario<AreaFormulario>({
        nombre: area?.nombre ?? '',
        gerenciaId: gerenciaActual === null ? '' : String(gerenciaActual),
        areaSuperiorId: superiorActual,
    })
    const { registros: gerencias } = useListaCatalogo(gerenciasApi.listar, 'activos')
    // De todos los estados: sirve para las areas que se pueden elegir y para saber si esta tiene subareas, activas o no
    const { registros: areas } = useListaCatalogo(areasApi.listar, 'todos')
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        crear: areasApi.crear,
        actualizar: areasApi.actualizar,
        textos: TEXTOS.area,
        onGuardado,
    })

    const opcionesGerencia: Opcion[] = gerencias.map((gerencia) => ({
        valor: String(gerencia.id),
        texto: gerencia.nombre,
    }))
    // Si la gerencia actual esta inactiva no viene en la lista; se muestra para no perderla al editar
    if (gerenciaActual !== null && !opcionesGerencia.some((opcion) => opcion.valor === String(gerenciaActual))) {
        opcionesGerencia.push({
            valor: String(gerenciaActual),
            texto: `${area?.gerenciaNombre ?? ''} (inactiva)`,
        })
    }

    // Solo areas activas de primer nivel de la gerencia elegida (una subarea no puede tener otra), sin ella misma
    const opcionesSuperior: Opcion[] = [
        { valor: '', texto: 'Ninguna' },
        ...areas
            .filter(
                (candidata) =>
                    candidata.activo &&
                    candidata.id !== area?.id &&
                    candidata.gerenciaId !== null &&
                    String(candidata.gerenciaId) === formulario.gerenciaId &&
                    candidata.areaPadreId === candidata.gerenciaId,
            )
            .map((candidata) => ({ valor: String(candidata.id), texto: candidata.nombre })),
    ]
    // Si el area superior actual esta inactiva no viene en la lista; se muestra mientras no se cambie la gerencia
    if (
        superiorActual !== '' &&
        formulario.areaSuperiorId === superiorActual &&
        !opcionesSuperior.some((opcion) => opcion.valor === superiorActual)
    ) {
        opcionesSuperior.push({ valor: superiorActual, texto: `${area?.areaPadreNombre ?? ''} (inactiva)` })
    }

    const tieneSubareas = area !== null && areas.some((otra) => otra.areaPadreId === area.id)
    // El error de areaPadreId es del campo que se uso para elegir el padre
    const errorPadre = errores.areaPadreId
    const superiorElegida = formulario.areaSuperiorId !== ''

    return (
        <FormModal
            open
            position="center"
            size="sm"
            title={area ? 'Editar área' : 'Nueva área'}
            loading={guardando}
            onClose={onCerrar}
            onSubmit={() => void guardar(formulario, area?.id)}
        >
            <FieldInput label="Nombre" errorText={errores.nombre}>
                <TextInput maxLength={120} value={formulario.nombre} onChange={cambiar('nombre')} />
            </FieldInput>
            <FieldInput
                label="Gerencia"
                errorText={superiorElegida ? undefined : errorPadre}
                helperText="Solo se listan las gerencias activas."
            >
                <Select
                    options={opcionesGerencia}
                    value={opcionDe(opcionesGerencia, formulario.gerenciaId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable
                    placeholder="Seleccione…"
                    onChange={(opcion) => {
                        asignar('gerenciaId', opcion.valor)
                        asignar('areaSuperiorId', '')
                    }}
                />
            </FieldInput>
            <FieldInput
                label="Área superior"
                optional
                errorText={superiorElegida ? errorPadre : undefined}
                helperText={
                    tieneSubareas
                        ? 'Esta área tiene subáreas, por eso no puede depender de otra.'
                        : 'Solo para una subárea. Se listan las áreas activas de la gerencia elegida.'
                }
            >
                <Select
                    options={opcionesSuperior}
                    value={opcionDe(opcionesSuperior, formulario.areaSuperiorId)}
                    getLabel={textoDeOpcion}
                    getValue={valorDeOpcion}
                    searchable
                    disabled={tieneSubareas}
                    placeholder="Ninguna"
                    onChange={(opcion) => asignar('areaSuperiorId', opcion.valor)}
                />
            </FieldInput>
        </FormModal>
    )
}
