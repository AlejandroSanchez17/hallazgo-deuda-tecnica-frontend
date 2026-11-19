import { useEffect, useState } from 'react'
import { useFormulario } from '../../../hooks/useFormulario'
import type { ErroresCampo } from '../../../utils/erroresCampo'
import { evidenciasApi } from '../apiEvidencias'
import { claveDestino } from '../textosEvidencia'
import type {
    EnvioEvidencia,
    EvidenciaFormulario,
    LimitesEvidencia,
    ObjetivoSubida,
    TipoEvidencia,
} from '../typesEvidencia'
import { useGuardar } from './useGuardar'

const erroresDe = (formulario: EvidenciaFormulario, archivo: File | null, conDestino: boolean): ErroresCampo => {
    const errores: ErroresCampo = {}
    if (conDestino && formulario.destino === '') {
        errores.destino = 'Elija dónde se sube'
    }
    if (formulario.tipo === 'ARCHIVO' && archivo === null) {
        errores.archivo = 'Elija un archivo'
    }
    return errores
}

// Subir una evidencia nueva o reemplazar una vigente, como archivo o como enlace. El selector de archivo de la
// libreria ya rechaza la extension y el tamano segun los parametros; manda la validacion del backend (contenido real)
export const useEvidenciaForm = (objetivo: ObjetivoSubida, onGuardado: () => void) => {
    const destinos = objetivo.tipo === 'nueva' ? objetivo.destinos : []
    const { formulario, asignar, cambiar } = useFormulario<EvidenciaFormulario>({
        tipo: 'ARCHIVO',
        destino: destinos.length === 1 ? claveDestino(destinos[0]) : '',
        url: '',
        nombre: '',
        descripcion: '',
    })
    const [archivo, setArchivo] = useState<File | null>(null)
    const [limites, setLimites] = useState<LimitesEvidencia | null>(null)
    const { guardar, errores, guardando } = useGuardar(onGuardado)

    useEffect(() => {
        let vigente = true
        void evidenciasApi.limites().then((leidos) => vigente && setLimites(leidos))
        return () => {
            vigente = false
        }
    }, [])

    const envio = (): EnvioEvidencia =>
        formulario.tipo === 'ARCHIVO' && archivo
            ? { tipo: 'ARCHIVO', archivo, descripcion: formulario.descripcion.trim() }
            : {
                  tipo: 'ENLACE',
                  url: formulario.url.trim(),
                  nombre: formulario.nombre.trim() === '' ? null : formulario.nombre.trim(),
                  descripcion: formulario.descripcion.trim(),
              }

    const enviar = () => {
        const destino = destinos.find((opcion) => claveDestino(opcion) === formulario.destino)
        void guardar(
            () =>
                objetivo.tipo === 'reemplazo'
                    ? evidenciasApi.reemplazar(objetivo.evidencia.id, envio())
                    : evidenciasApi.subir(destino?.destino ?? 'ELEMENTO', destino?.id ?? 0, envio()),
            erroresDe(formulario, archivo, objetivo.tipo === 'nueva'),
        )
    }

    return {
        formulario,
        cambiar,
        elegirTipo: (tipo: TipoEvidencia) => asignar('tipo', tipo),
        elegirDestino: (clave: string) => asignar('destino', clave),
        destinos,
        archivo,
        elegirArchivo: setArchivo,
        limites,
        errores,
        guardando,
        enviar,
    }
}
