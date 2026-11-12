const leerVariable = (nombre: string): string => {
    const valor: unknown = import.meta.env[nombre]
    if (typeof valor !== 'string' || valor.trim() === '') {
        throw new Error(`Falta la variable de entorno ${nombre} en .env.development`)
    }
    return valor.trim()
}

export const env = {
    apiUrl: leerVariable('VITE_API_URL'),
    usuarioSimuladoInicial: Number(leerVariable('VITE_USUARIO_SIMULADO_ID')),
}
