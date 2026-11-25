import { spacing } from '@hnba/design-tokens'
import { Alert, Button, EmptyState, Loader, Select, Text } from '@hnba/react-ui'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePublicarListaDelElemento } from '../../../../components/common/MigasDePan/listaDelElemento'
import { EnlaceVolver } from '../../../../components/common/EnlaceVolver/EnlaceVolver'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { AccionesPantalla } from '../../../../components/common/AccionesPantalla/AccionesPantalla'
import { AvisoConAccion } from '../../../../components/common/AvisoConAccion/AvisoConAccion'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { useNavegacion } from '../../../../hooks/useNavegacion'
import { useSesionStore } from '../../../../store/sesionStore'
import { columna, filaEntreExtremos } from '../../../../styles/disposicion'
import { PERMISOS } from '../../../../utils/constants/permisos'
import {
    rutaElemento,
    rutaListaDe,
    rutaPestanaElemento,
    rutaReporte,
    rutaTareaPlan,
} from '../../../../utils/constants/rutas'
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
    const id = Number(useParams().id)
    const conLider = useSesionStore((estado) => necesitaLiderDelEquipo(estado.usuario))
    const pagina = usePaginaPlan(id, conLider)
    const { ficha, plan } = pagina
    const { origen, ir, volver: volverAtras } = useNavegacion()
    usePublicarListaDelElemento(ficha ? rutaListaDe(ficha.tipo) : undefined)
    const [formulario, setFormulario] = useState<FormularioPlan>(null)
    // Ver una tarea abre su pagina; si el plan que se mira no es el vigente, el enlace lleva su id
    const verTarea = (tareaId: number) => {
        const vigente = pagina.versiones.find((version) => version.id === pagina.planElegidoId)?.vigente ?? true
        ir(rutaTareaPlan(id, tareaId, vigente ? null : pagina.planElegidoId))
    }
    const permisos = usePermisosPlan(ficha, plan, pagina.liderDelEquipo)
    const veReportes = usePermiso(PERMISOS.reporteLeer)

    const alTerminar = () => {
        setFormulario(null)
        pagina.recargar()
    }
    const acciones = useAccionesPlan(plan, pagina.recargar)

    // Regresa a la pantalla de donde se llego (Aprobaciones, Mis tareas, el elemento…); sin origen, al elemento
    const volver = (
        <EnlaceVolver texto={origen?.etiqueta ?? 'Volver al elemento'} onClick={() => volverAtras(rutaElemento(id))} />
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

    // El aviso solo es para quien podria armar o cambiar el plan; el resto lo ve igual, sin botones que explicar
    const bloqueado =
        permisos.vencido &&
        (permisos.puedeCrearPlan ||
            permisos.puedeEditarPlan ||
            permisos.puedeNuevaVersion ||
            permisos.puedeCrearTarea ||
            permisos.muestraEditarTarea)
    const opcionesVersion = pagina.versiones.map(opcionVersion)
    const tituloVersion = plan ? ` (versión ${plan.version})` : ''

    return (
        <>
            <Pantalla
                titulo={`${ficha.codigo} - Plan de acción${tituloVersion}`}
                descripcion="Plan para resolver el elemento."
                volver={volver}
                acciones={
                    <AccionesPantalla
                        principal={
                            permisos.puedeResolver
                                ? {
                                      texto: 'Aprobar',
                                      icono: 'vote_yea',
                                      visible: true,
                                      onClick: acciones.pedirAprobacion,
                                  }
                                : {
                                      texto: 'Enviar a aprobación',
                                      icono: 'share',
                                      visible: permisos.puedeEnviar,
                                      deshabilitada: !plan?.listoParaEnvio,
                                      onClick: acciones.pedirEnvio,
                                  }
                        }
                        directas={[
                            {
                                texto: 'Devolver',
                                icono: 'vote_no',
                                visible: permisos.puedeResolver,
                                onClick: () => setFormulario({ tipo: 'devolver' }),
                            },
                        ]}
                        secundarias={[
                            {
                                texto: 'Editar plan',
                                icono: 'edit',
                                visible: permisos.puedeEditarPlan,
                                deshabilitada: permisos.vencido,
                                onClick: () => setFormulario({ tipo: 'plan' }),
                            },
                            {
                                texto: 'Nueva versión',
                                icono: 'copy',
                                visible: permisos.puedeNuevaVersion,
                                deshabilitada: permisos.vencido,
                                onClick: () => setFormulario({ tipo: 'version' }),
                            },
                            {
                                // Abre la pantalla de reportes con REP-05 y este elemento ya elegidos
                                texto: 'Reporte del plan',
                                icono: 'file_excel',
                                visible: veReportes && plan !== null,
                                onClick: () => ir(rutaReporte('REP-05', { elemento: String(id) })),
                            },
                        ]}
                    />
                }
            >
                <div style={columna(spacing.md)}>
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

                    <FranjaElemento ficha={ficha} />

                    {bloqueado && (
                        <AvisoConAccion
                            variant="warning"
                            title="Elemento vencido"
                            description="No se puede crear ni editar el plan ni sus tareas hasta que se apruebe una prórroga y cambie la fecha compromiso."
                            textoAccion="Ir a prórrogas"
                            onAccion={() => ir(rutaPestanaElemento(id, 'prorrogas'))}
                        />
                    )}

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
                                        disabled={permisos.vencido}
                                        onClick={() => setFormulario({ tipo: 'tarea', tarea: null })}
                                    >
                                        Nueva tarea
                                    </Button>
                                )}
                            </div>
                            <TablaTareas
                                plan={plan}
                                onVer={(tarea) => verTarea(tarea.id)}
                                onAvance={
                                    permisos.muestraAvance
                                        ? (tarea) => setFormulario({ tipo: 'avance', tarea })
                                        : undefined
                                }
                                puedeAvance={permisos.puedeAvance}
                                puedeCancelar={permisos.puedeCancelarTarea}
                                edicionBloqueada={permisos.vencido}
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
                                    ? permisos.vencido
                                        ? 'El elemento está vencido: el plan se podrá crear cuando se apruebe una prórroga.'
                                        : 'Cree el plan con su objetivo, estrategia y fechas; después agregue las tareas.'
                                    : 'Lo arma el líder del equipo del elemento.'
                            }
                            actionLabel={permisos.puedeCrearPlan && !permisos.vencido ? 'Crear plan' : undefined}
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
