import { Boton } from '../../components/ui/Boton/Boton'
import { Cargando } from '../../components/ui/Cargando/Cargando'
import { Etiqueta } from '../../components/ui/Etiqueta/Etiqueta'
import { MensajeError } from '../../components/ui/MensajeError/MensajeError'
import { Semaforo } from '../../components/ui/Semaforo/Semaforo'
import { avisarError, avisarExito, confirmar } from '../../utils/alertas'
import { DemoCampos } from './DemoCampos'
import { DemoTablaModal } from './DemoTablaModal'
import { Seccion } from './Seccion'

const probarConfirmacion = async () => {
    const confirmado = await confirmar('¿Desactivar el área Riesgos?', 'Podrá activarla de nuevo después.')
    void avisarExito(confirmado ? 'Área desactivada' : 'Acción cancelada')
}

export const ComponentesPage = () => (
    <div className="max-w-5xl space-y-6">
        <div>
            <h1 className="text-xl font-bold">Componentes</h1>
            <p className="mt-1 text-sm text-texto-secundario">
                Catálogo de los componentes de ui/. Esta página solo existe en desarrollo.
            </p>
        </div>

        <Seccion titulo="Botones">
            <div className="flex flex-wrap gap-2">
                <Boton variante="primario">Primario</Boton>
                <Boton>Secundario</Boton>
                <Boton variante="texto">Texto</Boton>
                <Boton variante="primario" disabled>
                    Deshabilitado
                </Boton>
            </div>
        </Seccion>

        <DemoCampos />

        <DemoTablaModal />

        <Seccion titulo="Etiquetas y semáforo">
            <div className="flex flex-wrap items-center gap-6">
                <Etiqueta>Activo</Etiqueta>
                <Etiqueta variante="apagada">Inactivo</Etiqueta>
                <Semaforo estado="VENCIDO" />
                <Semaforo estado="EN_RIESGO" />
                <Semaforo estado="EN_TIEMPO" />
            </div>
        </Seccion>

        <Seccion titulo="Mensajes y alertas">
            <div className="space-y-4">
                <Cargando />
                <MensajeError mensaje="No se pudo conectar con el servidor" />
                <div className="flex flex-wrap gap-2">
                    <Boton onClick={() => void avisarExito('Área creada')}>Aviso de éxito</Boton>
                    <Boton onClick={() => void avisarError('Ya existe un área con el nombre Riesgos')}>
                        Aviso de error
                    </Boton>
                    <Boton onClick={() => void probarConfirmacion()}>Confirmación</Boton>
                </div>
            </div>
        </Seccion>
    </div>
)
