import { spacing } from '@hnba/design-tokens'
import { Alert, Button, Loader, Tabs } from '@hnba/react-ui'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { columna, fila, filaEntreExtremos } from '../../../../styles/disposicion'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { RUTAS, rutaPlanElemento } from '../../../../utils/constants/rutas'
import { AnulacionForm } from '../../components/AnulacionForm/AnulacionForm'
import { AvisosElemento } from '../../components/AvisosElemento/AvisosElemento'
import { CierreElemento } from '../../components/CierreElemento/CierreElemento'
import { ComentariosElemento } from '../../components/ComentariosElemento/ComentariosElemento'
import { DatosElemento } from '../../components/DatosElemento/DatosElemento'
import { ElementoForm } from '../../components/ElementoForm/ElementoForm'
import { EvidenciasElemento } from '../../components/EvidenciasElemento/EvidenciasElemento'
import { DatosDePestana } from '../../components/DatosDePestana/DatosDePestana'
import { HistorialElemento } from '../../components/HistorialElemento/HistorialElemento'
import { ProrrogasElemento } from '../../components/ProrrogasElemento/ProrrogasElemento'
import { ReasignacionForm } from '../../components/ReasignacionForm/ReasignacionForm'
import { ResumenElemento } from '../../components/ResumenElemento/ResumenElemento'
import { useDetalleElemento } from '../../hooks/useDetalleElemento'
import { usePermisosElementos } from '../../hooks/usePermisosElementos'
import { necesitaLiderParaSolicitar } from '../../hooks/usePermisosProrrogaCierre'
import { useProrrogaCierre } from '../../hooks/useProrrogaCierre'
import { useSesionStore } from '../../../../store/sesionStore'

// El plan tiene su propia pagina
type Pestana = 'datos' | 'historial' | 'evidencias' | 'prorrogas' | 'cierre' | 'comentarios'
type Formulario = 'editar' | 'reasignar' | 'anular' | null

const PESTANAS: { id: Pestana; label: string }[] = [
    { id: 'datos', label: 'Datos' },
    { id: 'historial', label: 'Historial' },
    { id: 'evidencias', label: 'Evidencias' },
    { id: 'prorrogas', label: 'Prórrogas' },
    { id: 'cierre', label: 'Cierre' },
    { id: 'comentarios', label: 'Comentarios' },
]

