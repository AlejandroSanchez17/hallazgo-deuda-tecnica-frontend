import { useNavigate } from 'react-router-dom'
import { Boton } from '../../../components/ui/Boton/Boton'
import { RUTAS } from '../../../utils/constants/rutas'

export const SinPermisoPage = () => {
    const navegar = useNavigate()

    return (
        <section className="mx-auto max-w-md py-16 text-center">
            <p className="text-sm font-semibold text-texto-secundario">Error 403</p>
            <h1 className="mt-2 text-xl font-bold">Sin permiso</h1>
            <p className="mt-2 text-sm text-texto-secundario">Su usuario no tiene permiso para ver esta página.</p>
            <Boton variante="primario" className="mt-6" onClick={() => void navegar(RUTAS.inicio)}>
                Volver al inicio
            </Boton>
        </section>
    )
}
