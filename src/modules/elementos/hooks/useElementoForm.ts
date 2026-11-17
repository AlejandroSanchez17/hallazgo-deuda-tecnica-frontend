import { useFormulario } from '../../../hooks/useFormulario'
import type { Opcion } from '../../../utils/opciones'
import { elementosApi } from '../api'
import { sumarMeses } from '../fechas'
import { aSolicitudActualizar, aSolicitudCrear, faltaEsfuerzo, formularioInicial, validar } from '../solicitud'
import type { ElementoDetalleResponse } from '../types'
import { useCombos } from './useCombos'
import { useConfirmarFechas } from './useConfirmarFechas'
import { useGuardar } from './useGuardar'
import { usePermisosElementos } from './usePermisosElementos'

interface Registro {
    id: number
    nombre: string
}

const aOpcion = ({ id, nombre }: Registro): Opcion => ({ valor: String(id), texto: nombre })

// Al editar, un registro que ya no esta activo no llega en el combo: se agrega para no perderlo
const conActuales = (opciones: Opcion[], actuales: Registro[], sufijo: string) => [
    ...opciones,
    ...actuales
        .filter((actual) => !opciones.some((opcion) => opcion.valor === String(actual.id)))
        .map((actual) => ({ valor: String(actual.id), texto: `${actual.nombre} (${sufijo})` })),
]

// ficha en null: elemento nuevo
export const useElementoForm = (ficha: ElementoDetalleResponse | null, onGuardado: () => void) => {
    const esNuevo = ficha === null
    const { formulario, cambiar, asignar } = useFormulario(formularioInicial(ficha))
    const combos = useCombos(esNuevo)
    const { veRestringidas } = usePermisosElementos()
    const { guardar, errores, guardando } = useGuardar(onGuardado)
    const { confirmar, dialogo } = useConfirmarFechas()

    const criticidad = combos.criticidades.find((opcion) => String(opcion.id) === formulario.criticidadId)
    const fechaSugerida = ficha
        ? ficha.fechaCompromisoSugerida
        : criticidad && formulario.fechaIdentificacion !== ''
          ? sumarMeses(formulario.fechaIdentificacion, criticidad.plazoMeses)
          : ''
    // Mientras el usuario no la cambie, la fecha compromiso es la sugerida
    const fechaCompromiso = formulario.fechaCompromiso || fechaSugerida
    const cambioFecha = esNuevo && formulario.fechaCompromiso !== '' && formulario.fechaCompromiso !== fechaSugerida

    const opciones = {
        origenes: conActuales(
            combos.origenes.map(aOpcion),
            ficha ? [{ id: ficha.origenId, nombre: ficha.origenNombre }] : [],
            'inactivo',
        ),
        criticidades: ficha
            ? [{ valor: String(ficha.criticidadId), texto: ficha.criticidadNombre }]
            : [...combos.criticidades]
                  .sort((a, b) => a.nivel - b.nivel)
                  .map((opcion) => ({
                      valor: String(opcion.id),
                      texto: `${opcion.nombre} (${opcion.plazoMeses} meses)`,
                  })),
        // Un equipo sin lider da 422: no se ofrece
        equipos: ficha
            ? [{ valor: String(ficha.equipoId), texto: ficha.equipoNombre }]
            : combos.equipos.filter((equipo) => equipo.liderId !== null).map(aOpcion),
        categorias: conActuales(
            combos.categorias.filter((categoria) => veRestringidas || !categoria.restringida).map(aOpcion),
            ficha?.deuda ? [{ id: ficha.deuda.categoriaDeudaId ?? 0, nombre: ficha.deuda.categoriaDeudaNombre }] : [],
            'inactiva',
        ),
        aplicaciones: conActuales(combos.aplicaciones.map(aOpcion), ficha?.aplicaciones ?? [], 'inactiva'),
    }

    const enviarAhora = () =>
        void guardar(
            () =>
                ficha
                    ? elementosApi.actualizar(ficha.id, aSolicitudActualizar(formulario))
                    : elementosApi.crear(aSolicitudCrear(formulario, fechaSugerida)),
            validar(formulario),
            faltaEsfuerzo(formulario),
        )

    // Al registrar se confirman las fechas, que despues no se editan. Sin fechas completas se envia directo,
    // para que el backend marque lo que falta
    const enviar = () => {
        if (!esNuevo || formulario.fechaIdentificacion === '' || fechaCompromiso === '') {
            enviarAhora()
            return
        }
        confirmar(
            { identificacion: formulario.fechaIdentificacion, compromiso: fechaCompromiso, cambiada: cambioFecha },
            enviarAhora,
        )
    }

    return {
        esNuevo,
        formulario,
        cambiar,
        asignar,
        opciones,
        fechaSugerida,
        fechaCompromiso,
        cambioFecha,
        errores,
        guardando,
        enviar,
        dialogo,
    }
}
