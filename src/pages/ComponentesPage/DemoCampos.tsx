import { useState } from 'react'
import { AreaTexto } from '../../components/ui/AreaTexto/AreaTexto'
import { Campo } from '../../components/ui/Campo/Campo'
import { Interruptor } from '../../components/ui/Interruptor/Interruptor'
import { Selector } from '../../components/ui/Selector/Selector'
import { Seccion } from './Seccion'

const tiposArea = [
    { valor: 'GERENCIA', texto: 'Gerencia' },
    { valor: 'AREA', texto: 'Área' },
]

export const DemoCampos = () => {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [tipo, setTipo] = useState('')
    const [restringida, setRestringida] = useState(false)

    return (
        <Seccion titulo="Campos">
            <div className="grid gap-5 md:grid-cols-2">
                <Campo
                    etiqueta="Nombre"
                    obligatorio
                    maxLength={120}
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                    ayuda="Hasta 120 caracteres"
                />
                <Campo etiqueta="Nombre (con error)" defaultValue="Riesgos" error="Ya existe un área con ese nombre" />
                <Campo etiqueta="Plazo en meses" type="number" min={1} defaultValue={3} />
                <Campo etiqueta="Deshabilitado" defaultValue="No se puede editar" disabled />
                <Selector
                    etiqueta="Tipo de área"
                    obligatorio
                    opciones={tiposArea}
                    value={tipo}
                    onChange={(evento) => setTipo(evento.target.value)}
                />
                <Selector etiqueta="Área padre (con error)" opciones={[]} error="Formaría un ciclo" />
                <AreaTexto
                    etiqueta="Descripción"
                    maxLength={300}
                    value={descripcion}
                    onChange={(evento) => setDescripcion(evento.target.value)}
                />
                <div className="flex flex-col gap-3 pt-6">
                    <Interruptor etiqueta="Categoría restringida" activo={restringida} onCambiar={setRestringida} />
                    <Interruptor etiqueta="Deshabilitado" activo onCambiar={() => undefined} disabled />
                </div>
            </div>
        </Seccion>
    )
}
