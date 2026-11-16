import { spacing } from '@hnba/design-tokens'
import { Alert, Button, Loader, Tabs } from '@hnba/react-ui'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { columna, fila, filaEntreExtremos } from '../../../../styles/disposicion'
import { RUTAS } from '../../../../utils/constants/rutas'
import { EquipoForm } from '../../components/EquipoForm/EquipoForm'
import { LiderForm } from '../../components/LiderForm/LiderForm'
import { MiembroForm } from '../../components/MiembroForm/MiembroForm'
import { ResumenEquipo } from '../../components/ResumenEquipo/ResumenEquipo'
import { TablaMiembros } from '../../components/TablaMiembros/TablaMiembros'
import { useDetalleEquipo } from '../../hooks/useDetalleEquipo'
import { usePermisosEquipos } from '../../hooks/usePermisosEquipos'
import { useRetirarMiembro } from '../../hooks/useRetirarMiembro'

type Pestana = 'miembros' | 'historial' | 'lideres'
type Formulario = 'editar' | 'lider' | 'miembro' | null

const PESTANAS: { id: Pestana; label: string }[] = [
    { id: 'miembros', label: 'Miembros' },
    { id: 'historial', label: 'Historial de miembros' },
    { id: 'lideres', label: 'Historial de líderes' },
]

export const EquipoDetallePage = () => {
    const navegar = useNavigate()
    const id = Number(useParams().id)
    const [pestana, setPestana] = useState<Pestana>('miembros')
    const [formulario, setFormulario] = useState<Formulario>(null)
    const { detalle, historialMiembros, historialLideres, cargando, error, recargar } = useDetalleEquipo(id)
    const { retirar, dialogo } = useRetirarMiembro(id, recargar)
    const { puedeEditar, puedeCambiarLider, puedeAgregarMiembro, puedeRetirarMiembro } = usePermisosEquipos(
        detalle?.liderId,
    )

    const volver = (
        <Button variant="ghost" iconName="chevron_left" onClick={() => void navegar(RUTAS.equipos)}>
            Volver a equipos
        </Button>
    )

    if (cargando) {
        return <Loader />
    }
    if (error || !detalle) {
        return (
            <div style={columna(spacing.md)}>
                <Alert variant="error" description={error?.mensaje ?? 'No se encontró el equipo'} />
                <div>{volver}</div>
            </div>
        )
    }

    const alTerminar = () => {
        setFormulario(null)
        recargar()
    }
    // En un equipo inactivo no se agregan miembros ni se cambia el lider
    const activo = detalle.activo

    return (
        <>
            <Pantalla
                titulo={detalle.nombre}
                descripcion="Área, líder y miembros del equipo. El historial conserva a quienes ya salieron."
            >
                <div style={columna(spacing.md)}>
                    <div style={filaEntreExtremos}>
                        {volver}
                        <div style={fila(spacing.sm)}>
                            {puedeEditar && (
                                <Button variant="outlined" iconName="edit" onClick={() => setFormulario('editar')}>
                                    Editar
                                </Button>
                            )}
                            {puedeCambiarLider && activo && (
                                <Button
                                    variant="outlined"
                                    iconName="user_shield_solid"
                                    onClick={() => setFormulario('lider')}
                                >
                                    {detalle.liderId === null ? 'Asignar líder' : 'Cambiar líder'}
                                </Button>
                            )}
                            {puedeAgregarMiembro && activo && (
                                <Button variant="primary" iconName="user_plus" onClick={() => setFormulario('miembro')}>
                                    Agregar miembro
                                </Button>
                            )}
                        </div>
                    </div>

                    {!activo && (
                        <Alert
                            variant="info"
                            description="El equipo está inactivo: no se pueden agregar miembros ni cambiar el líder."
                        />
                    )}
                    {activo && detalle.liderId === null && (
                        <Alert variant="warning" description="El equipo no tiene líder. Asígnele uno." />
                    )}

                    <ResumenEquipo equipo={detalle} />

                    <Tabs tabs={PESTANAS} value={pestana} onChange={(siguiente) => setPestana(siguiente as Pestana)} />
                    {pestana === 'miembros' && (
                        <TablaMiembros
                            miembros={detalle.miembros}
                            historial={false}
                            textoVacio="El equipo no tiene miembros vigentes"
                            onRetirar={puedeRetirarMiembro && activo ? retirar : undefined}
                        />
                    )}
                    {pestana === 'historial' && (
                        <TablaMiembros
                            miembros={historialMiembros}
                            historial
                            textoVacio="El equipo no ha tenido miembros"
                        />
                    )}
                    {pestana === 'lideres' && (
                        <TablaMiembros
                            miembros={historialLideres}
                            historial
                            textoVacio="El equipo no ha tenido líderes"
                        />
                    )}
                </div>
            </Pantalla>

            {formulario === 'editar' && (
                <EquipoForm
                    equipo={{ ...detalle, cantidadMiembros: detalle.miembros.length }}
                    onCerrar={() => setFormulario(null)}
                    onGuardado={alTerminar}
                />
            )}
            {formulario === 'lider' && (
                <LiderForm equipo={detalle} onCerrar={() => setFormulario(null)} onCambiado={alTerminar} />
            )}
            {formulario === 'miembro' && (
                <MiembroForm equipo={detalle} onCerrar={() => setFormulario(null)} onAgregado={alTerminar} />
            )}
            {dialogo}
        </>
    )
}
