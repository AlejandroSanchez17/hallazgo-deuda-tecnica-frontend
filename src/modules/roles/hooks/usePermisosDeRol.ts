import { useEffect, useMemo, useState } from 'react'
import { useActualizarUsuarioActual } from '../../../hooks/auth/useActualizarUsuarioActual'
import { aErrorApi, avisarSiNoSeAviso, type ErrorApi } from '../../../services/api'
import { recargarUsuariosSimulables } from '../../../services/api/auth'
import { avisarExito } from '../../../utils/alertas'
import { permisosApi, rolesApi } from '../api'
import {
    admiteSoloPropio,
    agruparPorRecurso,
    alcanceHabitual,
    alternarPermiso,
    aMapa,
    aPermisosAsignados,
    asignarAlcanceDeFila,
    contarCambios,
    type GrupoRecurso,
    type MapaPermisos,
} from '../permisosRol'
import type { Permiso, RolDetalle } from '../types'

interface CatalogoPermisos {
    permisos: Permiso[]
    error: ErrorApi | null
}

interface ResultadoRol {
    rolId: number
    rol: RolDetalle | null
    error: ErrorApi | null
}

interface EdicionPermisos {
    rolId: number
    marcados: MapaPermisos
}

// Los 39 permisos y los de un rol; los cambios quedan en pantalla hasta guardar (PUT con la lista completa)
export const usePermisosDeRol = (rolId: number | undefined) => {
    const [catalogo, setCatalogo] = useState<CatalogoPermisos | null>(null)
    const [resultado, setResultado] = useState<ResultadoRol | null>(null)
    const [edicion, setEdicion] = useState<EdicionPermisos | null>(null)
    const [guardando, setGuardando] = useState(false)
    const [errorGuardado, setErrorGuardado] = useState<string | null>(null)
    const actualizarUsuarioActual = useActualizarUsuarioActual()

    useEffect(() => {
        let vigente = true
        permisosApi
            .listar()
            .then((permisos) => vigente && setCatalogo({ permisos, error: null }))
            .catch((error: unknown) => vigente && setCatalogo({ permisos: [], error: aErrorApi(error) }))
        return () => {
            vigente = false
        }
    }, [])

    useEffect(() => {
        if (rolId === undefined) {
            return
        }
        let vigente = true
        rolesApi
            .obtener(rolId)
            .then((rol) => vigente && setResultado({ rolId, rol, error: null }))
            .catch((error: unknown) => vigente && setResultado({ rolId, rol: null, error: aErrorApi(error) }))
        return () => {
            vigente = false
        }
    }, [rolId])

    const delRol = resultado?.rolId === rolId ? resultado : null
    const rol = delRol?.rol ?? null
    const original = useMemo(() => aMapa(rol?.permisos ?? []), [rol])
    const marcados = edicion !== null && edicion.rolId === rolId ? edicion.marcados : original
    const permisos = useMemo(() => catalogo?.permisos ?? [], [catalogo])
    const grupos = useMemo(() => agruparPorRecurso(permisos), [permisos])

    const alternar = (grupo: GrupoRecurso, permisoId: number) => {
        if (rolId === undefined || rol === null) {
            return
        }
        const habitual = alcanceHabitual(grupo.recurso, admiteSoloPropio(rol.codigo))
        setEdicion({ rolId, marcados: alternarPermiso(marcados, grupo, permisoId, habitual) })
    }

    const cambiarSoloPropio = (grupo: GrupoRecurso, soloPropio: boolean) => {
        if (rolId !== undefined) {
            setEdicion({ rolId, marcados: asignarAlcanceDeFila(marcados, grupo, soloPropio ? 'PROPIO' : 'TODO') })
        }
    }

    const descartar = () => {
        setEdicion(null)
        setErrorGuardado(null)
    }

    const guardar = async () => {
        if (rolId === undefined) {
            return
        }
        setGuardando(true)
        setErrorGuardado(null)
        try {
            const actualizado = await rolesApi.guardarPermisos(rolId, { permisos: aPermisosAsignados(marcados) })
            setResultado({ rolId, rol: actualizado, error: null })
            setEdicion(null)
            void avisarExito('Permisos actualizados')
            await actualizarUsuarioActual()
            void recargarUsuariosSimulables()
        } catch (error) {
            const errorApi = aErrorApi(error)
            if (errorApi.estado === 400 || errorApi.estado === 422) {
                // El mensaje nombra el permiso o la regla, asi que queda fijo en la pantalla
                setErrorGuardado(errorApi.errores.find((e) => e.campo === 'permisos')?.mensaje ?? errorApi.mensaje)
            } else {
                avisarSiNoSeAviso(errorApi)
            }
        } finally {
            setGuardando(false)
        }
    }

    return {
        rol,
        grupos,
        totalPermisos: permisos.length,
        marcados,
        cargando: catalogo === null || (rolId !== undefined && delRol === null),
        error: catalogo?.error ?? delRol?.error ?? null,
        cambios: contarCambios(original, marcados),
        guardando,
        errorGuardado,
        cerrarError: () => setErrorGuardado(null),
        conSoloPropio: rol !== null && admiteSoloPropio(rol.codigo),
        alternar,
        cambiarSoloPropio,
        descartar,
        guardar,
    }
}
