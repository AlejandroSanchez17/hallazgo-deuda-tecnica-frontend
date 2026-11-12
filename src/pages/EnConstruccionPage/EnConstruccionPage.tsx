interface EnConstruccionPageProps {
    titulo: string
}

// Temporal: ocupa las rutas del menu hasta que exista su pantalla
export const EnConstruccionPage = ({ titulo }: EnConstruccionPageProps) => (
    <section className="max-w-2xl">
        <h1 className="text-xl font-bold">{titulo}</h1>
        <p className="mt-1 text-sm text-texto-secundario">Esta pantalla está en construcción.</p>
    </section>
)