export const ElementoDetallePage = () => {
    const navegar = useNavigate()
    const id = Number(useParams().id)
    const [pestana, setPestana] = useState<Pestana>('datos')
    const [formulario, setFormulario] = useState<Formulario>(null)
    const permisos = usePermisosElementos()
    const veElPlan = usePermiso(PERMISOS.planLeer)
    const veEvidencias = usePermiso(PERMISOS.evidenciaLeer)
    const conLiderDelEquipo = useSesionStore(
        (estado) => permisos.necesitaLiderDelEquipo || necesitaLiderParaSolicitar(estado.usuario),
    )
    const { ficha, reasignaciones, estados, liderDelEquipo, cargando, error, recargar } = useDetalleElemento(
        id,
        conLiderDelEquipo,
    )
    const pc = useProrrogaCierre(id, ficha, liderDelEquipo, recargar)
    // Sin el permiso de leer, la pestana no se muestra (el Miembro de equipo no ve prorrogas ni cierres)
    const visibles: Record<Pestana, boolean> = {
        datos: true,
        historial: true,
        evidencias: veEvidencias,
        prorrogas: pc.veProrrogas,
        cierre: pc.veCierre,
        comentarios: true,
    }

    const volver = (
        <Button variant="ghost" iconName="chevron_left" onClick={() => void navegar(RUTAS.elementos)}>
            Volver a hallazgos y deuda
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

    const alTerminar = () => {
        setFormulario(null)
        recargar()
    }

    return (
        <>
            <Pantalla
                titulo={`${ficha.codigo} - ${ficha.titulo}`}
                descripcion="Datos del elemento, su historial, sus evidencias, sus prórrogas, su cierre y sus comentarios."
            >
                <div style={columna(spacing.md)}>
                    <div style={filaEntreExtremos}>
                        {volver}
                        <div style={fila(spacing.sm)}>
                            {veElPlan && (
                                <Button
                                    variant="outlined"
                                    iconName="square_list"
                                    onClick={() => void navegar(rutaPlanElemento(ficha.id))}
                                >
                                    Plan de acción
                                </Button>
                            )}
                            {permisos.puedeEditar(ficha) && (
                                <Button variant="outlined" iconName="edit" onClick={() => setFormulario('editar')}>
                                    Editar
                                </Button>
                            )}
                            {permisos.puedeAnular(ficha) && (
                                <Button variant="outlined" iconName="x_circle" onClick={() => setFormulario('anular')}>
                                    Anular
                                </Button>
                            )}
                            {permisos.puedeReasignar(ficha, liderDelEquipo) && (
                                <Button
                                    variant="primary"
                                    iconName="transfer"
                                    onClick={() => setFormulario('reasignar')}
                                >
                                    Reasignar
                                </Button>
                            )}
                        </div>
                    </div>

                    {ficha.estado === 'ANULADO' && (
                        <Alert
                            variant="error"
                            title="Elemento anulado"
                            description={ficha.motivoAnulacion ?? 'Sin motivo registrado'}
                        />
                    )}

                    <ResumenElemento ficha={ficha} maximoProrrogas={pc.resumen?.maximo} />

                    <AvisosElemento
                        resumen={pc.resumen}
                        cierres={pc.cierres}
                        onVerProrrogas={() => setPestana('prorrogas')}
                        onVerCierre={() => setPestana('cierre')}
                    />

                    {/* Con seis pestanas no caben a 1280 px con el ancho minimo de la libreria (globals.css) */}
                    <div className="pestanas-ajustadas">
                        <Tabs
                            tabs={PESTANAS.filter((opcion) => visibles[opcion.id])}
                            value={pestana}
                            onChange={(siguiente) => setPestana(siguiente as Pestana)}
                        />
                    </div>
                    {pestana === 'datos' && <DatosElemento ficha={ficha} />}
                    {pestana === 'historial' && <HistorialElemento reasignaciones={reasignaciones} estados={estados} />}
                    {pestana === 'evidencias' && veEvidencias && (
                        <EvidenciasElemento elemento={ficha} codigo={ficha.codigo} />
                    )}
                    {pestana === 'prorrogas' && visibles.prorrogas && (
                        <DatosDePestana cargando={pc.cargando} error={pc.error}>
                            {pc.resumen && (
                                <ProrrogasElemento
                                    resumen={pc.resumen}
                                    puedePedir={pc.puedePedirProrroga}
                                    puedeResolver={pc.puedeResolverProrroga}
                                    onPedir={pc.pedirProrroga}
                                    onAprobar={pc.aprobarProrroga}
                                    onRechazar={pc.rechazarProrroga}
                                />
                            )}
                        </DatosDePestana>
                    )}
                    {pestana === 'cierre' && visibles.cierre && (
                        <DatosDePestana cargando={pc.cargando} error={pc.error}>
                            <CierreElemento
                                cierres={pc.cierres}
                                problemas={pc.problemasCierre}
                                puedePedir={pc.puedePedirCierre}
                                puedeValidar={pc.puedeValidarCierre}
                                onPedir={pc.pedirCierre}
                                onAprobar={pc.aprobarCierre}
                                onRechazar={pc.rechazarCierre}
                            />
                        </DatosDePestana>
                    )}
                    {pestana === 'comentarios' && <ComentariosElemento elementoId={ficha.id} />}
                </div>
            </Pantalla>

            {formulario === 'editar' && (
                <ElementoForm ficha={ficha} onCerrar={() => setFormulario(null)} onGuardado={alTerminar} />
            )}
            {formulario === 'reasignar' && (
                <ReasignacionForm
                    ficha={ficha}
                    cambiaEquipo={permisos.cambiaEquipo}
                    onCerrar={() => setFormulario(null)}
                    onReasignado={alTerminar}
                />
            )}
            {formulario === 'anular' && (
                <AnulacionForm ficha={ficha} onCerrar={() => setFormulario(null)} onAnulado={alTerminar} />
            )}
            {pc.ventanas}
        </>
    )
}
