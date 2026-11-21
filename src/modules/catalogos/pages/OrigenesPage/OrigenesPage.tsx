import { spacing } from '@hnba/design-tokens'
import { Alert, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
import { coincide, normalizar } from '../../../../utils/texto'
import { origenesApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { BotonNuevo } from '../../components/BotonNuevo/BotonNuevo'
import { OrigenForm } from '../../components/OrigenForm/OrigenForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { Edicion, FiltroEstado, OrigenResponse } from '../../types'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'

export const OrigenesPage = () => {
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<OrigenResponse>>(undefined)
    const { registros, cargando, error, recargar } = useListaCatalogo(origenesApi.listar, filtro)
    const { cambiarEstado, dialogo } = useCambiarEstado(origenesApi.cambiarEstado, TEXTOS.origen, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = registros.filter((origen) => coincide(termino, origen.nombre, origen.descripcion))

    const columnas: TableColumn<OrigenResponse>[] = [
        { id: 'nombre', header: 'Nombre', render: (origen) => <TextoCorto texto={origen.nombre} ancho={220} /> },
        {
            id: 'descripcion',
            header: 'Descripción',
            render: (origen) => <TextoCorto texto={origen.descripcion} ancho={320} />,
        },
        columnaEstado<OrigenResponse>(TEXTOS.origen),
        ...columnasActivar<OrigenResponse>(TEXTOS.origen, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = accionesEditar<OrigenResponse>(puedeActualizar ? setEdicion : undefined)

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <>
            <Pantalla titulo="Orígenes" descripcion="De dónde proviene cada hallazgo o deuda técnica.">
                <div style={columna(spacing.md)}>
                    <BarraCatalogo
                        textos={TEXTOS.origen}
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        placeholderBusqueda="Buscar por nombre o descripción…"
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeCrear ? (
                                <BotonNuevo textos={TEXTOS.origen} onClick={() => setEdicion(null)} />
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
                            claveFila={(origen) => origen.id}
                            etiquetaFila={(origen) => origen.nombre}
                            claveReinicio={`${filtro}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === ''
                                    ? 'No hay orígenes con este filtro'
                                    : 'Ningún origen coincide con la búsqueda'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <OrigenForm origen={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
        </>
    )
}
