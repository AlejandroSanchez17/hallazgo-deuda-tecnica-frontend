import { useSesionStore } from '../../store/sesionStore'

export const InicioPage = () => {
    const usuario = useSesionStore((estado) => estado.usuario)

    if (!usuario) {
        return null
    }

    return (
        <section className="max-w-2xl">
            <h1 className="text-xl font-bold">Bienvenido, {usuario.nombre}</h1>
            <p className="mt-1 text-sm text-texto-secundario">
                Use el menú de la izquierda para ir a las opciones de su rol.
            </p>

            <dl className="mt-6 grid grid-cols-[10rem_1fr] gap-y-2 rounded-md border border-borde bg-blanco p-6 text-sm">
                <dt className="text-texto-secundario">Usuario de red</dt>
                <dd>{usuario.usuarioRed}</dd>
                <dt className="text-texto-secundario">Correo</dt>
                <dd>{usuario.correo}</dd>
                <dt className="text-texto-secundario">Roles</dt>
                <dd>{usuario.roles.map((rol) => rol.nombre).join(', ')}</dd>
                <dt className="text-texto-secundario">Visibilidad</dt>
                <dd>{usuario.visibilidadGlobal ? 'Global' : 'Solo su equipo'}</dd>
                <dt className="text-texto-secundario">Permisos</dt>
                <dd>{usuario.permisos.length}</dd>
            </dl>
        </section>
    )
}
