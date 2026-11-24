import { spacing } from '@hnba/design-tokens'
import { Alert, type TableRowAction } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { useSaludo } from '../../../../hooks/useSaludo'
import { columna } from '../../../../styles/disposicion'
import { rutaTareaPlan } from '../../../../utils/constants/rutas'
import { normalizar } from '../../../../utils/texto'
import { planesApi } from '../../apiPlan'
import { COLUMNAS_MIS_TAREAS } from '../../columnasMisTareas'
import { BarraMisTareas } from '../../components/BarraMisTareas/BarraMisTareas'
import { filtrarMisTareas, hayFiltrosTareas, SIN_FILTROS_TAREAS } from '../../filtrosMisTareas'
import { useLista } from '../../hooks/useLista'
import type { FiltrosMisTareas, MiTarea } from '../../typesPlan'

// Tareas abiertas del usuario en planes aprobados (RF-TAR-06), por fecha de fin. Solo se listan: el detalle de la
// tarea (boton Ver) es donde se ve todo y se registra el avance
export const MisTareasPage = () => {
    const { ir } = useNavegacion()
    const saludo = useSaludo()
    const [busqueda, setBusqueda] = useState('')
    const [filtros, setFiltros] = useState<FiltrosMisTareas>(SIN_FILTROS_TAREAS)
    const { registros, cargando, error } = useLista(planesApi.mias)

    const termino = normalizar(busqueda)
    const filas = filtrarMisTareas(registros, termino, filtros)
    const acciones: TableRowAction<MiTarea>[] = [
        // Lleva directo al detalle de la tarea, con el plan de la tarea (planId) para encontrarla
        {
            id: 'ver',
            header: 'Ver',
            iconName: 'eye',
            variant: 'ghost',
            onClick: (tarea) => ir(rutaTareaPlan(tarea.elementoId, tarea.id, tarea.planId)),
        },
    ]

    return (
        <Pantalla titulo={saludo} descripcion="Tareas que tiene asignadas.">
            <div style={columna(spacing.md)}>
                <BarraMisTareas busqueda={busqueda} onBuscar={setBusqueda} filtros={filtros} onFiltrar={setFiltros} />
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
    )
}
