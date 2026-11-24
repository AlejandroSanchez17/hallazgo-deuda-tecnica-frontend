import { spacing } from '@hnba/design-tokens'
import { Alert, Button, ConfirmDialog, Loader, Select, Text } from '@hnba/react-ui'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { columna, fila, filaEntreExtremos, textoSecundario } from '../../../../styles/disposicion'
import { opcionDe, textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { rolesApi } from '../../api'
import { MatrizPermisos } from '../../components/MatrizPermisos/MatrizPermisos'
import { useLista } from '../../hooks/useLista'
import { usePermisosDeRol } from '../../hooks/usePermisosDeRol'
import { usePermisosRoles } from '../../hooks/usePermisosRoles'

export const PermisosPage = () => {
    const [parametros, setParametros] = useSearchParams()
    const [rolPendiente, setRolPendiente] = useState<number | null>(null)
    const { registros: roles, error: errorRoles } = useLista(rolesApi.listar, 'todos')
    const { puedeActualizar } = usePermisosRoles()

    // Sin un rol valido en la ruta se abre el primero de la lista
    const rolId = roles.find((rol) => rol.id === Number(parametros.get('rol')))?.id ?? roles[0]?.id
    const edicion = usePermisosDeRol(rolId)

    const opcionesRol: Opcion[] = roles.map((rol) => ({
        valor: String(rol.id),
        texto: rol.activo ? rol.nombre : `${rol.nombre} (inactivo)`,
    }))

    const irARol = (id: number) => {
        edicion.descartar()
        setParametros({ rol: String(id) })
    }

    const elegirRol = (opcion: Opcion) => {
        const id = Number(opcion.valor)
        if (id === rolId) {
            return
        }
        // Cambiar de rol descarta lo que no se guardó
        if (edicion.cambios > 0) {
            setRolPendiente(id)
        } else {
            irARol(id)
        }
    }

    const error = errorRoles ?? edicion.error
    const asignados = Object.keys(edicion.marcados).length
    const textoCambios = edicion.cambios === 1 ? '1 cambio sin guardar' : `${edicion.cambios} cambios sin guardar`

    const accionesTarjeta = puedeActualizar ? (
        <div style={fila(spacing.sm)}>
            {edicion.cambios > 0 && (
                <Text variant="body-regular-small" as="span" style={textoSecundario}>
                    {textoCambios}
                </Text>
            )}
            <Button variant="outlined" disabled={edicion.cambios === 0} onClick={edicion.descartar}>
                Descartar
            </Button>
            <Button
                variant="primary"
                disabled={edicion.cambios === 0}
                loading={edicion.guardando}
                onClick={() => void edicion.guardar()}
            >
                Guardar
            </Button>
        </div>
    ) : undefined

    return (
        <>
            <Pantalla titulo="Permisos" descripcion="Permisos por rol.">
                <div style={columna(spacing.md)}>
                    {puedeActualizar && edicion.rol && (
                        <Text variant="body-regular-small" as="p" style={textoSecundario}>
                            Cada interruptor da o quita un permiso. «Propio» limita los permisos de esa fila al equipo o
                            a las tareas del usuario.
                        </Text>
                    )}

                    <div style={filaEntreExtremos}>
                        <div style={fila(spacing.md)}>
                            <div style={{ width: 256 }}>
                                <Select
                                    options={opcionesRol}
                                    value={opcionDe(opcionesRol, String(rolId ?? ''))}
                                    getLabel={textoDeOpcion}
                                    getValue={valorDeOpcion}
                                    placeholder="Seleccione un rol"
                                    onChange={elegirRol}
                                />
                            </div>
                            {edicion.rol && (
                                <Text variant="body-regular-medium" as="span" style={textoSecundario}>
                                    {`${asignados} de ${edicion.totalPermisos} permisos`}
                                </Text>
                            )}
                        </div>
                        {accionesTarjeta}
                    </div>

                    {edicion.errorGuardado && (
                        <Alert variant="error" description={edicion.errorGuardado} onDismiss={edicion.cerrarError} />
                    )}

                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : edicion.cargando ? (
                        <Loader />
                    ) : (
                        <MatrizPermisos
                            grupos={edicion.grupos}
                            marcados={edicion.marcados}
                            soloLectura={!puedeActualizar}
                            onAlternar={edicion.alternar}
                            onCambiarSoloPropio={edicion.cambiarSoloPropio}
                        />
                    )}
                </div>
            </Pantalla>

            <ConfirmDialog
                open={rolPendiente !== null}
                kind="alert"
                variant="error"
                title="¿Descartar los cambios sin guardar?"
                description="Se perderán los permisos que cambió en este rol."
                confirmLabel="Descartar"
                cancelLabel="Seguir editando"
                onConfirm={() => {
                    if (rolPendiente !== null) {
                        irARol(rolPendiente)
                    }
                    setRolPendiente(null)
                }}
                onClose={() => setRolPendiente(null)}
            />
        </>
    )
}
