import { spacing } from '@hnba/design-tokens'
import { Pagination } from '@hnba/react-ui'
import { useState } from 'react'
import { Pantalla } from '../../../../components/common/Pantalla/Pantalla'
import { TAMANOS_PAGINA } from '../../../../hooks/usePaginacion'
import { useNotificacionesStore } from '../../../../store/notificacionesStore'
import { columna } from '../../../../styles/disposicion'
import { BarraNotificaciones } from '../../components/BarraNotificaciones/BarraNotificaciones'
import { ContenidoNotificaciones } from '../../components/ContenidoNotificaciones/ContenidoNotificaciones'
import { useAbrirNotificacion } from '../../hooks/useAbrirNotificacion'
import { useMarcarTodas } from '../../hooks/useMarcarTodas'
import { useNotificaciones } from '../../hooks/useNotificaciones'

export const NotificacionesPage = () => {
    const [soloNoLeidas, setSoloNoLeidas] = useState(false)
    // Pagination cuenta desde 1 y el backend desde 0
    const [pagina, setPagina] = useState(1)
    const [tamano, setTamano] = useState(TAMANOS_PAGINA[0])
    const total = useNotificacionesStore((estado) => estado.total)

    const lista = useNotificaciones({ soloNoLeidas, pagina: pagina - 1, tamano })
    const abrir = useAbrirNotificacion({ onMarcada: lista.marcarLocal })
    // Con el filtro "Solo sin leer" la lista queda vacia: se vuelve a la primera pagina
    const { marcarTodas, marcando } = useMarcarTodas(() => (pagina === 1 ? lista.recargar() : setPagina(1)))
    const hayNoLeidas = total > 0 || lista.notificaciones.some((notificacion) => !notificacion.leida)

    return (
        <Pantalla titulo="Notificaciones" descripcion="Sus avisos del sistema.">
            <BarraNotificaciones
                soloNoLeidas={soloNoLeidas}
                onCambiarFiltro={(valor) => {
                    setSoloNoLeidas(valor)
                    setPagina(1)
                }}
                puedeMarcar={hayNoLeidas && !marcando}
                onMarcarTodas={marcarTodas}
            />
            <div style={columna(spacing.md)}>
                <ContenidoNotificaciones
                    cargando={lista.cargando}
                    notificaciones={lista.notificaciones}
                    soloNoLeidas={soloNoLeidas}
                    onAbrir={abrir}
                />
                {!lista.cargando && lista.totalElementos > 0 && (
                    <Pagination
                        page={pagina}
                        totalRecords={lista.totalElementos}
                        pageSize={tamano}
                        pageSizeOptions={TAMANOS_PAGINA}
                        showPageSizeSelector
                        pageSizePosition="left"
                        onPageChange={setPagina}
                        onPageSizeChange={(nuevo) => {
                            setTamano(nuevo)
                            setPagina(1)
                        }}
                    />
                )}
            </div>
        </Pantalla>
    )
}
