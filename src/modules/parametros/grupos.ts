import type { GrupoParametros, ParametroResponse } from './types'

const GRUPOS = [
    { titulo: 'Semáforo de riesgo', prefijos: ['riesgo_'] },
    { titulo: 'Notificaciones', prefijos: ['dias_anticipacion_alerta', 'resumen_semanal_dia'] },
    { titulo: 'Correo', prefijos: ['correo_', 'ses_'] },
    { titulo: 'Esfuerzo por talla', prefijos: ['talla_'] },
    { titulo: 'Evidencias', prefijos: ['tamano_max_evidencia', 'tipos_archivo'] },
    { titulo: 'Reportes', prefijos: ['reporte_'] },
]

// Un parametro nuevo que no encaje en ningun grupo sale en "Otros" para no perderlo
export const agruparParametros = (parametros: ParametroResponse[]): GrupoParametros[] => {
    const usados = new Set<string>()
    const grupos = GRUPOS.map((grupo) => {
        const delGrupo = parametros.filter(
            (parametro) =>
                !usados.has(parametro.clave) && grupo.prefijos.some((prefijo) => parametro.clave.startsWith(prefijo)),
        )
        delGrupo.forEach((parametro) => usados.add(parametro.clave))
        return { titulo: grupo.titulo, parametros: delGrupo }
    })
    grupos.push({ titulo: 'Otros', parametros: parametros.filter((parametro) => !usados.has(parametro.clave)) })
    return grupos.filter((grupo) => grupo.parametros.length > 0)
}
