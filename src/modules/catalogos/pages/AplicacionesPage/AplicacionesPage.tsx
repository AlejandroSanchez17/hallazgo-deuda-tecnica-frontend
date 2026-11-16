import { spacing } from '@hnba/design-tokens'
import { Alert, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
import { coincide, normalizar } from '../../../../utils/texto'
import { aplicacionesApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { AplicacionForm } from '../../components/AplicacionForm/AplicacionForm'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { BotonNuevo } from '../../components/BotonNuevo/BotonNuevo'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { AplicacionResponse, Edicion, FiltroEstado } from '../../types'

export const AplicacionesPage = () => {
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<AplicacionResponse>>(undefined)
    const { registros, cargando, error, recargar } = useListaCatalogo(aplicacionesApi.listar, filtro)
    const { cambiarEstado, dialogo } = useCambiarEstado(aplicacionesApi.cambiarEstado, TEXTOS.aplicacion, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = registros.filter((aplicacion) =>
        coincide(termino, aplicacion.nombre, aplicacion.areaNombre, aplicacion.descripcion),
    )

    const columnas: TableColumn<AplicacionResponse>[] = [
        { id: 'nombre', header: 'Nombre', accessor: (aplicacion) => aplicacion.nombre },
        { id: 'areaNombre', header: 'Área', accessor: (aplicacion) => aplicacion.areaNombre },
        { id: 'descripcion', header: 'Descripción', render: (aplicacion) => aplicacion.descripcion ?? '—' },
        columnaEstado<AplicacionResponse>(TEXTOS.aplicacion),
        ...columnasActivar<AplicacionResponse>(TEXTOS.aplicacion, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = accionesEditar<AplicacionResponse>(puedeActualizar ? setEdicion : undefined)

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <>
            <Pantalla
                titulo="Aplicaciones"
                descripcion="Aplicaciones de la organización y el área a la que pertenece cada una."
            >
                <div style={columna(spacing.md)}>
                    <BarraCatalogo
                        textos={TEXTOS.aplicacion}
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        placeholderBusqueda="Buscar por nombre, área o descripción…"
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeCrear ? (
                                <BotonNuevo textos={TEXTOS.aplicacion} onClick={() => setEdicion(null)} />
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
                            claveFila={(aplicacion) => aplicacion.id}
                            etiquetaFila={(aplicacion) => aplicacion.nombre}
                            claveReinicio={`${filtro}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === ''
                                    ? 'No hay aplicaciones con este filtro'
                                    : 'Ninguna aplicación coincide con la búsqueda'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <AplicacionForm aplicacion={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
        </>
    )
}
