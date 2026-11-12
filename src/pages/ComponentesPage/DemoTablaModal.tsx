import { useState } from 'react'
import { Boton } from '../../components/ui/Boton/Boton'
import { Buscador } from '../../components/ui/Buscador/Buscador'
import { Paginacion } from '../../components/ui/Paginacion/Paginacion'
import { usePaginacion } from '../../hooks/usePaginacion'
import { normalizar } from '../../utils/texto'
import { Campo } from '../../components/ui/Campo/Campo'
import { Etiqueta } from '../../components/ui/Etiqueta/Etiqueta'
import { Modal } from '../../components/ui/Modal/Modal'
import { Tabla, type ColumnaTabla } from '../../components/ui/Tabla/Tabla'
import { Seccion } from './Seccion'

interface AreaEjemplo {
    id: number
    nombre: string
    tipo: string
    activo: boolean
}

const nombresBase = ['Riesgos', 'Infraestructura', 'Seguridad', 'Desarrollo', 'Operaciones', 'Auditoría']

const areas: AreaEjemplo[] = Array.from({ length: 23 }, (_, indice) => ({
    id: indice + 1,
    nombre: `${nombresBase[indice % nombresBase.length]} ${indice + 1}`,
    tipo: indice % 4 === 0 ? 'Gerencia' : 'Área',
    activo: indice % 5 !== 0,
}))

type EstadoTabla = 'datos' | 'cargando' | 'vacia'

export const DemoTablaModal = () => {
    const [estadoTabla, setEstadoTabla] = useState<EstadoTabla>('datos')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [busqueda, setBusqueda] = useState('')
    const termino = normalizar(busqueda)
    const filas = estadoTabla === 'vacia' ? [] : areas.filter((area) => normalizar(area.nombre).includes(termino))
    const paginacion = usePaginacion(filas, `${estadoTabla}|${termino}`)

    const columnas: ColumnaTabla<AreaEjemplo>[] = [
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'tipo', titulo: 'Tipo' },
        {
            clave: 'activo',
            titulo: 'Estado',
            render: (area) => (
                <Etiqueta variante={area.activo ? 'normal' : 'apagada'}>{area.activo ? 'Activo' : 'Inactivo'}</Etiqueta>
            ),
        },
        {
            clave: 'acciones',
            titulo: 'Acciones',
            alineacion: 'derecha',
            render: () => (
                <Boton variante="texto" onClick={() => setModalAbierto(true)}>
                    Editar
                </Boton>
            ),
        },
    ]

    return (
        <Seccion titulo="Tabla, búsqueda, paginación y modal">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="w-64">
                    <Buscador valor={busqueda} onCambiar={setBusqueda} />
                </div>
                <Boton variante="primario" onClick={() => setModalAbierto(true)}>
                    Nueva área
                </Boton>
                <Boton onClick={() => setEstadoTabla('datos')}>Con datos</Boton>
                <Boton onClick={() => setEstadoTabla('cargando')}>Cargando</Boton>
                <Boton onClick={() => setEstadoTabla('vacia')}>Vacía</Boton>
            </div>
            <div className="space-y-4">
                <Tabla
                    columnas={columnas}
                    filas={paginacion.filasPagina}
                    claveFila={(area) => area.id}
                    cargando={estadoTabla === 'cargando'}
                />
                <Paginacion
                    pagina={paginacion.pagina}
                    totalPaginas={paginacion.totalPaginas}
                    total={paginacion.total}
                    tamano={paginacion.tamano}
                    onCambiarPagina={paginacion.irAPagina}
                    onCambiarTamano={paginacion.cambiarTamano}
                />
            </div>
            <Modal
                abierto={modalAbierto}
                titulo="Nueva área"
                onCerrar={() => setModalAbierto(false)}
                acciones={
                    <>
                        <Boton onClick={() => setModalAbierto(false)}>Cancelar</Boton>
                        <Boton variante="primario" onClick={() => setModalAbierto(false)}>
                            Guardar
                        </Boton>
                    </>
                }
            >
                <Campo etiqueta="Nombre" obligatorio />
            </Modal>
        </Seccion>
    )
}
