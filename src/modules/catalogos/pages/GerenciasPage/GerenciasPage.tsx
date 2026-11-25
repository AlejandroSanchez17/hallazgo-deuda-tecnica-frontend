import { spacing } from '@hnba/design-tokens'
import { Alert, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'
import { columna } from '../../../../styles/disposicion'
import { coincide, normalizar } from '../../../../utils/texto'
import { areasApi, gerenciasApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { BotonNuevo } from '../../components/BotonNuevo/BotonNuevo'
import { GerenciaForm } from '../../components/GerenciaForm/GerenciaForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { AreaResponse, Edicion, FiltroEstado } from '../../types'

export const GerenciasPage = () => {
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<AreaResponse>>(undefined)
    const { registros, cargando, error, recargar } = useListaCatalogo(gerenciasApi.listar, filtro)
    // Para contar las areas de cada gerencia (las subareas llevan la gerencia de su area superior)
    const { registros: areasActivas } = useListaCatalogo(areasApi.listar, 'activos')
    const { cambiarEstado, dialogo } = useCambiarEstado(gerenciasApi.cambiarEstado, TEXTOS.gerencia, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = registros.filter((gerencia) => coincide(termino, gerencia.nombre))

    const columnas: TableColumn<AreaResponse>[] = [
        { id: 'nombre', header: 'Nombre', render: (gerencia) => <TextoCorto texto={gerencia.nombre} ancho={320} /> },
        {
            id: 'areas',
            header: 'Áreas',
            align: 'center',
            render: (gerencia) => areasActivas.filter((area) => area.gerenciaId === gerencia.id).length,
        },
        columnaEstado<AreaResponse>(TEXTOS.gerencia),
        ...columnasActivar<AreaResponse>(TEXTOS.gerencia, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = accionesEditar<AreaResponse>(puedeActualizar ? setEdicion : undefined)

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <>
            <Pantalla titulo="Gerencias" descripcion="Gerencias de la organización y sus áreas activas.">
                <div style={columna(spacing.md)}>
                    <BarraCatalogo
                        textos={TEXTOS.gerencia}
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        placeholderBusqueda="Buscar por nombre…"
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeCrear ? (
                                <BotonNuevo textos={TEXTOS.gerencia} onClick={() => setEdicion(null)} />
                            ) : undefined
                        }
                    />

                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <TablaPaginada
                            columnas={columnas}
                            acciones={acciones}
                            filas={filas}
                            claveFila={(gerencia) => gerencia.id}
                            etiquetaFila={(gerencia) => gerencia.nombre}
                            claveReinicio={`${filtro}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === ''
                                    ? 'No hay gerencias con este filtro'
                                    : 'Ninguna gerencia coincide con la búsqueda'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <GerenciaForm gerencia={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
        </>
    )
}
