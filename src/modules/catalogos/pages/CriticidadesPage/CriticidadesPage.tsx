import { useState } from 'react'
import { MensajeError } from '../../../../components/ui/MensajeError/MensajeError'
import { Tabla, type ColumnaTabla } from '../../../../components/ui/Tabla/Tabla'
import { criticidadesApi } from '../../api'
import { columnaAcciones } from '../../columnas'
import { CriticidadForm } from '../../components/CriticidadForm/CriticidadForm'
import { useListaCatalogo } from '../../hooks/useListaCatalogo'
import { usePermisosCatalogo } from '../../hooks/usePermisosCatalogo'
import type { CriticidadResponse, RolResumen } from '../../types'

// Hasta que exista el endpoint de roles (BE-06) se ofrecen los roles que ya usan las criticidades
const rolesUsados = (criticidades: CriticidadResponse[]): RolResumen[] => {
    const porId = new Map<number, RolResumen>()
    criticidades.forEach((criticidad) => {
        porId.set(criticidad.rolApruebaPlan.id, criticidad.rolApruebaPlan)
        porId.set(criticidad.rolValidaCierre.id, criticidad.rolValidaCierre)
    })
    return [...porId.values()]
}

export const CriticidadesPage = () => {
    const [edicion, setEdicion] = useState<CriticidadResponse | null>(null)
    const { registros, cargando, error, recargar } = useListaCatalogo(criticidadesApi.listar, 'todos')
    const { puedeActualizar } = usePermisosCatalogo()
    const criticidades = [...registros].sort((a, b) => a.nivel - b.nivel)

    const columnas: ColumnaTabla<CriticidadResponse>[] = [
        { clave: 'nivel', titulo: 'Nivel', alineacion: 'centro' },
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'plazoMeses', titulo: 'Plazo (meses)', alineacion: 'centro' },
        { clave: 'maxProrrogas', titulo: 'Prórrogas máximas', alineacion: 'centro' },
        {
            clave: 'rolApruebaPlan',
            titulo: 'Aprueba el plan',
            render: (criticidad) => criticidad.rolApruebaPlan.nombre,
        },
        {
            clave: 'rolValidaCierre',
            titulo: 'Valida el cierre',
            render: (criticidad) => criticidad.rolValidaCierre.nombre,
        },
    ]
    const acciones = columnaAcciones<CriticidadResponse>({ onEditar: puedeActualizar ? setEdicion : undefined })
    if (acciones) {
        columnas.push(acciones)
    }

    const alGuardar = () => {
        setEdicion(null)
        recargar()
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-texto-secundario">
                El plazo define la fecha compromiso sugerida de cada hallazgo o deuda. Las criticidades no se crean ni
                se desactivan.
            </p>

            {error ? (
                <MensajeError mensaje={error.mensaje} />
            ) : (
                <Tabla
                    columnas={columnas}
                    filas={criticidades}
                    claveFila={(criticidad) => criticidad.id}
                    cargando={cargando}
                />
            )}

            {edicion && (
                <CriticidadForm
                    criticidad={edicion}
                    roles={rolesUsados(registros)}
                    onCerrar={() => setEdicion(null)}
                    onGuardado={alGuardar}
                />
            )}
        </div>
    )
}
