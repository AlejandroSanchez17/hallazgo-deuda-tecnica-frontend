import { spacing } from '@hnba/design-tokens'
import { Alert, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'
import { columna } from '../../../../styles/disposicion'
import { coincide, normalizar } from '../../../../utils/texto'
import { criticidadesApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { BarraCatalogo } from '../../components/BarraCatalogo/BarraCatalogo'
import { BotonNuevo } from '../../components/BotonNuevo/BotonNuevo'
import { CriticidadForm } from '../../components/CriticidadForm/CriticidadForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import { TEXTOS } from '../../textos'
import type { CriticidadResponse, Edicion, FiltroEstado } from '../../types'

const NIVELES = [1, 2, 3, 4]

export const CriticidadesPage = () => {
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<CriticidadResponse>>(undefined)
    // Siempre se piden todas: un nivel esta ocupado aunque su criticidad este inactiva
    const { registros, cargando, error, recargar } = useListaCatalogo(criticidadesApi.listar, 'todos')
    const { cambiarEstado, dialogo } = useCambiarEstado(criticidadesApi.cambiarEstado, TEXTOS.criticidad, recargar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosCatalogo()

    const nivelesLibres = NIVELES.filter((nivel) => !registros.some((criticidad) => criticidad.nivel === nivel))
    const puedeAgregar = puedeCrear && !cargando && !error && nivelesLibres.length > 0

    const termino = normalizar(busqueda)
    const filas = registros
        .filter((criticidad) => filtro === 'todos' || criticidad.activo === (filtro === 'activos'))
        .filter((criticidad) => coincide(termino, criticidad.nombre))
        .sort((a, b) => a.nivel - b.nivel)

    const columnas: TableColumn<CriticidadResponse>[] = [
        { id: 'nivel', header: 'Nivel', align: 'center', accessor: (criticidad) => criticidad.nivel },
        {
            id: 'nombre',
            header: 'Nombre',
            render: (criticidad) => <TextoCorto texto={criticidad.nombre} ancho={220} />,
        },
        { id: 'plazoMeses', header: 'Plazo (meses)', align: 'center', accessor: (criticidad) => criticidad.plazoMeses },
        {
            id: 'maxProrrogas',
            header: 'Prórrogas máximas',
            align: 'center',
            accessor: (criticidad) => criticidad.maxProrrogas,
        },
        {
            id: 'rolApruebaPlan',
            header: 'Aprueba el plan',
            render: (criticidad) => criticidad.rolApruebaPlan.nombre,
        },
        {
            id: 'rolValidaCierre',
            header: 'Valida el cierre',
            render: (criticidad) => criticidad.rolValidaCierre.nombre,
        },
        columnaEstado<CriticidadResponse>(TEXTOS.criticidad),
        ...columnasActivar<CriticidadResponse>(TEXTOS.criticidad, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = accionesEditar<CriticidadResponse>(puedeActualizar ? setEdicion : undefined)

    const alGuardar = () => {
        setEdicion(undefined)
        recargar()
    }

    return (
        <>
            <Pantalla titulo="Criticidades" descripcion="Niveles de criticidad y su plazo.">
                <div style={columna(spacing.md)}>
                    <BarraCatalogo
                        textos={TEXTOS.criticidad}
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        placeholderBusqueda="Buscar por nombre…"
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeAgregar ? (
                                <BotonNuevo textos={TEXTOS.criticidad} onClick={() => setEdicion(null)} />
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
                            claveFila={(criticidad) => criticidad.id}
                            etiquetaFila={(criticidad) => criticidad.nombre}
                            claveReinicio={`${filtro}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === ''
                                    ? 'No hay criticidades con este filtro'
                                    : 'Ninguna criticidad coincide con la búsqueda'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <CriticidadForm
                    criticidad={edicion}
                    nivelesLibres={nivelesLibres}
                    onCerrar={() => setEdicion(undefined)}
                    onGuardado={alGuardar}
                />
            )}
            {dialogo}
        </>
    )
}
