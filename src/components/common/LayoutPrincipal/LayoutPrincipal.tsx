import { ContenidoPrincipal } from '../ContenidoPrincipal/ContenidoPrincipal'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'

export const LayoutPrincipal = () => (
    <div className="flex min-h-svh flex-col">
        <Header />
        <div className="flex flex-1">
            <Sidebar />
            <main className="min-w-0 flex-1 p-6">
                <ContenidoPrincipal />
            </main>
        </div>
    </div>
)
