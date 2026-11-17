import type { ErroresCampo } from '../../utils/erroresCampo'
import { hoyApi } from './fechas'
import type {
    DatosDeuda,
    DatosHallazgo,
    ElementoActualizarRequest,
    ElementoCrearRequest,
    ElementoDetalleResponse,
    ElementoFormulario,
} from './types'

// Mismo nombre de campo que usa el backend en errores
const CAMPO_HORAS = 'deuda.esfuerzoHoras'
const CAMPO_TALLA = 'deuda.talla'

const aNumero = (valor: string) => (valor === '' ? null : Number(valor))

// Acepta coma o punto decimal; texto que no es numero da NaN (lo marca validar)
const aHoras = (valor: string) => (valor.trim() === '' ? null : Number(valor.trim().replace(',', '.')))

export const formularioInicial = (ficha: ElementoDetalleResponse | null): ElementoFormulario => ({
    tipo: ficha?.tipo ?? '',
    titulo: ficha?.titulo ?? '',
    descripcion: ficha?.descripcion ?? '',
    origenId: ficha ? String(ficha.origenId) : '',
    criticidadId: ficha ? String(ficha.criticidadId) : '',
    equipoId: ficha ? String(ficha.equipoId) : '',
    fechaIdentificacion: ficha?.fechaIdentificacion ?? hoyApi(),
    fechaCompromiso: ficha?.fechaCompromisoOriginal ?? '',
    justificacionFecha: ficha?.justificacionFecha ?? '',
    aplicacionIds: ficha?.aplicaciones.map((aplicacion) => String(aplicacion.id)) ?? [],
    referenciaInforme: ficha?.hallazgo?.referenciaInforme ?? '',
    enteEmisor: ficha?.hallazgo?.enteEmisor ?? '',
    recomendacion: ficha?.hallazgo?.recomendacion ?? '',
    riesgoAsociado: ficha?.hallazgo?.riesgoAsociado ?? '',
    categoriaDeudaId: ficha?.deuda ? String(ficha.deuda.categoriaDeudaId) : '',
    causa: ficha?.deuda?.causa ?? '',
    impactoTecnico: ficha?.deuda?.impactoTecnico ?? '',
    impactoNegocio: ficha?.deuda?.impactoNegocio ?? '',
    esfuerzoHoras: ficha?.deuda?.esfuerzoHoras?.toString() ?? '',
    talla: ficha?.deuda?.talla ?? '',
    componente: ficha?.deuda?.componente ?? '',
})

const hallazgoDe = (formulario: ElementoFormulario): DatosHallazgo => ({
    referenciaInforme: formulario.referenciaInforme.trim(),
    enteEmisor: formulario.enteEmisor.trim(),
    recomendacion: formulario.recomendacion.trim(),
    riesgoAsociado: formulario.riesgoAsociado.trim(),
})

const deudaDe = (formulario: ElementoFormulario): DatosDeuda => ({
    categoriaDeudaId: aNumero(formulario.categoriaDeudaId),
    causa: formulario.causa.trim(),
    impactoTecnico: formulario.impactoTecnico.trim(),
    impactoNegocio: formulario.impactoNegocio.trim(),
    esfuerzoHoras: aHoras(formulario.esfuerzoHoras),
    talla: formulario.talla === '' ? null : formulario.talla,
    componente: formulario.componente.trim(),
})

// Solo el bloque del tipo elegido; sin tipo no va ninguno (el backend responde 400 en tipo)
export const aSolicitudActualizar = (formulario: ElementoFormulario): ElementoActualizarRequest => ({
    titulo: formulario.titulo.trim(),
    descripcion: formulario.descripcion.trim(),
    origenId: aNumero(formulario.origenId),
    aplicacionIds: formulario.aplicacionIds.map(Number),
    hallazgo: formulario.tipo === 'HALLAZGO' ? hallazgoDe(formulario) : undefined,
    deuda: formulario.tipo === 'DEUDA' ? deudaDe(formulario) : undefined,
})

// fechaSugerida la calcula el formulario; si el usuario no cambio la fecha no se envia (el backend usa la sugerida)
export const aSolicitudCrear = (formulario: ElementoFormulario, fechaSugerida: string): ElementoCrearRequest => {
    const cambioFecha = formulario.fechaCompromiso !== '' && formulario.fechaCompromiso !== fechaSugerida
    return {
        ...aSolicitudActualizar(formulario),
        tipo: formulario.tipo === '' ? null : formulario.tipo,
        criticidadId: aNumero(formulario.criticidadId),
        equipoId: aNumero(formulario.equipoId),
        fechaIdentificacion: formulario.fechaIdentificacion === '' ? null : formulario.fechaIdentificacion,
        fechaCompromisoOriginal: cambioFecha ? formulario.fechaCompromiso : undefined,
        justificacionFecha: cambioFecha ? formulario.justificacionFecha.trim() : undefined,
    }
}

// Deuda sin horas ni talla: el backend lo rechaza (422), pero solo despues de que pasen los demas campos (400) y
// marcando solo las horas. Se marcan los dos campos junto con lo que responda el backend
export const faltaEsfuerzo = (formulario: ElementoFormulario): ErroresCampo =>
    formulario.tipo === 'DEUDA' && formulario.esfuerzoHoras.trim() === '' && formulario.talla === ''
        ? { [CAMPO_HORAS]: 'Indique las horas o la talla', [CAMPO_TALLA]: 'Indique la talla o las horas' }
        : {}

// Lo que no se puede enviar como JSON valido; lo demas lo valida el backend
export const validar = (formulario: ElementoFormulario): ErroresCampo => {
    const horas = aHoras(formulario.esfuerzoHoras)
    return formulario.tipo === 'DEUDA' && horas !== null && Number.isNaN(horas)
        ? { [CAMPO_HORAS]: 'Debe ser un número' }
        : {}
}
