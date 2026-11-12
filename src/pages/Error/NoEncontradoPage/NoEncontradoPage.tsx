import { useNavigate } from 'react-router-dom'
import { Boton } from '../../../components/ui/Boton/Boton'

export const NoEncontradoPage = () => {
    const navegar = useNavigate()

    return (
        <section className="mx-auto max-w-md py-16 text-center">
            <p className="text-sm font-semibold text-texto-secundario">Error 404</p>
            <h1 className="mt-2 text-xl font-bold">Página no encontrada</h1>
            <p className="mt-2 text-sm text-texto-secundario">La dirección no existe o ya no está disponible.</p>
            <Boton variante="primario" className="mt-6" onClick={() => void navegar('/')}>
                Volver al inicio
            </Boton>
        </section>
    )
}
