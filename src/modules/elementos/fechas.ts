import { aFechaApi } from '../../utils/formato'

const dosDigitos = (numero: number) => String(numero).padStart(2, '0')

// El dia 0 del mes siguiente es el ultimo del mes pedido (mes de 1 a 12)
const ultimoDiaDelMes = (anio: number, mes: number) => new Date(Date.UTC(anio, mes, 0)).getUTCDate()

// 'AAAA-MM-DD' + meses; si el dia no existe en el mes destino, el ultimo dia de ese mes (31/01 + 1 = 28/02).
// Es el mismo calculo del backend, que es el que manda. No se usa setMonth, que pasaria a marzo
export const sumarMeses = (fecha: string, meses: number) => {
    const [anio, mes, dia] = fecha.split('-').map(Number)
    const indice = mes - 1 + meses
    const anioDestino = anio + Math.floor(indice / 12)
    const mesDestino = (((indice % 12) + 12) % 12) + 1
    const diaDestino = Math.min(dia, ultimoDiaDelMes(anioDestino, mesDestino))
    return `${anioDestino}-${dosDigitos(mesDestino)}-${dosDigitos(diaDestino)}`
}

// 'AAAA-MM-DD' a la fecha local que usa el DatePicker; '' da null
export const deFechaApi = (fecha: string): Date | null => {
    if (fecha === '') {
        return null
    }
    const [anio, mes, dia] = fecha.split('-').map(Number)
    return new Date(anio, mes - 1, dia)
}

export const hoyApi = () => aFechaApi(new Date())
