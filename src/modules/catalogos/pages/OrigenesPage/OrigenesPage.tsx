import { useState } from 'react'
import { MensajeError } from '../../../../components/ui/MensajeError/MensajeError'
import type { ColumnaTabla } from '../../../../components/ui/Tabla/Tabla'
import { TablaPaginada } from '../../../../components/ui/TablaPaginada/TablaPaginada'
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
    const { cambiarEstado } = useCambiarEstado(origenesApi.cambiarEstado, TEXTOS.origen, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = registros.filter((origen) => coincide(termino, origen.nombre, origen.descripcion))

    const columnas: ColumnaTabla<OrigenResponse>[] = [
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'descripcion', titulo: 'Descripción', render: (origen) => origen.descripcion ?? '—' },
        columnaEstado(TEXTOS.origen),
    ]
    const acciones = columnaAcciones<OrigenResponse>({
        onEditar: puedeActualizar ? setEdicion : undefined,
        onCambiarEstado: puedeDesactivar ? (origen) => void cambiarEstado(origen) : undefined,
    })
    if (acciones) {
        columnas.push(acciones)
    }

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <div className="space-y-4">
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
                <MensajeError mensaje={error.mensaje} />
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
        </div>
    )
}
