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
import { DatosElemento } from '../../components/DatosElemento/DatosElemento'
import { ElementoForm } from '../../components/ElementoForm/ElementoForm'
import { HistorialElemento } from '../../components/HistorialElemento/HistorialElemento'
import { ReasignacionForm } from '../../components/ReasignacionForm/ReasignacionForm'
import { ResumenElemento } from '../../components/ResumenElemento/ResumenElemento'
import { useDetalleElemento } from '../../hooks/useDetalleElemento'
import { usePermisosElementos } from '../../hooks/usePermisosElementos'

// Evidencias, prorrogas y comentarios se suman cuando tengan su API; el plan tiene su propia pagina
type Pestana = 'datos' | 'historial'
type Formulario = 'editar' | 'reasignar' | 'anular' | null

const PESTANAS: { id: Pestana; label: string }[] = [
    { id: 'datos', label: 'Datos' },
    { id: 'historial', label: 'Historial' },
]

export const ElementoDetallePage = () => {
    const navegar = useNavigate()
    const id = Number(useParams().id)
    const [pestana, setPestana] = useState<Pestana>('datos')
    const [formulario, setFormulario] = useState<Formulario>(null)
    const permisos = usePermisosElementos()
    const veElPlan = usePermiso(PERMISOS.planLeer)
    const { ficha, reasignaciones, estados, liderDelEquipo, cargando, error, recargar } = useDetalleElemento(
        id,
        permisos.necesitaLiderDelEquipo,
    )

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
            <Pantalla titulo={`${ficha.codigo} - ${ficha.titulo}`} descripcion="Datos del elemento y su historial.">
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

                    <ResumenElemento ficha={ficha} />

                    <Tabs tabs={PESTANAS} value={pestana} onChange={(siguiente) => setPestana(siguiente as Pestana)} />
                    {pestana === 'datos' && <DatosElemento ficha={ficha} />}
                    {pestana === 'historial' && <HistorialElemento reasignaciones={reasignaciones} estados={estados} />}
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
        </>
    )
}
