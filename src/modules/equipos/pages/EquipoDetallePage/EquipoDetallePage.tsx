import { spacing } from '@hnba/design-tokens'
import { Alert, Loader, Tabs } from '@hnba/react-ui'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { EnlaceVolver } from '../../../../components/common/EnlaceVolver/EnlaceVolver'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { AccionesPantalla, type AccionPantalla } from '../../../../components/common/AccionesPantalla/AccionesPantalla'
import { columna } from '../../../../styles/disposicion'
import { useNavegacion } from '../../../../hooks/useNavegacion'
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
    const { origen, volver: volverAtras } = useNavegacion()
    const id = Number(useParams().id)
    const [pestana, setPestana] = useState<Pestana>('miembros')
    const [formulario, setFormulario] = useState<Formulario>(null)
    const { detalle, historialMiembros, historialLideres, cargando, error, recargar } = useDetalleEquipo(id)
    const { retirar, dialogo } = useRetirarMiembro(id, recargar)
    const { puedeEditar, puedeCambiarLider, puedeAgregarMiembro, puedeRetirarMiembro } = usePermisosEquipos(
        detalle?.liderId,
    )

    const volver = (
        <EnlaceVolver texto={origen?.etiqueta ?? 'Volver a equipos'} onClick={() => volverAtras(RUTAS.equipos)} />
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
    // Sin lider, asignarlo se queda a la vista (lo pide el aviso); con lider, cambiarlo va en el menu
    const sinLider = detalle.liderId === null
    const accionLider: AccionPantalla = {
        texto: sinLider ? 'Asignar líder' : 'Cambiar líder',
        icono: 'user_shield_solid',
        visible: puedeCambiarLider && activo,
        onClick: () => setFormulario('lider'),
    }

    return (
        <>
            <Pantalla
                titulo={detalle.nombre}
                descripcion="Datos y miembros del equipo."
                volver={volver}
                acciones={
                    <AccionesPantalla
                        principal={{
                            texto: 'Agregar miembro',
                            icono: 'user_plus',
                            visible: puedeAgregarMiembro && activo,
                            onClick: () => setFormulario('miembro'),
                        }}
                        directas={sinLider ? [accionLider] : []}
                        secundarias={[
                            {
                                texto: 'Editar',
                                icono: 'edit',
                                visible: puedeEditar,
                                onClick: () => setFormulario('editar'),
                            },
                            ...(sinLider ? [] : [accionLider]),
                        ]}
                    />
                }
            >
                <div style={columna(spacing.md)}>
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
