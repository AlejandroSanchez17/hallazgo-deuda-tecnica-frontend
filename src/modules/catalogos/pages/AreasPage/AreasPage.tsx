import { spacing } from '@hnba/design-tokens'
import { Alert, Select, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'
import { columna } from '../../../../styles/disposicion'
import { areaSuperiorDe } from '../../../../utils/areas'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { coincide, normalizar } from '../../../../utils/texto'
import { areasApi, gerenciasApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { AreaForm } from '../../components/AreaForm/AreaForm'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { BotonNuevo } from '../../components/BotonNuevo/BotonNuevo'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { AreaResponse, Edicion, FiltroEstado } from '../../types'

const TODAS_LAS_GERENCIAS = ''

export const AreasPage = () => {
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [gerencia, setGerencia] = useState(TODAS_LAS_GERENCIAS)
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<AreaResponse>>(undefined)
    const { registros, cargando, error, recargar } = useListaCatalogo(areasApi.listar, filtro)
    // El filtro ofrece las gerencias de todos los estados: un area puede seguir en una gerencia que ya se desactivo
    const { registros: gerencias } = useListaCatalogo(gerenciasApi.listar, 'todos')
    const { cambiarEstado, dialogo } = useCambiarEstado(areasApi.cambiarEstado, TEXTOS.area, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const opcionesGerencia: Opcion[] = [
        { valor: TODAS_LAS_GERENCIAS, texto: 'Todas las gerencias' },
        ...gerencias.map((otra) => ({ valor: String(otra.id), texto: otra.nombre })),
    ]

    const termino = normalizar(busqueda)
    const filas = registros
        .filter((area) => gerencia === TODAS_LAS_GERENCIAS || String(area.gerenciaId) === gerencia)
        .filter((area) => coincide(termino, area.nombre, area.gerenciaNombre, areaSuperiorDe(area)))

    const columnas: TableColumn<AreaResponse>[] = [
        { id: 'nombre', header: 'Nombre', render: (area) => <TextoCorto texto={area.nombre} ancho={240} /> },
        {
            id: 'gerencia',
            header: 'Gerencia',
            render: (area) => <TextoCorto texto={area.gerenciaNombre} ancho={240} />,
        },
        {
            id: 'areaSuperior',
            header: 'Área superior',
            render: (area) => <TextoCorto texto={areaSuperiorDe(area)} ancho={240} />,
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
            <Pantalla titulo="Áreas" descripcion="Áreas y subáreas de cada gerencia.">
                <div style={columna(spacing.md)}>
                    <BarraCatalogo
                        textos={TEXTOS.area}
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        placeholderBusqueda="Buscar por nombre, gerencia o área superior…"
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeCrear ? (
                                <BotonNuevo textos={TEXTOS.area} onClick={() => setEdicion(null)} />
                            ) : undefined
                        }
                        filtrosExtra={
                            <div style={{ width: 224 }}>
                                <Select
                                    options={opcionesGerencia}
                                    value={opcionDe(opcionesGerencia, gerencia)}
                                    getLabel={textoDeOpcion}
                                    getValue={valorDeOpcion}
                                    searchable
                                    onChange={(opcion) => setGerencia(opcion.valor)}
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
                            claveReinicio={`${filtro}|${gerencia}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === '' && gerencia === TODAS_LAS_GERENCIAS
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
