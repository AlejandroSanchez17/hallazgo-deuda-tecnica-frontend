import { spacing } from '@hnba/design-tokens'
import { Alert, Badge, Button, Card, List, ListItem, Loader, Text, type IconName } from '@hnba/react-ui'
import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { useSesionStore } from '../../../../store/sesionStore'
import { columna, fila, filaEntreExtremos } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { PARAMETRO_PLAN, rutaPlanElemento } from '../../../../utils/constants/rutas'
import { formatearFecha, formatearFechaHora } from '../../../../utils/formato'
import { AvanceForm } from '../../components/AvanceForm/AvanceForm'
import { BarraAvance } from '../../components/BarraAvance/BarraAvance'
import { EvidenciasTarea } from '../../components/EvidenciasTarea/EvidenciasTarea'
import { HistorialAvances } from '../../components/HistorialAvances/HistorialAvances'
import { necesitaLiderDelEquipo, usePermisosPlan } from '../../hooks/usePermisosPlan'
import { useTareaDetalle } from '../../hooks/useTareaDetalle'
import { avisoDependencia, ESTADO_TAREA, textoNumero } from '../../textosPlan'

// Dos listas lado a lado; en una pantalla angosta bajan a una columna (igual que el resumen del elemento)
const rejillaResumen = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    columnGap: spacing.lg,
}

// Evidencias e historial de avances, uno junto al otro
const rejillaSecciones = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
    gap: spacing.md,
    alignItems: 'start',
}

const texto = (valor: ReactNode) => <Text variant="body-regular-medium">{valor}</Text>

// Todas las filas con el alto de un Badge, para que las lineas de las dos columnas queden a la misma altura
const altoFila = { ...fila(spacing.sm), minHeight: 32 }

const dato = (icono: IconName, titulo: string, valor: ReactNode) => (
    <ListItem iconName={icono} title={titulo} trailing={<div style={altoFila}>{valor}</div>} />
)

const parrafo = (titulo: string, contenido: string) => (
    <div style={columna(spacing.xs)}>
        <Text variant="label-semibold-large">{titulo}</Text>
        <Text variant="body-regular-large" as="p" style={{ margin: 0, whiteSpace: 'pre-line' }}>
            {contenido}
        </Text>
    </div>
)

// Detalle de una tarea del plan. Lo ven todos los que ven el plan (sobre todo quien lo aprueba); quien puede registrar avances los registra aqui, donde se conocen el plan y las evidencias
export const TareaDetallePage = () => {
    const navegar = useNavigate()
    const { id, tareaId } = useParams()
    const elementoId = Number(id)
    const planId = Number(useSearchParams()[0].get(PARAMETRO_PLAN)) || null
    const conLider = useSesionStore((estado) => necesitaLiderDelEquipo(estado.usuario))
    const { ficha, plan, liderDelEquipo, cargando, error, recarga, recargar } = useTareaDetalle(
        elementoId,
        planId,
        conLider,
    )
    const permisos = usePermisosPlan(ficha, plan, liderDelEquipo)
    const veEvidencias = usePermiso(PERMISOS.evidenciaLeer)
    const [registrando, setRegistrando] = useState(false)

    const volver = (
        <Button variant="ghost" iconName="chevron_left" onClick={() => void navegar(rutaPlanElemento(elementoId))}>
            Volver al plan
        </Button>
    )

    if (cargando) {
        return <Loader />
    }
    if (error || !ficha) {
        return (
            <div style={columna(spacing.md)}>
                <Alert variant="error" description={error?.mensaje ?? 'No se encontró el elemento'} />
                <div>{volver}</div>
            </div>
        )
    }

    const tarea = plan?.tareas.find((candidata) => candidata.id === Number(tareaId))
    // Una tarea que no esta en el plan (por ejemplo, una version nueva la copio con otro id): se muestra el plan
    if (!plan || !tarea) {
        return <Navigate to={rutaPlanElemento(elementoId)} replace />
    }
    const problemas = plan.problemas.filter((problema) => problema.tareaId === tarea.id)

    return (
        <>
            <Pantalla
                titulo={tarea.titulo}
                descripcion={`${ficha.codigo} · Plan de acción, versión ${plan.version}. Datos de la tarea, sus evidencias y su historial de avances.`}
            >
                <div style={columna(spacing.md)}>
                    <div style={filaEntreExtremos}>
                        {volver}
                        {permisos.puedeAvance(tarea) && (
                            <Button variant="primary" onClick={() => setRegistrando(true)}>
                                Registrar avance
                            </Button>
                        )}
                    </div>
                    {problemas.length > 0 && (
                        <Alert variant="warning" title="Revise:">
                            <ul style={{ margin: 0, paddingLeft: spacing.lg }}>
                                {problemas.map((problema) => (
                                    <li key={`${problema.campo}-${problema.mensaje}`}>{problema.mensaje}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}
                    <Card padding={16}>
                        <div style={rejillaResumen}>
                            <List>
                                {dato(
                                    'check_circle',
                                    'Estado',
                                    <>
                                        <Badge
                                            status={ESTADO_TAREA[tarea.estado].estado}
                                            label={ESTADO_TAREA[tarea.estado].texto}
                                        />
                                        {tarea.vencida && <Badge status="error" label="Vencida" />}
                                    </>,
                                )}
                                {dato('user_alt', 'Responsable', texto(tarea.responsableNombre))}
                                {dato('calendar_alt', 'Inicio', texto(formatearFecha(tarea.fechaInicio)))}
                                {dato('calendar_check', 'Fin', texto(formatearFecha(tarea.fechaFin)))}
                            </List>
                            <List>
                                {dato('percentage', 'Peso', texto(`${textoNumero(tarea.peso)} de 100`))}
                                {dato('chart_pie', 'Avance', <BarraAvance valor={tarea.avance} ancho={120} enLinea />)}
                                {dato(
                                    'clock',
                                    'Último avance',
                                    texto(
                                        tarea.ultimoAvanceFecha
                                            ? formatearFechaHora(tarea.ultimoAvanceFecha)
                                            : 'Sin avances',
                                    ),
                                )}
                                {dato('square_list', 'Depende de', texto(tarea.dependeDeTitulo ?? 'Sin dependencia'))}
                                {tarea.tareaOrigenId !== null &&
                                    dato('copy', 'Origen', texto('Copiada de la versión anterior'))}
                            </List>
                        </div>
                    </Card>
                    <Card padding={24}>
                        <div style={columna(spacing.md)}>
                            {parrafo('Descripción', tarea.descripcion ?? 'Sin descripción')}
                            {tarea.motivoEstado &&
                                parrafo(
                                    tarea.estado === 'CANCELADA'
                                        ? 'Justificación de la cancelación'
                                        : tarea.estado === 'BLOQUEADA'
                                          ? 'Motivo del bloqueo'
                                          : 'Motivo del estado',
                                    tarea.motivoEstado,
                                )}
                        </div>
                    </Card>
                    <div style={rejillaSecciones}>
                        {veEvidencias && (
                            <Card padding={24}>
                                <EvidenciasTarea key={recarga} elemento={ficha} plan={plan} tarea={tarea} />
                            </Card>
                        )}
                        <Card padding={24}>
                            <HistorialAvances key={recarga} tareaId={tarea.id} />
                        </Card>
                    </div>
                </div>
            </Pantalla>
            {registrando && (
                <AvanceForm
                    tarea={tarea}
                    avisoDependencia={avisoDependencia(plan, tarea)}
                    onCerrar={() => setRegistrando(false)}
                    onRegistrado={() => {
                        setRegistrando(false)
                        recargar()
                    }}
                />
            )}
        </>
    )
}
