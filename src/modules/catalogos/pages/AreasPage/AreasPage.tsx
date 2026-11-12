import { useState } from 'react'
import { MensajeError } from '../../../../components/ui/MensajeError/MensajeError'
import { Selector } from '../../../../components/ui/Selector/Selector'
import type { ColumnaTabla } from '../../../../components/ui/Tabla/Tabla'
import { TablaPaginada } from '../../../../components/ui/TablaPaginada/TablaPaginada'
import { coincide, normalizar } from '../../../../utils/texto'
import { areasApi } from '../../api'
import { columnaAcciones, columnaEstado } from '../../columnas'
import { AreaForm } from '../../components/AreaForm/AreaForm'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { AreaResponse, Edicion, FiltroEstado } from '../../types'

type FiltroJerarquia = 'todas' | 'padres' | 'subareas'

const filtrosJerarquia = [
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
    const { cambiarEstado } = useCambiarEstado(areasApi.cambiarEstado, TEXTOS.area, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = filtrarPorJerarquia(registros, jerarquia).filter((area) =>
        coincide(termino, area.nombre, area.areaPadreNombre),
    )

    const columnas: ColumnaTabla<AreaResponse>[] = [
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'areaPadreNombre', titulo: 'Área padre', render: (area) => area.areaPadreNombre ?? '—' },
        columnaEstado(TEXTOS.area),
    ]
    const acciones = columnaAcciones<AreaResponse>({
        onEditar: puedeActualizar ? setEdicion : undefined,
        onCambiarEstado: puedeDesactivar ? (area) => void cambiarEstado(area) : undefined,
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
                textos={TEXTOS.area}
                busqueda={busqueda}
                onBuscar={setBusqueda}
                placeholderBusqueda="Buscar por nombre o área padre…"
                filtro={filtro}
                onFiltrar={setFiltro}
                onNuevo={puedeCrear ? () => setEdicion(null) : undefined}
                filtrosExtra={
                    <div className="w-52">
                        <Selector
                            etiqueta="Jerarquía"
                            ocultarEtiqueta
                            opciones={filtrosJerarquia}
                            textoVacio={null}
                            value={jerarquia}
                            onChange={(evento) => setJerarquia(evento.target.value as FiltroJerarquia)}
                        />
                    </div>
                }
            />

            {error ? (
                <MensajeError mensaje={error.mensaje} />
            ) : (
                <TablaPaginada
                    columnas={columnas}
                    filas={filas}
                    claveFila={(area) => area.id}
                    claveReinicio={`${filtro}|${jerarquia}|${termino}`}
                    cargando={cargando}
                    textoVacio={
                        termino === '' && jerarquia === 'todas'
                            ? 'No hay áreas con este filtro'
                            : 'Ninguna área coincide con los filtros'
                    }
                />
            )}

            {edicion !== undefined && (
                <AreaForm area={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
        </div>
    )
}
