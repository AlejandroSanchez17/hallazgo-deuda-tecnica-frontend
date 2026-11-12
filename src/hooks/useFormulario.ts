import { useState, type ChangeEvent } from 'react'

type ControlTexto = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export const useFormulario = <F extends object>(inicial: F) => {
    const [formulario, setFormulario] = useState<F>(inicial)

    const asignar = <K extends keyof F>(campo: K, valor: F[K]) =>
        setFormulario((anterior) => ({ ...anterior, [campo]: valor }))

    // Para campos de texto y combos: onChange={cambiar('nombre')}
    const cambiar = (campo: keyof F) => (evento: ChangeEvent<ControlTexto>) =>
        setFormulario((anterior) => ({ ...anterior, [campo]: evento.target.value }))

    return { formulario, asignar, cambiar }
}
