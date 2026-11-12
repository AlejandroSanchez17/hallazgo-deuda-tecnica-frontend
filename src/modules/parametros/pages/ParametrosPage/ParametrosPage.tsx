import { useState } from 'react'
import { BotonIcono } from '../../../../components/ui/BotonIcono/BotonIcono'
import { Buscador } from '../../../../components/ui/Buscador/Buscador'
import { Cargando } from '../../../../components/ui/Cargando/Cargando'
import { IconoEditar } from '../../../../components/ui/Iconos/IconoEditar'
import { MensajeError } from '../../../../components/ui/MensajeError/MensajeError'
import { Tabla, type ColumnaTabla } from '../../../../components/ui/Tabla/Tabla'
import { usePermiso } from '../../../../hooks/auth/usePermiso'
import { PERMISOS } from '../../../../utils/constants/permisos'
import { formatearFechaHora } from '../../../../utils/formato'
import { coincide, normalizar } from '../../../../utils/texto'
import { ParametroForm } from '../../components/ParametroForm/ParametroForm'
import { ValorParametro } from '../../components/ValorParametro/ValorParametro'
import { agruparParametros } from '../../grupos'
import { useParametros } from '../../hooks/useParametros'
import type { ParametroResponse } from '../../types'

export const ParametrosPage = () => {
    const [busqueda, setBusqueda] = useState('')
    const [edicion, setEdicion] = useState<ParametroResponse | null>(null)
    const { parametros, cargando, error, recargar } = useParametros()
    const puedeActualizar = usePermiso(PERMISOS.parametroActualizar)

    const termino = normalizar(busqueda)
    const grupos = agruparParametros(
        parametros.filter((parametro) => coincide(termino, parametro.clave, parametro.descripcion, parametro.valor)),
    )

    const columnas: ColumnaTabla<ParametroResponse>[] = [
        {
            clave: 'descripcion',
            titulo: 'Parámetro',
            render: (parametro) => (
                <div>
                    <p>{parametro.descripcion}</p>
                    <p className="mt-0.5 font-mono text-xs text-texto-secundario">{parametro.clave}</p>
                </div>
            ),
        },
        { clave: 'valor', titulo: 'Valor', render: (parametro) => <ValorParametro parametro={parametro} /> },
        {
            clave: 'fechaModificacion',
            titulo: 'Última modificación',
            render: (parametro) =>
                parametro.modificadoPorNombre ? (
                    <span className="text-texto-secundario">
                        {parametro.modificadoPorNombre} · {formatearFechaHora(parametro.fechaModificacion)}
                    </span>
                ) : (
                    '—'
                ),
        },
    ]
    if (puedeActualizar) {
        columnas.push({
            clave: 'acciones',
            titulo: 'Acciones',
            alineacion: 'centro',
            render: (parametro) => (
                <BotonIcono etiqueta="Editar" onClick={() => setEdicion(parametro)}>
                    <IconoEditar />
                </BotonIcono>
            ),
        })
    }

    const alGuardar = () => {
        setEdicion(null)
        recargar()
    }

    return (
        <section className="max-w-6xl space-y-6">
            <div>
                <h1 className="text-xl font-bold">Parámetros</h1>
                <p className="mt-1 text-sm text-texto-secundario">
                    Valores que ajustan el comportamiento del sistema sin cambiar el código.
                </p>
            </div>

            <div className="w-80">
                <Buscador
                    valor={busqueda}
                    onCambiar={setBusqueda}
                    etiqueta="Buscar parámetros"
                    placeholder="Buscar por descripción, clave o valor…"
                />
            </div>

            {cargando && <Cargando />}
            {error && <MensajeError mensaje={error.mensaje} />}
            {!cargando && !error && grupos.length === 0 && (
                <p className="text-sm text-texto-secundario">Ningún parámetro coincide con la búsqueda.</p>
            )}

            {grupos.map((grupo) => (
                <div key={grupo.titulo} className="space-y-2">
                    <h2 className="text-base font-semibold">{grupo.titulo}</h2>
                    <Tabla columnas={columnas} filas={grupo.parametros} claveFila={(parametro) => parametro.clave} />
                </div>
            ))}

            {edicion && <ParametroForm parametro={edicion} onCerrar={() => setEdicion(null)} onGuardado={alGuardar} />}
        </section>
    )
}
