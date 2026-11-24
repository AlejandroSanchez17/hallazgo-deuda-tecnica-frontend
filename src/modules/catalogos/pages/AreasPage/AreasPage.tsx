import { spacing } from '@hnba/design-tokens'
import { Alert, Select, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { coincide, normalizar } from '../../../../utils/texto'
import { areasApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { AreaForm } from '../../components/AreaForm/AreaForm'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { BotonNuevo } from '../../components/BotonNuevo/BotonNuevo'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { AreaResponse, Edicion, FiltroEstado } from '../../types'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'

type FiltroJerarquia = 'todas' | 'padres' | 'subareas'

const filtrosJerarquia: Opcion[] = [
    { valor: 'todas', texto: 'Todas las jerarquías' },
    { valor: 'padres', texto: 'Solo áreas padre' },
    { valor: 'subareas', texto: 'Solo subáreas' },
]

// Es padre si alguna de las areas listadas la tiene como area padre
const filtrarPorJerarquia = (areas: AreaResponse[], jerarquia: FiltroJerarquia) => {
    if (jerarquia === 'subareas') {
        return areas.filter((area) => area.areaPadreId !== null)
    }
    if (jerarquia === 'padres') {
        const idsPadre = new Set(areas.map((area) => area.areaPadreId))
        return areas.filter((area) => idsPadre.has(area.id))
    }
    return areas
}

export const AreasPage = () => {
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [jerarquia, setJerarquia] = useState<FiltroJerarquia>('todas')
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<AreaResponse>>(undefined)
    const { registros, cargando, error, recargar } = useListaCatalogo(areasApi.listar, filtro)
    const { cambiarEstado, dialogo } = useCambiarEstado(areasApi.cambiarEstado, TEXTOS.area, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = filtrarPorJerarquia(registros, jerarquia).filter((area) =>
        coincide(termino, area.nombre, area.areaPadreNombre),
    )

    const columnas: TableColumn<AreaResponse>[] = [
        { id: 'nombre', header: 'Nombre', render: (area) => <TextoCorto texto={area.nombre} ancho={240} /> },
        {
            id: 'areaPadreNombre',
            header: 'Área padre',
            render: (area) => <TextoCorto texto={area.areaPadreNombre} ancho={240} />,
        },
        columnaEstado<AreaResponse>(TEXTOS.area),
        ...columnasActivar<AreaResponse>(TEXTOS.area, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = accionesEditar<AreaResponse>(puedeActualizar ? setEdicion : undefined)

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <>
            <Pantalla titulo="Áreas" descripcion="Gerencias y áreas de la organización.">
                <div style={columna(spacing.md)}>
                    <BarraCatalogo
                        textos={TEXTOS.area}
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        placeholderBusqueda="Buscar por nombre o área padre…"
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeCrear ? (
                                <BotonNuevo textos={TEXTOS.area} onClick={() => setEdicion(null)} />
                            ) : undefined
                        }
                        filtrosExtra={
                            <div style={{ width: 208 }}>
                                <Select
                                    options={filtrosJerarquia}
                                    value={opcionDe(filtrosJerarquia, jerarquia)}
                                    getLabel={textoDeOpcion}
                                    getValue={valorDeOpcion}
                                    onChange={(opcion) => setJerarquia(opcion.valor as FiltroJerarquia)}
                                />
                            </div>
                        }
                    />

                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <TablaPaginada
                            columnas={columnas}
                            acciones={acciones}
                            filas={filas}
                            claveFila={(area) => area.id}
                            etiquetaFila={(area) => area.nombre}
                            claveReinicio={`${filtro}|${jerarquia}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === '' && jerarquia === 'todas'
                                    ? 'No hay áreas con este filtro'
                                    : 'Ninguna área coincide con los filtros'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <AreaForm area={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
        </>
    )
}
