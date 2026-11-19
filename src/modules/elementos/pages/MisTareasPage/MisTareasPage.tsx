import { spacing } from '@hnba/design-tokens'
import { Alert, type TableRowAction } from '@hnba/react-ui'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
import { rutaPlanElemento } from '../../../../utils/constants/rutas'
import { normalizar } from '../../../../utils/texto'
import { planesApi } from '../../apiPlan'
import { COLUMNAS_MIS_TAREAS } from '../../columnasMisTareas'
import { AvanceForm } from '../../components/AvanceForm/AvanceForm'
import { BarraMisTareas } from '../../components/BarraMisTareas/BarraMisTareas'
import { filtrarMisTareas, hayFiltrosTareas, SIN_FILTROS_TAREAS } from '../../filtrosMisTareas'
import { useLista } from '../../hooks/useLista'
import type { FiltrosMisTareas, MiTarea } from '../../typesPlan'

// Tareas abiertas del usuario en planes aprobados (RF-TAR-06), por fecha de fin. Todas son suyas: puede registrar
// el avance de cualquiera; las dependencias sin finalizar las marca el backend
export const MisTareasPage = () => {
    const navegar = useNavigate()
    const [busqueda, setBusqueda] = useState('')
    const [filtros, setFiltros] = useState<FiltrosMisTareas>(SIN_FILTROS_TAREAS)
    const [enAvance, setEnAvance] = useState<MiTarea | null>(null)
    const { registros, cargando, error, recargar } = useLista(planesApi.mias)

    const termino = normalizar(busqueda)
    const filas = filtrarMisTareas(registros, termino, filtros)
    const acciones: TableRowAction<MiTarea>[] = [
        { id: 'avance', header: 'Avance', iconName: 'chart_mixed_up_circle', variant: 'ghost', onClick: setEnAvance },
        {
            id: 'plan',
            header: 'Ver plan',
            iconName: 'square_list',
            variant: 'ghost',
            onClick: (tarea) => void navegar(rutaPlanElemento(tarea.elementoId)),
        },
    ]

    const alRegistrar = () => {
        setEnAvance(null)
        recargar()
    }

    return (
        <>
            <Pantalla
                titulo="Mis tareas"
                descripcion="Tareas a su cargo en planes aprobados, de la que vence primero a la última. Registre aquí su avance."
            >
                <div style={columna(spacing.md)}>
                    <BarraMisTareas
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        filtros={filtros}
                        onFiltrar={setFiltros}
                    />
                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <TablaPaginada
                            columnas={COLUMNAS_MIS_TAREAS}
                            acciones={acciones}
                            filas={filas}
                            claveFila={(tarea) => tarea.id}
                            etiquetaFila={(tarea) => `${tarea.titulo} (${tarea.elementoCodigo})`}
                            claveReinicio={`${termino}|${filtros.estado}|${filtros.plazo}`}
                            cargando={cargando}
                            textoVacio={
                                termino === '' && !hayFiltrosTareas(filtros)
                                    ? 'No tiene tareas abiertas en planes aprobados'
                                    : 'Ninguna tarea coincide con la búsqueda o los filtros'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {enAvance && (
                <AvanceForm
                    elementoId={enAvance.elementoId}
                    tarea={enAvance}
                    onCerrar={() => setEnAvance(null)}
                    onRegistrado={alRegistrar}
                />
            )}
        </>
    )
}
