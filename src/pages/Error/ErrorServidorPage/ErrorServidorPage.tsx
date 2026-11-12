import { Boton } from '../../../components/ui/Boton/Boton'

// Recarga completa porque el estado de la aplicacion pudo quedar inconsistente
const recargarInicio = () => window.location.assign('/')

export const ErrorServidorPage = () => (
    <main className="flex min-h-svh items-center justify-center p-6">
        <section className="max-w-md text-center">
            <p className="text-sm font-semibold text-texto-secundario">Error inesperado</p>
            <h1 className="mt-2 text-xl font-bold">Algo salió mal</h1>
            <p className="mt-2 text-sm text-texto-secundario">
                Ocurrió un problema al mostrar esta página. Intente de nuevo.
            </p>
            <Boton variante="primario" className="mt-6" onClick={recargarInicio}>
                Volver al inicio
            </Boton>
        </section>
    </main>
)
