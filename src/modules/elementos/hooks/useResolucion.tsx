import { ConfirmDialog } from '@hnba/react-ui'
import { useState } from 'react'
import { aErrorApi, avisarSiNoSeAviso } from '../../../services/api'
import { avisarExito } from '../../../utils/alertas'
import { formatearFecha } from '../../../utils/formato'
import { cierresApi, prorrogasApi } from '../apiProrrogas'
import { MotivoForm } from '../components/MotivoForm/MotivoForm'

// Lo que se aprueba o rechaza: una prorroga (por su id) o el cierre de un elemento (por el id del elemento)
export type Resoluble =
    | { tipo: 'PRORROGA'; prorrogaId: number; codigo: string; fechaPropuesta: string }
    | { tipo: 'CIERRE'; elementoId: number; codigo: string }

type Paso = { accion: 'aprobar' | 'rechazar'; objetivo: Resoluble }

const TEXTOS = {
    PRORROGA: {
        aprobar: '¿Aprobar la prórroga?',
        rechazar: 'Rechazar la prórroga',
        alAprobar: (objetivo: Resoluble) =>
            `La fecha compromiso de ${objetivo.codigo} pasa al ${
                objetivo.tipo === 'PRORROGA' ? formatearFecha(objetivo.fechaPropuesta) : ''
            }. El plan no se ajusta solo: para usar el tiempo extra, el líder crea una versión nueva.`,
        alRechazar: (codigo: string) => `La fecha compromiso de ${codigo} no cambia.`,
    },
    CIERRE: {
        aprobar: '¿Aprobar el cierre?',
        rechazar: 'Rechazar el cierre',
        alAprobar: (objetivo: Resoluble) =>
            `${objetivo.codigo} queda Cerrado y su plan, Finalizado. Un elemento cerrado no se puede reabrir.`,
        alRechazar: (codigo: string) =>
            `${codigo} vuelve a En ejecución y el líder puede pedir el cierre de nuevo cuando lo corrija.`,
    },
}

const aprobarEnApi = (objetivo: Resoluble) =>
    objetivo.tipo === 'PRORROGA'
        ? prorrogasApi.resolver(objetivo.prorrogaId, 'APROBADA')
        : cierresApi.validar(objetivo.elementoId, 'APROBADO')

const rechazarEnApi = (objetivo: Resoluble, comentario: string) =>
    objetivo.tipo === 'PRORROGA'
        ? prorrogasApi.resolver(objetivo.prorrogaId, 'RECHAZADA', comentario)
        : cierresApi.validar(objetivo.elementoId, 'RECHAZADO', comentario)

// Aprobar pide confirmacion; rechazar pide el comentario (obligatorio). Lo usan el detalle y la bandeja.
// La pantalla debe dibujar `ventanas`. Al aprobar se llama a onHecho tambien si falla: el estado pudo cambiar
export const useResolucion = (onHecho: () => void) => {
    const [paso, setPaso] = useState<Paso | null>(null)
    const [enviando, setEnviando] = useState(false)

    const aprobar = async (objetivo: Resoluble) => {
        setEnviando(true)
        try {
            void avisarExito(await aprobarEnApi(objetivo))
        } catch (error) {
            avisarSiNoSeAviso(aErrorApi(error))
        } finally {
            setEnviando(false)
            setPaso(null)
            onHecho()
        }
    }

    const aprobando = paso?.accion === 'aprobar' ? paso.objetivo : null
    const rechazando = paso?.accion === 'rechazar' ? paso.objetivo : null

    const ventanas = (
        <>
            <ConfirmDialog
                open={aprobando !== null}
                kind="alert"
                variant="success"
                title={aprobando ? TEXTOS[aprobando.tipo].aprobar : ''}
                description={aprobando ? TEXTOS[aprobando.tipo].alAprobar(aprobando) : ''}
                confirmLabel="Aprobar"
                cancelLabel="Cancelar"
                confirmLoading={enviando}
                onConfirm={() => aprobando && void aprobar(aprobando)}
                onClose={() => setPaso(null)}
            />
            {rechazando && (
                <MotivoForm
                    titulo={TEXTOS[rechazando.tipo].rechazar}
                    etiqueta="Comentario"
                    boton="Rechazar"
                    campo="comentario"
                    aviso={{ variante: 'warning', texto: TEXTOS[rechazando.tipo].alRechazar(rechazando.codigo) }}
                    enviar={(comentario) => rechazarEnApi(rechazando, comentario)}
                    onCerrar={() => setPaso(null)}
                    onHecho={() => {
                        setPaso(null)
                        onHecho()
                    }}
                />
            )}
        </>
    )

    return {
        pedirAprobacion: (objetivo: Resoluble) => setPaso({ accion: 'aprobar', objetivo }),
        pedirRechazo: (objetivo: Resoluble) => setPaso({ accion: 'rechazar', objetivo }),
        ventanas,
    }
}
