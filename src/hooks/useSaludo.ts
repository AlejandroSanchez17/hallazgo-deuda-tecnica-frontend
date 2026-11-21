import { useSesionStore } from '../store/sesionStore'

// Hora local del navegador: de 5 a 11 "Buenos días", de 12 a 18 "Buenas tardes" y el resto "Buenas noches"
export const saludoSegunHora = (ahora: Date) => {
    const hora = ahora.getHours()
    if (hora >= 5 && hora < 12) {
        return 'Buenos días'
    }
    return hora >= 12 && hora < 19 ? 'Buenas tardes' : 'Buenas noches'
}

// "Buenos días, Rosa Medina": el titulo de las pantallas de inicio; sin sesion cargada, solo el saludo
export const useSaludo = (): string => {
    const nombre = useSesionStore((estado) => estado.usuario?.nombre)
    const saludo = saludoSegunHora(new Date())
    return nombre ? `${saludo}, ${nombre}` : saludo
}
