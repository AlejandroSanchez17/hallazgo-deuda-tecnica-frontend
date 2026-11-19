import { spacing } from '@hnba/design-tokens'
import { Button, Select, Toggle } from '@hnba/react-ui'
import { useState } from 'react'
import { TablaPaginada } from '../../../../components/common/TablaPaginada/TablaPaginada'
import { fila, filaEntreExtremos, columna } from '../../../../styles/disposicion'
import { textoDeOpcion, valorDeOpcion, type Opcion } from '../../../../utils/opciones'
import { accionesEvidencias, columnasEvidencias } from '../../columnasEvidencias'
import { useDescarga } from '../../hooks/useDescarga'
import { useEvidencias } from '../../hooks/useEvidencias'
import { usePermisosEvidencias, type ElementoDeEvidencias } from '../../hooks/usePermisosEvidencias'
import { usePlanVigente } from '../../hooks/usePlanVigente'
import { claveDestino, destinoDeEvidencia } from '../../textosEvidencia'
import type { EvidenciaResponse, ObjetivoSubida } from '../../typesEvidencia'
import { DetalleEvidencia } from '../DetalleEvidencia/DetalleEvidencia'
import { EvidenciaForm } from '../EvidenciaForm/EvidenciaForm'

interface EvidenciasElementoProps {
    elemento: ElementoDeEvidencias
    codigo: string
}

const TODOS: Opcion = { valor: '', texto: 'Todo destino' }

// Opciones del filtro sacadas de las filas, en el orden en que aparecen: elemento, planes y tareas
const opcionesDestino = (evidencias: EvidenciaResponse[]): Opcion[] => {
    const vistas = new Map<string, string>()
    evidencias.forEach((evidencia) => {
        const destino = destinoDeEvidencia(evidencia)
        vistas.set(claveDestino(destino), destino.texto)
    })
    const orden = (clave: string) => (clave === 'ELEMENTO' ? 0 : clave.startsWith('PLAN') ? 1 : 2)
    return [
        TODOS,
        ...[...vistas.entries()].sort(([a], [b]) => orden(a) - orden(b)).map(([valor, texto]) => ({ valor, texto })),
    ]
}

// Pestana Evidencias del detalle: todas las del elemento, de su plan y de sus tareas
export const EvidenciasElemento = ({ elemento, codigo }: EvidenciasElementoProps) => {
    const { evidencias, cargando, recargar } = useEvidencias(elemento.id)
    const { plan } = usePlanVigente(elemento.id)
    const permisos = usePermisosEvidencias(elemento, plan)
    const descarga = useDescarga()
    const [destino, setDestino] = useState('')
    const [conReemplazadas, setConReemplazadas] = useState(false)
    const [enDetalle, setEnDetalle] = useState<EvidenciaResponse | null>(null)
    const [subida, setSubida] = useState<ObjetivoSubida | null>(null)

    const opciones = opcionesDestino(evidencias)
    const filas = evidencias.filter(
        (evidencia) =>
            (conReemplazadas || evidencia.estado === 'VIGENTE') &&
            (destino === '' || claveDestino(destinoDeEvidencia(evidencia)) === destino),
    )
    const hayVigentes = evidencias.some((evidencia) => evidencia.estado === 'VIGENTE')
    const algunaReemplazable = evidencias.some(permisos.puedeReemplazar)

    const alGuardar = () => {
        setSubida(null)
        recargar()
    }

    return (
        <div style={columna(spacing.md)}>
            <div style={filaEntreExtremos}>
                <div style={fila(spacing.md)}>
                    <div style={{ width: 260 }} role="group" aria-label="Filtrar por destino">
                        <Select
                            options={opciones}
                            value={opciones.find((opcion) => opcion.valor === destino) ?? TODOS}
                            getLabel={textoDeOpcion}
                            getValue={valorDeOpcion}
                            onChange={(opcion) => setDestino(opcion.valor)}
                        />
                    </div>
                    <Toggle checked={conReemplazadas} onChange={setConReemplazadas} label="Mostrar reemplazadas" />
                </div>
                <div style={fila(spacing.sm)}>
                    {permisos.puedeDescargar && (
                        <Button
                            variant="outlined"
                            iconName="download"
                            disabled={!hayVigentes}
                            loading={descarga.descargando}
                            onClick={() => descarga.paquete(elemento.id, codigo)}
                        >
                            Descargar todo
                        </Button>
                    )}
                    {permisos.destinos.length > 0 && (
                        <Button
                            variant="primary"
                            iconName="upload"
                            onClick={() => setSubida({ tipo: 'nueva', destinos: permisos.destinos })}
                        >
                            Subir evidencia
                        </Button>
                    )}
                </div>
            </div>

            <TablaPaginada
                columnas={columnasEvidencias}
                acciones={accionesEvidencias({
                    onVer: setEnDetalle,
                    onObtener: permisos.puedeDescargar ? descarga.obtener : undefined,
                    onReemplazar: algunaReemplazable
                        ? (evidencia) => setSubida({ tipo: 'reemplazo', evidencia })
                        : undefined,
                    puedeReemplazar: permisos.puedeReemplazar,
                })}
                filas={filas}
                claveFila={(evidencia) => evidencia.id}
                etiquetaFila={(evidencia) => evidencia.nombre}
                claveReinicio={`${destino}-${conReemplazadas}`}
                cargando={cargando}
                textoVacio={evidencias.length === 0 ? 'Todavía no hay evidencias' : 'Ninguna evidencia coincide'}
            />

            {enDetalle && (
                <DetalleEvidencia
                    evidencia={enDetalle}
                    onObtener={permisos.puedeDescargar ? () => descarga.obtener(enDetalle) : undefined}
                    descargando={descarga.descargando}
                    onCerrar={() => setEnDetalle(null)}
                />
            )}
            {subida && <EvidenciaForm objetivo={subida} onCerrar={() => setSubida(null)} onGuardado={alGuardar} />}
        </div>
    )
}
