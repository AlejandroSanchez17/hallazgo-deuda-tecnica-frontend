import { spacing } from '@hnba/design-tokens'
import { Alert, Badge, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
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
    const { cambiarEstado, dialogo } = useCambiarEstado(categoriasApi.cambiarEstado, TEXTOS.categoria, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const termino = normalizar(busqueda)
    const filas = registros.filter((categoria) => coincide(termino, categoria.nombre, categoria.descripcion))

    const columnas: TableColumn<CategoriaResponse>[] = [
        { id: 'nombre', header: 'Nombre', accessor: (categoria) => categoria.nombre },
        { id: 'descripcion', header: 'Descripción', render: (categoria) => categoria.descripcion ?? '—' },
        {
            id: 'restringida',
            header: 'Acceso',
            render: (categoria) => (
                <Badge
                    status={categoria.restringida ? 'warning' : 'neutral'}
                    label={categoria.restringida ? 'Restringida' : 'Libre'}
                />
            ),
        },
        columnaEstado<CategoriaResponse>(TEXTOS.categoria, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = columnaAcciones<CategoriaResponse>(puedeActualizar ? setEdicion : undefined)
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
                textos={TEXTOS.categoria}
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
            {dialogo}
        </div>
    )
}
