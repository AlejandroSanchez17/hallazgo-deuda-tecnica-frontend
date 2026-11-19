import { spacing } from '@hnba/design-tokens'
import { Alert, Button, EmptyState, Loader, Select, Text } from '@hnba/react-ui'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { useSesionStore } from '../../../../store/sesionStore'
import { columna, fila, filaEntreExtremos } from '../../../../styles/disposicion'
import { PARAMETRO_TAREA, rutaElemento } from '../../../../utils/constants/rutas'
import { AvisosPlan } from '../../components/AvisosPlan/AvisosPlan'
import { ComentariosPlan } from '../../components/ComentariosPlan/ComentariosPlan'
import { FormulariosPlan, type FormularioPlan } from '../../components/FormulariosPlan/FormulariosPlan'
import { FranjaElemento } from '../../components/FranjaElemento/FranjaElemento'
import { ResumenPlan } from '../../components/ResumenPlan/ResumenPlan'
import { TablaTareas } from '../../components/TablaTareas/TablaTareas'
import { useAccionesPlan } from '../../hooks/useAccionesPlan'
import { usePaginaPlan } from '../../hooks/usePaginaPlan'
import { necesitaLiderDelEquipo, usePermisosPlan } from '../../hooks/usePermisosPlan'
import { ESTADO_PLAN } from '../../textosPlan'
import type { PlanResumen } from '../../typesPlan'

interface OpcionVersion {
    id: number
    texto: string
}

const opcionVersion = (version: PlanResumen): OpcionVersion => ({
    id: version.id,
    texto: `Versión ${version.version} · ${version.vigente ? 'vigente' : ESTADO_PLAN[version.estado].texto}`,
})

