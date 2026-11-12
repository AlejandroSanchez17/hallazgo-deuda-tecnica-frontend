import { useState } from 'react'
import { Etiqueta } from '../../../../components/ui/Etiqueta/Etiqueta'
import { MensajeError } from '../../../../components/ui/MensajeError/MensajeError'
import type { ColumnaTabla } from '../../../../components/ui/Tabla/Tabla'
import { TablaPaginada } from '../../../../components/ui/TablaPaginada/TablaPaginada'
import { coincide, normalizar } from '../../../../utils/texto'
import { categoriasApi } from '../../api'
import { columnaAcciones, columnaEstado } from '../../columnas'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { CategoriaForm } from '../../components/CategoriaForm/CategoriaForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { CategoriaResponse, Edicion, FiltroEstado } from '../../types'

export const CategoriasPage = () => {
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<CategoriaResponse>>(undefined)
    const { registros, cargando, error, recargar } = useListaCatalogo(categoriasApi.listar, filtro)
    const { cambiarEstado } = useCambiarEstado(categoriasApi.cambiarEstado, TEXTOS.categoria, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = registros.filter((categoria) => coincide(termino, categoria.nombre, categoria.descripcion))

    const columnas: ColumnaTabla<CategoriaResponse>[] = [
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'descripcion', titulo: 'Descripción', render: (categoria) => categoria.descripcion ?? '—' },
        {
            clave: 'restringida',
            titulo: 'Acceso',
            render: (categoria) =>
                categoria.restringida ? (
                    <Etiqueta>Restringida</Etiqueta>
                ) : (
                    <Etiqueta variante="apagada">Libre</Etiqueta>
                ),
        },
        columnaEstado(TEXTOS.categoria),
    ]
    const acciones = columnaAcciones<CategoriaResponse>({
        onEditar: puedeActualizar ? setEdicion : undefined,
        onCambiarEstado: puedeDesactivar ? (categoria) => void cambiarEstado(categoria) : undefined,
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
                textos={TEXTOS.categoria}
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
                    claveFila={(categoria) => categoria.id}
                    claveReinicio={`${filtro}|${termino}`}
                    cargando={cargando}
                    textoVacio={
                        termino === ''
                            ? 'No hay categorías con este filtro'
                            : 'Ninguna categoría coincide con la búsqueda'
                    }
                />
            )}

            {edicion !== undefined && (
                <CategoriaForm categoria={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
        </div>
    )
}
