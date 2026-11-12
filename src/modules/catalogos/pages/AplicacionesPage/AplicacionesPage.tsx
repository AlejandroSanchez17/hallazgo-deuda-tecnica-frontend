import { useState } from 'react'
import { MensajeError } from '../../../../components/ui/MensajeError/MensajeError'
import type { ColumnaTabla } from '../../../../components/ui/Tabla/Tabla'
import { TablaPaginada } from '../../../../components/ui/TablaPaginada/TablaPaginada'
import { coincide, normalizar } from '../../../../utils/texto'
import { aplicacionesApi } from '../../api'
import { columnaAcciones, columnaEstado } from '../../columnas'
import { AplicacionForm } from '../../components/AplicacionForm/AplicacionForm'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
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
    const { cambiarEstado } = useCambiarEstado(aplicacionesApi.cambiarEstado, TEXTOS.aplicacion, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = registros.filter((aplicacion) =>
        coincide(termino, aplicacion.nombre, aplicacion.areaNombre, aplicacion.descripcion),
    )

    const columnas: ColumnaTabla<AplicacionResponse>[] = [
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'areaNombre', titulo: 'Área' },
        { clave: 'descripcion', titulo: 'Descripción', render: (aplicacion) => aplicacion.descripcion ?? '—' },
        columnaEstado(TEXTOS.aplicacion),
    ]
    const acciones = columnaAcciones<AplicacionResponse>({
        onEditar: puedeActualizar ? setEdicion : undefined,
        onCambiarEstado: puedeDesactivar ? (aplicacion) => void cambiarEstado(aplicacion) : undefined,
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
                textos={TEXTOS.aplicacion}
                busqueda={busqueda}
                onBuscar={setBusqueda}
                placeholderBusqueda="Buscar por nombre, área o descripción…"
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
                    claveFila={(aplicacion) => aplicacion.id}
                    claveReinicio={`${filtro}|${termino}`}
                    cargando={cargando}
                    textoVacio={
                        termino === ''
                            ? 'No hay aplicaciones con este filtro'
                            : 'Ninguna aplicación coincide con la búsqueda'
                    }
                />
            )}

            {edicion !== undefined && (
                <AplicacionForm aplicacion={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
        </div>
    )
}
