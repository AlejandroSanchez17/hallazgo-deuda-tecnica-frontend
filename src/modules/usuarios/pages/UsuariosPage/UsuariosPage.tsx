import { spacing } from '@hnba/design-tokens'
import { Alert, Button, type TableColumn } from '@hnba/react-ui'
import { useState } from 'react'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { recargarUsuariosSimulables } from '../../../../services/api/auth'
import { columna } from '../../../../styles/disposicion'
import { formatearFechaHora } from '../../../../utils/formato'
import { coincide, nombreRoles, normalizar } from '../../../../utils/texto'
import { usuariosApi } from '../../api'
import { accionesEditar, columnaEstado, columnasActivar } from '../../columnas'
import { BarraUsuarios } from '../../components/BarraUsuarios/BarraUsuarios'
import { UsuarioForm } from '../../components/UsuarioForm/UsuarioForm'
import { useCambiarEstado } from '../../hooks/useCambiarEstado'
import { useLista } from '../../hooks/useLista'
import { usePermisosUsuarios } from '../../hooks/usePermisosUsuarios'
import { TEXTOS } from '../../textos'
import type { Edicion, FiltroEstado, UsuarioResponse } from '../../types'
import { TextoCorto } from '../../../../components/common/TextoCorto/TextoCorto'

export const UsuariosPage = () => {
    const [filtro, setFiltro] = useState<FiltroEstado>('activos')
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<Edicion<UsuarioResponse>>(undefined)
    const { registros, cargando, error, recargar } = useLista(usuariosApi.listar, filtro)
    // El selector de usuario simulado tiene su propia lista: se actualiza con cada cambio
    const alCambiar = () => {
        recargar()
        void recargarUsuariosSimulables()
    }
    const { cambiarEstado, dialogo } = useCambiarEstado(usuariosApi.cambiarEstado, TEXTOS.usuario, alCambiar)
    const { puedeCrear, puedeActualizar, puedeDesactivar } = usePermisosUsuarios()

    const termino = normalizar(busqueda)
    const filas = registros.filter((usuario) =>
        coincide(termino, usuario.nombre, usuario.correo, usuario.usuarioRed, nombreRoles(usuario.roles)),
    )

    const columnas: TableColumn<UsuarioResponse>[] = [
        { id: 'nombre', header: 'Nombre', render: (usuario) => <TextoCorto texto={usuario.nombre} ancho={220} /> },
        { id: 'correo', header: 'Correo', render: (usuario) => <TextoCorto texto={usuario.correo} ancho={260} /> },
        {
            id: 'usuarioRed',
            header: 'Usuario de red',
            render: (usuario) => <TextoCorto texto={usuario.usuarioRed} ancho={180} />,
        },
        {
            id: 'roles',
            header: 'Roles',
            render: (usuario) => <TextoCorto texto={nombreRoles(usuario.roles)} ancho={220} />,
        },
        { id: 'ultimoAcceso', header: 'Último acceso', render: (usuario) => formatearFechaHora(usuario.ultimoAcceso) },
        columnaEstado<UsuarioResponse>(TEXTOS.usuario),
        ...columnasActivar<UsuarioResponse>(TEXTOS.usuario, puedeDesactivar ? cambiarEstado : undefined),
    ]
    const acciones = accionesEditar<UsuarioResponse>(puedeActualizar ? setEdicion : undefined)

    const alGuardar = () => {
        setEdicion(undefined)
        alCambiar()
    }

    return (
        <>
            <Pantalla titulo="Usuarios" descripcion="Quién puede entrar al sistema y con qué roles.">
                <div style={columna(spacing.md)}>
                    <BarraUsuarios
                        busqueda={busqueda}
                        onBuscar={setBusqueda}
                        filtro={filtro}
                        onFiltrar={setFiltro}
                        accion={
                            puedeCrear ? (
                                <Button variant="primary" iconName="plus" onClick={() => setEdicion(null)}>
                                    Nuevo usuario
                                </Button>
                            ) : undefined
                        }
                    />

                    {error ? (
                        <Alert variant="error" description={error.mensaje} />
                    ) : (
                        <TablaPaginada
                            columnas={columnas}
                            acciones={acciones}
                            filas={filas}
                            claveFila={(usuario) => usuario.id}
                            etiquetaFila={(usuario) => usuario.nombre}
                            claveReinicio={`${filtro}|${termino}`}
                            cargando={cargando}
                            textoVacio={
                                termino === ''
                                    ? 'No hay usuarios con este filtro'
                                    : 'Ningún usuario coincide con la búsqueda'
                            }
                        />
                    )}
                </div>
            </Pantalla>

            {edicion !== undefined && (
                <UsuarioForm usuario={edicion} onCerrar={() => setEdicion(undefined)} onGuardado={alGuardar} />
            )}
            {dialogo}
        </>
    )
}
