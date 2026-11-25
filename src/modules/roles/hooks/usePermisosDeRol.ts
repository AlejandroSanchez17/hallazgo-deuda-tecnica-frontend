import { useEffect, useMemo, useState } from 'react'
import { useActualizarUsuarioActual } from '../../../hooks/auth/useActualizarUsuarioActual'
import { aErrorApi, avisarSiNoSeAviso, type ErrorApi } from '../../../services/api'
import { recargarUsuariosSimulables } from '../../../services/api/auth'
import { avisarExito, avisarInfo } from '../../../utils/alertas'
import { permisosApi, rolesApi } from '../api'
import {
    agruparPorRecurso,
    ajustarAlcances,
    alternarPermiso,
    aMapa,
    aPermisosAsignados,
    asignarAlcanceDeFila,
    contarCambios,
    recursosConPropio,
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

// Todos los permisos y los de un rol; los cambios quedan en pantalla hasta guardar (PUT con la lista completa)
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
    const permisos = useMemo(() => catalogo?.permisos ?? [], [catalogo])
    // Los PROPIO guardados que ya no son validos se abren en TODO; quedan como cambios sin guardar
    const inicial = useMemo(() => ajustarAlcances(permisos, original), [permisos, original])
    const marcados = edicion !== null && edicion.rolId === rolId ? edicion.marcados : inicial
    const conPropio = useMemo(() => recursosConPropio(permisos, marcados), [permisos, marcados])
    const grupos = useMemo(() => agruparPorRecurso(permisos), [permisos])

    const alternar = (grupo: GrupoRecurso, permisoId: number) => {
        if (rolId === undefined || rol === null) {
            return
        }
        const alternados = alternarPermiso(marcados, grupo, permisoId)
        const ajustados = ajustarAlcances(permisos, alternados)
        setEdicion({ rolId, marcados: ajustados })
        // Lo demas ya era valido: solo cambia algo al quitar el ultimo permiso de equipo
        if (contarCambios(alternados, ajustados) > 0) {
            avisarInfo('Las filas en Propio pasaron a Todo: el rol ya no tiene Participar ni Liderar en Equipos')
        }
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
                // El 422 nombra el permiso o la regla en el mensaje general (el del campo es solo un resumen);
                // en el 400 el detalle viene en el campo. Queda fijo en la pantalla
                const delCampo = errorApi.errores.find((e) => e.campo === 'permisos')?.mensaje
                setErrorGuardado(errorApi.estado === 400 ? (delCampo ?? errorApi.mensaje) : errorApi.mensaje)
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
        conPropio,
        cargando: catalogo === null || (rolId !== undefined && delRol === null),
        error: catalogo?.error ?? delRol?.error ?? null,
        cambios: contarCambios(original, marcados),
        // Los que hizo el usuario, sin contar los ajustes al abrir el rol
        cambiosDelUsuario: contarCambios(inicial, marcados),
        ajustes: contarCambios(original, inicial),
        guardando,
        errorGuardado,
        cerrarError: () => setErrorGuardado(null),
        alternar,
        cambiarSoloPropio,
        descartar,
        guardar,
    }
}
