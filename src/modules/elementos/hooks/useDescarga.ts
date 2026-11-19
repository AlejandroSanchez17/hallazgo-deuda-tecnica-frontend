import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { abrirEnOtraPestana, guardarArchivo } from '../../../utils/descarga'
import { evidenciasApi, type Descarga } from '../apiEvidencias'
import type { EvidenciaResponse } from '../typesEvidencia'

// Descarga de un archivo o del paquete ZIP; los enlaces se abren en otra pestana. Los errores (404 de un archivo que
// no esta en el almacenamiento, 422 del paquete sin vigentes) muestran el mensaje del backend
export const useDescarga = () => {
    const [descargando, setDescargando] = useState(false)

    const bajar = async (pedir: () => Promise<Descarga>) => {
        setDescargando(true)
        try {
            const { contenido, nombre } = await pedir()
            guardarArchivo(contenido, nombre)
        } catch (error) {
            avisarSiNoSeAviso(aErrorApi(error))
        } finally {
            setDescargando(false)
        }
    }

    return {
        descargando,
        obtener: (evidencia: EvidenciaResponse) => {
            if (evidencia.tipo === 'ENLACE') {
                if (evidencia.url) {
                    abrirEnOtraPestana(evidencia.url)
                }
                return
            }
            void bajar(() => evidenciasApi.descargar(evidencia))
        },
        paquete: (elementoId: number, codigo: string) => void bajar(() => evidenciasApi.paquete(elementoId, codigo)),
    }
}
