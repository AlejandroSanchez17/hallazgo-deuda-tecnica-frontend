import { spacing } from '@hnba/design-tokens'
import { Alert, Badge, Card, List, ListItem, Loader, Text, type IconName } from '@hnba/react-ui'
import { useState, type ReactNode } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { usePublicarListaDelElemento } from '../../../../components/common/MigasDePan/listaDelElemento'
import { EnlaceVolver } from '../../../../components/common/EnlaceVolver/EnlaceVolver'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { AccionesPantalla } from '../../../../components/common/AccionesPantalla/AccionesPantalla'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { useSesionStore } from '../../../../store/sesionStore'
import { columna, fila } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { PARAMETRO_PLAN, rutaListaDe, rutaPlanElemento } from '../../../../utils/constants/rutas'
import { formatearFecha, formatearFechaHora } from '../../../../utils/formato'
import { AvanceForm } from '../../components/AvanceForm/AvanceForm'
import { BarraAvance } from '../../components/BarraAvance/BarraAvance'
import { EvidenciasTarea } from '../../components/EvidenciasTarea/EvidenciasTarea'
import { HistorialAvances } from '../../components/HistorialAvances/HistorialAvances'
import { necesitaLiderDelEquipo, usePermisosPlan } from '../../hooks/usePermisosPlan'
import { useTareaDetalle } from '../../hooks/useTareaDetalle'
import { avisoDependencia, ESTADO_TAREA, textoNumero } from '../../textosPlan'

// Dos columnas de datos, nunca mas (con el minimo de 45 % no caben tres, aunque la pantalla sea ancha); en una pantalla
// angosta, cuando dos de 320 px ya no caben, bajan a una columna
const rejillaResumen = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(max(320px, 45%), 1fr))',
    columnGap: spacing.lg,
}

// Historial de avances y evidencias, uno junto al otro. El historial va primero porque crece con cada avance y las
// evidencias suelen ser pocas
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

// Para un valor que puede ser largo (descripcion, motivo, el titulo de otra tarea): el espacio final de la fila no se
// parte en lineas y empujaba el rotulo fuera de la pantalla; va como subtitulo, que salta de linea en vez de cortarse
// con "…". Se respetan los saltos de linea del texto y va justificado (la libreria no trae opcion: va en el estilo)
const textoLargo = { display: 'block', whiteSpace: 'pre-line', overflowWrap: 'anywhere', textAlign: 'justify' } as const

const datoLargo = (icono: IconName, titulo: string, valor: string) => (
    <ListItem iconName={icono} title={titulo} subtitle={<span style={textoLargo}>{valor}</span>} />
)

// Las dos columnas se arman por pares: cada dato de la izquierda queda en la misma fila de la rejilla que el de la
// derecha (cada uno en su propia lista de una fila), asi las filas quedan a la par aunque un texto ocupe varias lineas.
// Si una columna tiene menos datos, la celda queda vacia
const enParejas = (izquierda: ReactNode[], derecha: ReactNode[]) =>
    Array.from({ length: Math.max(izquierda.length, derecha.length) }, (_, posicion) =>
        [izquierda[posicion], derecha[posicion]].map((item, lado) =>
            item ? <List key={`${posicion}-${lado}`}>{item}</List> : <div key={`${posicion}-${lado}`} />,
        ),
    ).flat()

