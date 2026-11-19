import { useState } from 'react'
import { ProrrogaForm } from '../components/ProrrogaForm/ProrrogaForm'
import type { ElementoDetalleResponse } from '../types'
import type { CierreResponse, ProrrogaResponse } from '../typesProrroga'
import { usePedirCierre } from './usePedirCierre'
import { usePermisosProrrogaCierre } from './usePermisosProrrogaCierre'
import { useProrrogasCierres } from './useProrrogasCierres'
import { useResolucion } from './useResolucion'

// Todo lo de las pestanas Prorrogas y Cierre del detalle: datos, permisos, acciones y sus ventanas (la pantalla
// dibuja `ventanas`). onCambio recarga la ficha: aprobar una prorroga cambia la fecha vigente y el semaforo, y el
// cierre cambia el estado
export const useProrrogaCierre = (
    elementoId: number,
    ficha: ElementoDetalleResponse | null,
    liderDelEquipo: number | null | undefined,
    onCambio: () => void,
) => {
    const permisos = usePermisosProrrogaCierre(ficha, liderDelEquipo)
    const datos = useProrrogasCierres(elementoId, permisos.veProrrogas, permisos.veCierre)
    const [pidiendoProrroga, setPidiendoProrroga] = useState(false)

    const alCambiar = () => {
        datos.recargar()
        onCambio()
    }
    const resolucion = useResolucion(alCambiar)
    const cierre = usePedirCierre(ficha, alCambiar)
    const codigo = ficha?.codigo ?? ''

    const ventanas = (
        <>
            {pidiendoProrroga && datos.resumen && (
                <ProrrogaForm
                    elementoId={elementoId}
                    codigo={codigo}
                    resumen={datos.resumen}
                    onCerrar={() => setPidiendoProrroga(false)}
                    onPedida={() => {
                        setPidiendoProrroga(false)
                        alCambiar()
                    }}
                />
            )}
            {resolucion.ventanas}
            {cierre.dialogo}
        </>
    )

    return {
        ...datos,
        veProrrogas: permisos.veProrrogas,
        veCierre: permisos.veCierre,
        puedePedirProrroga: permisos.puedePedirProrroga(datos.resumen),
        puedeResolverProrroga: permisos.puedeResolverProrroga,
        puedePedirCierre: permisos.puedePedirCierre,
        puedeValidarCierre: permisos.puedeValidarCierre,
        problemasCierre: cierre.problemas,
        pedirProrroga: () => setPidiendoProrroga(true),
        pedirCierre: cierre.pedir,
        aprobarProrroga: (prorroga: ProrrogaResponse) =>
            resolucion.pedirAprobacion({
                tipo: 'PRORROGA',
                prorrogaId: prorroga.id,
                codigo,
                fechaPropuesta: prorroga.fechaPropuesta,
            }),
        rechazarProrroga: (prorroga: ProrrogaResponse) =>
            resolucion.pedirRechazo({
                tipo: 'PRORROGA',
                prorrogaId: prorroga.id,
                codigo,
                fechaPropuesta: prorroga.fechaPropuesta,
            }),
        aprobarCierre: (solicitud: CierreResponse) =>
            resolucion.pedirAprobacion({ tipo: 'CIERRE', elementoId: solicitud.elementoId, codigo }),
        rechazarCierre: (solicitud: CierreResponse) =>
            resolucion.pedirRechazo({ tipo: 'CIERRE', elementoId: solicitud.elementoId, codigo }),
        ventanas,
    }
}
