import { useState } from 'react'

export const useFormulario = <F extends object>(inicial: F) => {
    const [formulario, setFormulario] = useState<F>(inicial)

    const asignar = <K extends keyof F>(campo: K, valor: F[K]) =>
        setFormulario((anterior) => ({ ...anterior, [campo]: valor }))

    // Para los campos de la libreria, cuyo onChange entrega el valor de texto: onChange={cambiar('nombre')}
    const cambiar = (campo: keyof F) => (valor: string) =>
        setFormulario((anterior) => ({ ...anterior, [campo]: valor }))

    return { formulario, asignar, cambiar }
}