// Pagina propia del plan de accion del elemento (decidido por el usuario el 17/11), con sus versiones
export const PlanElementoPage = () => {
    const navegar = useNavigate()
    const id = Number(useParams().id)
    const conLider = useSesionStore((estado) => necesitaLiderDelEquipo(estado.usuario))
    const pagina = usePaginaPlan(id, conLider)
    const { ficha, plan } = pagina
    const [formulario, setFormulario] = useState<FormularioPlan>(null)
    // ?tarea=15 abre Ver tarea al cargar el plan (lo usan las notificaciones). Si la tarea no esta en el plan
    // (por ejemplo, una version nueva la copio con otro id), solo se muestra el plan
    const tareaPedida = Number(useSearchParams()[0].get(PARAMETRO_TAREA)) || null
    const [tareaAtendida, setTareaAtendida] = useState<number | null>(null)
    if (tareaPedida !== null && tareaPedida !== tareaAtendida && plan && !pagina.cargandoVersion) {
        setTareaAtendida(tareaPedida)
        const tarea = plan.tareas.find((candidata) => candidata.id === tareaPedida)
        if (tarea) {
            setFormulario({ tipo: 'ver', tarea })
        }
    }
    const permisos = usePermisosPlan(ficha, plan, pagina.liderDelEquipo)

    const alTerminar = () => {
        setFormulario(null)
        pagina.recargar()
    }
    const acciones = useAccionesPlan(plan, pagina.recargar)

    const volver = (
        <Button variant="ghost" iconName="chevron_left" onClick={() => void navegar(rutaElemento(id))}>
            Volver al elemento
        </Button>
    )

    if (pagina.cargando) {
        return <Loader />
    }
    if (pagina.error || !ficha) {
        return (
            <div style={columna(spacing.md)}>
                <Alert variant="error" description={pagina.error?.mensaje ?? 'No se encontró el elemento'} />
                <div>{volver}</div>
            </div>
        )
    }

    const opcionesVersion = pagina.versiones.map(opcionVersion)
    const tituloVersion = plan ? ` (versión ${plan.version})` : ''

    return (
        <>
            <Pantalla
                titulo={`${ficha.codigo} - Plan de acción${tituloVersion}`}
                descripcion="Objetivo, estrategia y tareas del plan, con sus versiones y comentarios."
            >
                <div style={columna(spacing.md)}>
                    <div style={filaEntreExtremos}>
                        <div style={fila(spacing.md)}>
                            {volver}
                            {opcionesVersion.length > 1 && (
                                <div style={{ width: 260 }} aria-label="Versión del plan" role="group">
                                    <Select
                                        options={opcionesVersion}
                                        value={opcionesVersion.find((opcion) => opcion.id === pagina.planElegidoId)}
                                        getLabel={(opcion) => opcion.texto}
                                        getValue={(opcion) => String(opcion.id)}
                                        onChange={(opcion) => pagina.elegirVersion(opcion.id)}
                                    />
                                </div>
                            )}
                        </div>
                        <div style={fila(spacing.sm)}>
                            {permisos.puedeEditarPlan && (
                                <Button
                                    variant="outlined"
                                    iconName="edit"
                                    onClick={() => setFormulario({ tipo: 'plan' })}
                                >
                                    Editar plan
                                </Button>
                            )}
                            {permisos.puedeNuevaVersion && (
                                <Button
                                    variant="outlined"
                                    iconName="copy"
                                    onClick={() => setFormulario({ tipo: 'version' })}
                                >
                                    Nueva versión
                                </Button>
                            )}
                            {permisos.puedeResolver && (
                                <>
                                    <Button
                                        variant="outlined"
                                        iconName="vote_no"
                                        onClick={() => setFormulario({ tipo: 'devolver' })}
                                    >
                                        Devolver
                                    </Button>
                                    <Button variant="primary" iconName="vote_yea" onClick={acciones.pedirAprobacion}>
                                        Aprobar
                                    </Button>
                                </>
                            )}
                            {permisos.puedeEnviar && (
                                <Button
                                    variant="primary"
                                    iconName="share"
                                    disabled={!plan?.listoParaEnvio}
                                    onClick={acciones.pedirEnvio}
                                >
                                    Enviar a aprobación
                                </Button>
                            )}
                        </div>
                    </div>

                    <FranjaElemento ficha={ficha} />

                    {pagina.cargandoVersion && <Loader />}
                    {!pagina.cargandoVersion && plan && (
                        <>
                            <AvisosPlan plan={plan} />
                            <ResumenPlan plan={plan} />
                            <div style={filaEntreExtremos}>
                                <Text variant="h6" as="h2" style={{ margin: 0 }}>
                                    Tareas
                                </Text>
                                {permisos.puedeCrearTarea && (
                                    <Button
                                        variant="primary"
                                        iconName="plus"
                                        onClick={() => setFormulario({ tipo: 'tarea', tarea: null })}
                                    >
                                        Nueva tarea
                                    </Button>
                                )}
                            </div>
                            <TablaTareas
                                plan={plan}
                                onVer={(tarea) => setFormulario({ tipo: 'ver', tarea })}
                                onAvance={
                                    permisos.muestraAvance
                                        ? (tarea) => setFormulario({ tipo: 'avance', tarea })
                                        : undefined
                                }
                                puedeAvance={permisos.puedeAvance}
                                puedeCancelar={permisos.puedeCancelarTarea}
                                onEditar={
                                    permisos.muestraEditarTarea
                                        ? (tarea) => setFormulario({ tipo: 'tarea', tarea })
                                        : undefined
                                }
                                onCancelar={
                                    permisos.muestraCancelarTarea
                                        ? (tarea) => setFormulario({ tipo: 'cancelar', tarea })
                                        : undefined
                                }
                            />
                            <ComentariosPlan plan={plan} />
                        </>
                    )}
                    {!pagina.cargandoVersion && !plan && (
                        <EmptyState
                            iconName="square_list"
                            title="El elemento no tiene plan de acción"
                            description={
                                permisos.puedeCrearPlan
                                    ? 'Cree el plan con su objetivo, estrategia y fechas; después agregue las tareas.'
                                    : 'Lo arma el líder del equipo del elemento.'
                            }
                            actionLabel={permisos.puedeCrearPlan ? 'Crear plan' : undefined}
                            onAction={() => setFormulario({ tipo: 'plan' })}
                        />
                    )}
                </div>
            </Pantalla>

            <FormulariosPlan
                formulario={formulario}
                ficha={ficha}
                plan={plan}
                onCerrar={() => setFormulario(null)}
                onHecho={alTerminar}
            />
            {acciones.dialogo}
        </>
    )
}
