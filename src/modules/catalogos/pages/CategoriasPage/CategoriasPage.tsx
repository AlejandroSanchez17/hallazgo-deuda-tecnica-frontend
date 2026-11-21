import { spacing } from '@hnba/design-tokens'
import { Alert, Badge, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
import { coincide, normalizar } from '../../../../utils/texto'
import { categoriasApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { BotonNuevo } from '../../components/BotonNuevo/BotonNuevo'
import { CategoriaForm } from '../../components/CategoriaForm/CategoriaForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { CategoriaResponse, Edicion, FiltroEstado } from '../../types'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'

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
        { id: 'nombre', header: 'Nombre', render: (categoria) => <TextoCorto texto={categoria.nombre} ancho={220} /> },
        {
            id: 'descripcion',
            header: 'Descripción',
            render: (categoria) => <TextoCorto texto={categoria.descripcion} ancho={320} />,
        },
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
        columnaEstado<CategoriaResponse>(TEXTOS.categoria),
        ...columnasActivar<CategoriaResponse>(TEXTOS.categoria, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = accionesEditar<CategoriaResponse>(puedeActualizar ? setEdicion : undefined)

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <>
            <Pantalla
                titulo="Categorías de deuda"
                descripcion="Clasificación de la deuda técnica. Las categorías restringidas solo las ven los roles con permiso."
            >
                <div style={columna(spacing.md)}>
                    <BarraCatalogo
                        textos={TEXTOS.categoria}
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        placeholderBusqueda="Buscar por nombre o descripción…"
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeCrear ? (
                                <BotonNuevo textos={TEXTOS.categoria} onClick={() => setEdicion(null)} />
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
                            claveFila={(categoria) => categoria.id}
                            etiquetaFila={(categoria) => categoria.nombre}
                            claveReinicio={`${filtro}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === ''
                                    ? 'No hay categorías con este filtro'
                                    : 'Ninguna categoría coincide con la búsqueda'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <CategoriaForm categoria={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
        </>
    )
}
