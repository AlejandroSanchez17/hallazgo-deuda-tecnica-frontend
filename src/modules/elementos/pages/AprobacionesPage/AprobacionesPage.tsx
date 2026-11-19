import { spacing } from '@hnba/design-tokens'
import { Alert, type TableRowAction } from '@hnba/react-ui'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { columna } from '../../../../styles/disposicion'
import { rutaElemento, rutaPlanElemento } from '../../../../utils/constants/rutas'
import { normalizar } from '../../../../utils/texto'
import { aprobacionesApi } from '../../apiProrrogas'
import { COLUMNAS_APROBACIONES } from '../../columnasAprobaciones'
import { BarraAprobaciones } from '../../components/BarraAprobaciones/BarraAprobaciones'
import {
    filtrarAprobaciones,
    hayFiltrosAprobaciones,
    opcionesDeAprobaciones,
    SIN_FILTROS_APROBACIONES,
} from '../../filtrosAprobaciones'
import { useLista } from '../../hooks/useLista'
import { useResolucion, type Resoluble } from '../../hooks/useResolucion'
import { TIPO_PENDIENTE } from '../../textosProrroga'
import type { FiltrosAprobaciones, PendienteResponse } from '../../typesProrroga'

// Prorrogas por su id; cierres por el elemento. Un plan no se resuelve aqui: se revisa con sus tareas en su pagina
const aResoluble = (fila: PendienteResponse): Resoluble =>
    fila.tipo === 'PRORROGA'
        ? {
              tipo: 'PRORROGA',
              prorrogaId: fila.id,
              codigo: fila.elementoCodigo,
              fechaPropuesta: fila.fechaPropuesta ?? '',
          }
        : { tipo: 'CIERRE', elementoId: fila.elementoId, codigo: fila.elementoCodigo }

// Bandeja de lo que el usuario puede aprobar o validar, de lo mas antiguo a lo mas nuevo (el backend ya filtra por su
// rol y sus permisos)
export const AprobacionesPage = () => {
    const navegar = useNavigate()
    const [busqueda, setBusqueda] = useState('')
    const [filtros, setFiltros] = useState<FiltrosAprobaciones>(SIN_FILTROS_APROBACIONES)
    const { registros, cargando, error, recargar } = useLista(aprobacionesApi.pendientes)
    const resolucion = useResolucion(recargar)

    const termino = normalizar(busqueda)
    const filas = filtrarAprobaciones(registros, termino, filtros)
    const opciones = opcionesDeAprobaciones(registros)
    const esPlan = (fila: PendienteResponse) => fila.tipo === 'PLAN'

    const acciones: TableRowAction<PendienteResponse>[] = [
        {
            id: 'ver',
            header: 'Ver',
            iconName: 'eye',
            variant: 'ghost',
            onClick: (fila) =>
                void navegar(esPlan(fila) ? rutaPlanElemento(fila.elementoId) : rutaElemento(fila.elementoId)),
        },
        {
            id: 'aprobar',
            header: 'Aprobar',
            iconName: 'check_circle',
            variant: 'ghost',
            disabled: esPlan,
            onClick: (fila) => resolucion.pedirAprobacion(aResoluble(fila)),
        },
        {
            id: 'rechazar',
            header: 'Rechazar',
            iconName: 'x_circle',
            variant: 'ghost',
            disabled: esPlan,
            onClick: (fila) => resolucion.pedirRechazo(aResoluble(fila)),
        },
    ]

    return (
        <>
            <Pantalla
                titulo="Aprobaciones"
                descripcion="Planes, prórrogas y cierres que le toca resolver, del más antiguo al más nuevo. Los planes se revisan y aprueban en su página, con sus tareas."
            >
                <div style={columna(spacing.md)}>
                    <BarraAprobaciones
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        filtros={filtros}
                        onFiltrar={setFiltros}
                        criticidades={opciones.criticidades}
                        equipos={opciones.equipos}
                    />
                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <TablaPaginada
                            columnas={COLUMNAS_APROBACIONES}
                            acciones={acciones}
                            filas={filas}
                            claveFila={(fila) => `${fila.tipo}-${fila.id}`}
                            etiquetaFila={(fila) => `${TIPO_PENDIENTE[fila.tipo].texto} de ${fila.elementoCodigo}`}
                            claveReinicio={`${termino}|${filtros.tipo}|${filtros.criticidad}|${filtros.equipo}`}
                            cargando={cargando}
                            textoVacio={
                                termino === '' && !hayFiltrosAprobaciones(filtros)
                                    ? 'No hay aprobaciones pendientes'
                                    : 'Ninguna aprobación coincide con la búsqueda o los filtros'
                            }
                        />
                    )}
                </div>
            </Pantalla>
            {resolucion.ventanas}
        </>
    )
}
