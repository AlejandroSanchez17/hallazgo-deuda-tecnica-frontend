import { Modal, Select, Text } from '@hnba/react-ui'
import { useCambioUsuario } from '../../../hooks/auth/useCambioUsuario'
import { columna } from '../../../styles/disposicion'
import type { UsuarioSimulable } from '../../../types/usuario.types'
import { nombreRoles } from '../../../utils/texto'
import { Sidebar } from '../Sidebar/Sidebar'

interface MenuMovilProps {
    abierto: boolean
    onCerrar: () => void
}

const etiquetaUsuario = (usuario: UsuarioSimulable) => `${usuario.nombre} · ${nombreRoles(usuario.roles)}`

// Modo compacto: el NavBar oculta la identidad del usuario y el Sidebar no cabe en linea,
// asi que ambos se ofrecen en este panel
export const MenuMovil = ({ abierto, onCerrar }: MenuMovilProps) => {
    const { usuarios, cargando, usuarioActual, cambiarUsuario } = useCambioUsuario()

    return (
        <Modal open={abierto} onClose={onCerrar} title="Menú" position="right" size="sm">
            <div style={columna(24)}>
                <Sidebar alNavegar={onCerrar} />

                <div style={columna(8)}>
                    <Text variant="label-semibold-medium" as="p">
                        Usuario simulado
                    </Text>
                    <Select
                        options={usuarios}
                        value={usuarioActual ?? null}
                        getValue={(usuario) => String(usuario.id)}
                        getLabel={etiquetaUsuario}
                        placeholder={cargando ? 'Cargando usuarios…' : 'Seleccione un usuario'}
                        disabled={cargando}
                        onChange={(usuario) => {
                            cambiarUsuario(usuario.id)
                            onCerrar()
                        }}
                    />
                </div>
            </div>
        </Modal>
    )
}
