import type { ParametroResponse } from './types'
import { CLAVE_ROL_VALIDA_CIERRE } from './valores'

// Valor actual de un parametro por su clave
export type LeerValor = (clave: string) => string

interface TextoParametro {
    clave: string
    nombre: string
    unidad: string
    explicacion: (valor: LeerValor) => string
}

const TALLAS = ['XS', 'S', 'M', 'L', 'XL']

const textoTalla = (talla: string): TextoParametro => {
    const clave = `talla_${talla.toLowerCase()}_horas`
    return {
        clave,
        nombre: `Horas de la talla ${talla}`,
        unidad: 'horas',
        explicacion: (valor) =>
            `Una deuda estimada en talla ${talla}, sin horas indicadas, cuenta como ${valor(clave)} horas en el total de deuda pendiente.`,
    }
}

// Nombres y explicaciones en lenguaje directo, en lugar de la descripcion tecnica de la base y la clave.
// Todos los parametros actuales (pedido del usuario, 17/11); uno nuevo sin texto aqui muestra su descripcion y su clave.
// El orden de esta lista es el de la tabla (las tallas de menor a mayor, no por orden alfabetico)
const TEXTOS: TextoParametro[] = [
    {
        clave: 'riesgo_avance_minimo',
        nombre: 'Avance mínimo cerca del vencimiento',
        unidad: '%',
        explicacion: (valor) =>
            `Si a un elemento le quedan ${valor('riesgo_dias_restantes')} días o menos y su avance es menor al ${valor('riesgo_avance_minimo')} %, sale En riesgo.`,
    },
    {
        clave: 'riesgo_dias_restantes',
        nombre: 'Días para revisar el avance',
        unidad: 'días',
        explicacion: (valor) =>
            `Desde que faltan ${valor('riesgo_dias_restantes')} días para el vencimiento se exige el avance mínimo (${valor('riesgo_avance_minimo')} %).`,
    },
    {
        clave: 'riesgo_puntos_desvio',
        nombre: 'Atraso permitido respecto al plan',
        unidad: 'puntos',
        explicacion: (valor) =>
            `Si, con el plan en ejecución, el avance va más de ${valor('riesgo_puntos_desvio')} puntos por debajo de lo esperado según el tiempo del plan, sale En riesgo.`,
    },
    {
        clave: 'dias_anticipacion_alerta',
        nombre: 'Aviso antes del vencimiento',
        unidad: 'días',
        explicacion: (valor) =>
            `Los responsables reciben una alerta ${valor('dias_anticipacion_alerta')} días antes de que venza una tarea o un plan.`,
    },
    {
        clave: 'resumen_semanal_dia',
        nombre: 'Día del resumen semanal',
        unidad: '',
        explicacion: (valor) =>
            `Cada ${valor('resumen_semanal_dia').toLowerCase()} los usuarios con el permiso de resumen semanal reciben el resumen de los elementos vencidos.`,
    },
    {
        clave: CLAVE_ROL_VALIDA_CIERRE,
        nombre: 'Rol que valida el cierre de hallazgos',
        unidad: '',
        explicacion: () =>
            'El cierre de un hallazgo lo valida este rol. Mientras lo tenga, no se puede desactivar ni borrar.',
    },
    {
        clave: 'correo_habilitado',
        nombre: 'Envío de correos',
        unidad: '',
        explicacion: (valor) =>
            `Enciende o apaga todos los correos del sistema; hoy están ${valor('correo_habilitado') === 'true' ? 'encendidos' : 'apagados'}.`,
    },
    {
        clave: 'correo_nombre_remitente',
        nombre: 'Nombre del remitente',
        unidad: '',
        explicacion: () => 'Es el nombre que ven quienes reciben los correos del sistema.',
    },
    {
        clave: 'correo_remitente',
        nombre: 'Correo del remitente',
        unidad: '',
        explicacion: () =>
            'Dirección desde la que salen los correos. Antes de producción hay que poner una del dominio verificado en Amazon SES.',
    },
    {
        clave: 'correo_lote_envio',
        nombre: 'Correos por envío',
        unidad: 'correos',
        explicacion: (valor) =>
            `En cada vuelta del proceso de envío salen hasta ${valor('correo_lote_envio')} correos, para no pasar el límite de Amazon SES.`,
    },
    {
        clave: 'correo_max_reintentos',
        nombre: 'Reintentos de un correo',
        unidad: 'reintentos',
        explicacion: (valor) =>
            `Si un correo falla, se reintenta hasta ${valor('correo_max_reintentos')} veces antes de darlo por fallido.`,
    },
    {
        clave: 'correo_reintento_minutos',
        nombre: 'Espera entre reintentos',
        unidad: 'minutos',
        explicacion: (valor) =>
            `Antes del primer reintento se esperan ${valor('correo_reintento_minutos')} minutos; la espera crece en cada intento.`,
    },
    {
        clave: 'ses_configuration_set',
        nombre: 'Configuración de Amazon SES',
        unidad: '',
        explicacion: () =>
            'Nombre de la configuración de SES que registra entregas, rebotes y quejas. Antes de producción hay que poner la del ambiente real.',
    },
    ...TALLAS.map(textoTalla),
    {
        clave: 'tamano_max_evidencia_mb',
        nombre: 'Tamaño máximo de una evidencia',
        unidad: 'MB',
        explicacion: (valor) =>
            `Un archivo de evidencia de más de ${valor('tamano_max_evidencia_mb')} MB no se acepta. Los enlaces no tienen tamaño.`,
    },
    {
        clave: 'tipos_archivo_permitidos',
        nombre: 'Tipos de archivo permitidos',
        // Es una lista: el valor se ve como etiquetas, sin unidad
        unidad: '',
        explicacion: () => 'Solo se aceptan como evidencia los archivos con estas extensiones.',
    },
    {
        clave: 'reporte_asincrono_umbral_seg',
        nombre: 'Reportes en segundo plano',
        unidad: 'segundos',
        explicacion: (valor) =>
            `Si un reporte tarda más de ${valor('reporte_asincrono_umbral_seg')} segundos, se genera en segundo plano para no dejar la pantalla esperando.`,
    },
]

export const textoDe = (clave: string) => TEXTOS.find((texto) => texto.clave === clave)

// Los que tienen texto propio van en el orden de TEXTOS; los demas quedan despues, como llegan del backend
export const ordenDe = (clave: string) => {
    const indice = TEXTOS.findIndex((texto) => texto.clave === clave)
    return indice === -1 ? TEXTOS.length : indice
}

export const lectorDe =
    (parametros: ParametroResponse[]): LeerValor =>
    (clave) =>
        parametros.find((parametro) => parametro.clave === clave)?.valor ?? '?'
