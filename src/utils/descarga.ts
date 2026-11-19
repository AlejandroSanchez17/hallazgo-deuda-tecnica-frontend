// Nombre del archivo en Content-Disposition (filename*=UTF-8''… o filename="…"). El navegador solo deja leer el
// encabezado si el backend lo expone por CORS; si no llega, se usa el respaldo
export const nombreDeDescarga = (encabezado: string | undefined, respaldo: string) => {
    const codificado = encabezado?.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
    if (codificado) {
        try {
            return decodeURIComponent(codificado)
        } catch {
            return respaldo
        }
    }
    return encabezado?.match(/filename="?([^";]+)"?/i)?.[1] ?? respaldo
}

export const guardarArchivo = (contenido: Blob, nombre: string) => {
    const url = URL.createObjectURL(contenido)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = nombre
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    // Se libera despues, para no cortar la descarga que el navegador acaba de empezar
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const abrirEnOtraPestana = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
}
