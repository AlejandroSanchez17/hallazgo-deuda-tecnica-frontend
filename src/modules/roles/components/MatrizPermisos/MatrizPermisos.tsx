import { Badge, Table, Text, Toggle, Tooltip, type TableColumn } from '@hnba/react-ui'
import { columna, textoSecundario } from '../../../../styles/disposicion'
import {
    accionesDe,
    alcanceDeFila,
    asignadosDe,
    nombreAccion,
    nombreRecurso,
    type GrupoRecurso,
    type MapaPermisos,
} from '../../permisosRol'

const SIN_VALOR = '—'

interface MatrizPermisosProps {
    grupos: GrupoRecurso[]
    marcados: MapaPermisos
    conPropio: Set<string>
    soloLectura: boolean
    onAlternar: (grupo: GrupoRecurso, permisoId: number) => void
    onCambiarSoloPropio: (grupo: GrupoRecurso, soloPropio: boolean) => void
}

// Una fila por recurso y una columna por accion: cada interruptor da o quita un permiso.
// El alcance se decide por fila con "Propio": el permiso vale solo para lo del usuario (su equipo o sus tareas)
export const MatrizPermisos = ({
    grupos,
    marcados,
    conPropio,
    soloLectura,
    onAlternar,
    onCambiarSoloPropio,
}: MatrizPermisosProps) => {
    const columnaRecurso: TableColumn<GrupoRecurso> = {
        id: 'recurso',
        header: 'Recurso',
        render: (grupo) => (
            <div style={columna(0)}>
                <span>{nombreRecurso(grupo.recurso)}</span>
                <Text variant="body-regular-small" as="span" style={textoSecundario}>
                    {`${asignadosDe(grupo, marcados).length} de ${grupo.permisos.length}`}
                </Text>
            </div>
        ),
    }

    const columnasAccion = accionesDe(grupos).map((accion): TableColumn<GrupoRecurso> => ({
        id: accion,
        header: nombreAccion(accion),
        align: 'center',
        render: (grupo) => {
            const permiso = grupo.permisos.find((candidato) => candidato.accion === accion)
            if (!permiso) {
                return null
            }
            const asignado = marcados[permiso.id] !== undefined
            if (soloLectura) {
                return asignado ? <Badge status="success" label="Sí" /> : SIN_VALOR
            }
            // Toggle no acepta aria-label: el grupo le da nombre a los lectores de pantalla
            return (
                <Tooltip content={permiso.descripcion ?? permiso.codigo}>
                    <div role="group" aria-label={permiso.codigo}>
                        <Toggle checked={asignado} onChange={() => onAlternar(grupo, permiso.id)} />
                    </div>
                </Tooltip>
            )
        },
    }))

    const columnaSoloPropio: TableColumn<GrupoRecurso> = {
        id: 'soloPropio',
        header: 'Propio',
        align: 'center',
        render: (grupo) => {
            const alcance = alcanceDeFila(grupo, marcados)
            if (alcance === undefined || !conPropio.has(grupo.recurso)) {
                return SIN_VALOR
            }
            if (soloLectura) {
                return (
                    <Badge
                        status={alcance === 'PROPIO' ? 'info' : 'neutral'}
                        label={alcance === 'PROPIO' ? 'Sí' : 'No'}
                    />
                )
            }
            return (
                <div role="group" aria-label={`${nombreRecurso(grupo.recurso)}: solo propio`}>
                    <Toggle
                        checked={alcance === 'PROPIO'}
                        onChange={(soloPropio) => onCambiarSoloPropio(grupo, soloPropio)}
                    />
                </div>
            )
        },
    }

    return (
        <Table
            columns={[columnaRecurso, ...columnasAccion, columnaSoloPropio]}
            rows={grupos}
            getRowKey={(grupo) => grupo.recurso}
        />
    )
}
