import { api } from '../../services/api'
import type { ApiResponse } from '../../types/api.types'
import { nombreDeDescarga } from '../../utils/descarga'
import type { ParametroTalla } from './types'
import type { DestinoEvidencia, EnvioEvidencia, EvidenciaResponse, LimitesEvidencia } from './typesEvidencia'

// Subir 25 MB o bajar el paquete tarda mas que el limite general de 15 s
const TIEMPO_ARCHIVOS = 5 * 60 * 1000

// Los de la base al 18/11, por si no se pueden leer los parametros; manda la validacion del backend
const LIMITES_POR_DEFECTO: LimitesEvidencia = {
    extensiones: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'],
    maximoMb: 25,
}

const RUTA_DESTINO: Record<DestinoEvidencia, string> = {
    ELEMENTO: '/elementos',
    PLAN: '/planes',
    TAREA: '/tareas',
}

// El backend distingue archivo y enlace por el Content-Type: con FormData axios pone multipart y su separador
const cuerpo = (envio: EnvioEvidencia) => {
    if (envio.tipo === 'ENLACE') {
        return { url: envio.url, nombre: envio.nombre, descripcion: envio.descripcion }
    }
    const formulario = new FormData()
    formulario.append('archivo', envio.archivo)
    formulario.append('descripcion', envio.descripcion)
    return formulario
}

export interface Descarga {
    contenido: Blob
    nombre: string
}

const descargar = async (ruta: string, respaldo: string): Promise<Descarga> => {
    const respuesta = await api.get<Blob>(ruta, { responseType: 'blob', timeout: TIEMPO_ARCHIVOS })
    const encabezado = respuesta.headers['content-disposition'] as string | undefined
    return { contenido: respuesta.data, nombre: nombreDeDescarga(encabezado, respaldo) }
}

// Las que guardan devuelven el mensaje del backend ("Evidencia registrada", "Evidencia 12 reemplazada por la 15")
export const evidenciasApi = {
    listar: async (elementoId: number, tareaId?: number): Promise<EvidenciaResponse[]> => {
        const { data } = await api.get<ApiResponse<EvidenciaResponse[]>>(`/elementos/${elementoId}/evidencias`, {
            params: tareaId === undefined ? undefined : { tareaId },
        })
        return data.datos
    },
    subir: async (destino: DestinoEvidencia, id: number, envio: EnvioEvidencia): Promise<string> => {
        const { data } = await api.post<ApiResponse<EvidenciaResponse>>(
            `${RUTA_DESTINO[destino]}/${id}/evidencias`,
            cuerpo(envio),
            { timeout: TIEMPO_ARCHIVOS },
        )
        return data.mensaje
    },
    reemplazar: async (evidenciaId: number, envio: EnvioEvidencia): Promise<string> => {
        const { data } = await api.post<ApiResponse<EvidenciaResponse>>(
            `/evidencias/${evidenciaId}/reemplazo`,
            cuerpo(envio),
            { timeout: TIEMPO_ARCHIVOS },
        )
        return data.mensaje
    },
    // Un enlace no se descarga (422 en tipo): se abre su url
    descargar: (evidencia: EvidenciaResponse) => descargar(`/evidencias/${evidencia.id}/descarga`, evidencia.nombre),
    // ZIP con las vigentes y su indice.csv; sin vigentes, 422
    paquete: (elementoId: number, codigo: string) =>
        descargar(`/elementos/${elementoId}/evidencias/paquete`, `evidencias-${codigo}.zip`),
    limites: async (): Promise<LimitesEvidencia> => {
        try {
            const { data } = await api.get<ApiResponse<ParametroTalla[]>>('/parametros')
            const valor = (clave: string) => data.datos.find((parametro) => parametro.clave === clave)?.valor
            const extensiones = (valor('tipos_archivo_permitidos') ?? '')
                .split(',')
                .map((extension) => extension.trim().toLowerCase().replace(/^\./, ''))
                .filter((extension) => extension !== '')
            const maximoMb = Number(valor('tamano_max_evidencia_mb'))
            return {
                extensiones: extensiones.length > 0 ? extensiones : LIMITES_POR_DEFECTO.extensiones,
                maximoMb: maximoMb > 0 ? maximoMb : LIMITES_POR_DEFECTO.maximoMb,
            }
        } catch {
            return LIMITES_POR_DEFECTO
        }
    },
}