// Detalle de una tarea del plan. Lo ven todos los que ven el plan (sobre todo quien lo aprueba); quien puede registrar avances los registra aqui, donde se conocen el plan y las evidencias
export const TareaDetallePage = () => {
    const { id, tareaId } = useParams()
    const elementoId = Number(id)
    const planId = Number(useSearchParams()[0].get(PARAMETRO_PLAN)) || null
    const conLider = useSesionStore((estado) => necesitaLiderDelEquipo(estado.usuario))
    const { ficha, plan, liderDelEquipo, cargando, error, recarga, recargar } = useTareaDetalle(
        elementoId,
        planId,
        conLider,
    )
    usePublicarListaDelElemento(ficha ? rutaListaDe(ficha.tipo) : undefined)
    const permisos = usePermisosPlan(ficha, plan, liderDelEquipo)
    const veEvidencias = usePermiso(PERMISOS.evidenciaLeer)
    const [registrando, setRegistrando] = useState(false)

    // Regresa a la pantalla de donde se llego (por ejemplo, el plan, que a su vez recuerda su origen); sin origen, al plan
    const { origen, volver: volverAtras } = useNavegacion()
    const volver = (
        <EnlaceVolver
            texto={origen?.etiqueta ?? 'Volver al plan'}
            onClick={() => volverAtras(rutaPlanElemento(elementoId))}
        />
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
        return <Navigate to={rutaPlanElemento(elementoId)} replace state={origen ? { origen } : undefined} />
    }
    const problemas = plan.problemas.filter((problema) => problema.tareaId === tarea.id)

    const tituloMotivo =
        tarea.estado === 'CANCELADA'
            ? 'Justificación de la cancelación'
            : tarea.estado === 'BLOQUEADA'
              ? 'Motivo del bloqueo'
              : 'Motivo del estado'
    // A la izquierda, que es y quien la lleva (descripcion, responsable, plazos y, si los hay, el motivo del estado y el
    // origen); a la derecha, de que depende y como va (estado, peso, avance y ultimo avance)
    const columnaIzquierda = [
        datoLargo('file_lines', 'Descripción', tarea.descripcion ?? 'Sin descripción'),
        dato('user_alt', 'Responsable', texto(tarea.responsableNombre)),
        dato('calendar_alt', 'Inicio', texto(formatearFecha(tarea.fechaInicio))),
        dato('calendar_check', 'Fin', texto(formatearFecha(tarea.fechaFin))),
        ...(tarea.motivoEstado ? [datoLargo('exclamation_triangle', tituloMotivo, tarea.motivoEstado)] : []),
        ...(tarea.tareaOrigenId !== null ? [dato('copy', 'Origen', texto('Copiada de la versión anterior'))] : []),
    ]
    const columnaDerecha = [
        // Con dependencia el titulo puede ser largo (va como subtitulo); sin ella es un valor corto, como los demas
        tarea.dependeDeTitulo
            ? datoLargo('square_list', 'Depende de', tarea.dependeDeTitulo)
            : dato('square_list', 'Depende de', texto('Sin dependencia')),
        dato(
            'check_circle',
            'Estado',
            <>
                <Badge status={ESTADO_TAREA[tarea.estado].estado} label={ESTADO_TAREA[tarea.estado].texto} />
                {tarea.vencida && <Badge status="error" label="Vencida" />}
            </>,
        ),
        dato('percentage', 'Peso', texto(`${textoNumero(tarea.peso)} de 100`)),
        dato('chart_pie', 'Avance', <BarraAvance valor={tarea.avance} ancho={120} enLinea />),
        dato(
            'clock',
            'Último avance',
            texto(tarea.ultimoAvanceFecha ? formatearFechaHora(tarea.ultimoAvanceFecha) : 'Sin avances'),
        ),
    ]

    return (
        <>
            <Pantalla
                titulo={tarea.titulo}
                descripcion={`${ficha.codigo} · Versión ${plan.version} del plan. Detalle y avances de la tarea.`}
                volver={volver}
                acciones={
                    <AccionesPantalla
                        principal={{
                            texto: 'Registrar avance',
                            visible: permisos.puedeAvance(tarea),
                            onClick: () => setRegistrando(true),
                        }}
                    />
                }
            >
                <div style={columna(spacing.md)}>
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
                        <div style={rejillaResumen}>{enParejas(columnaIzquierda, columnaDerecha)}</div>
                    </Card>
                    <div style={rejillaSecciones}>
                        <Card padding={24}>
                            <HistorialAvances key={recarga} tareaId={tarea.id} />
                        </Card>
                        {veEvidencias && (
                            <Card padding={24}>
                                <EvidenciasTarea key={recarga} elemento={ficha} plan={plan} tarea={tarea} />
                            </Card>
                        )}
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
