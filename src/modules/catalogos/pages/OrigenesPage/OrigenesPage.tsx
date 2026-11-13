import { spacing } from '@hnba/design-tokens'
import { Alert, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
import { coincide, normalizar } from '../../../../utils/texto'
import { origenesApi } from '../../api'
import { columnaAcciones, columnaEstado } from '../../columnas'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { OrigenForm } from '../../components/OrigenForm/OrigenForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { Edicion, FiltroEstado, OrigenResponse } from '../../types'

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
        { id: 'nombre', header: 'Nombre', accessor: (origen) => origen.nombre },
        { id: 'descripcion', header: 'Descripción', render: (origen) => origen.descripcion ?? '—' },
        columnaEstado<OrigenResponse>(TEXTOS.origen, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = columnaAcciones<OrigenResponse>(puedeActualizar ? setEdicion : undefined)
    if (acciones) {
        columnas.push(acciones)
    }

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <div style={columna(spacing.md)}>
            <BarraCatalogo
                textos={TEXTOS.origen}
                busqueda={busqueda}
                onBuscar={setBusqueda}
                placeholderBusqueda="Buscar por nombre o descripción…"
                filtro={filtro}
                onFiltrar={setFiltro}
                onNuevo={puedeCrear ? () => setEdicion(null) : undefined}
            />

            {error ? (
                <Alert variant="error" description={error.mensaje} />
            ) : (
                <TablaPaginada
                    columnas={columnas}
                    filas={filas}
                    claveFila={(origen) => origen.id}
                    claveReinicio={`${filtro}|${termino}`}
                    cargando={cargando}
                    textoVacio={
                        termino === '' ? 'No hay orígenes con este filtro' : 'Ningún origen coincide con la búsqueda'
                    }
                />
            )}

            {edicion !== undefined && (
                <OrigenForm origen={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
        </div>
    )
}
