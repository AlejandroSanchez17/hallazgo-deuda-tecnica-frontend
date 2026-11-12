export type EstadoSemaforo = 'VENCIDO' | 'EN_RIESGO' | 'EN_TIEMPO'

interface SemaforoProps {
    estado: EstadoSemaforo
}

const configuracion: Record<EstadoSemaforo, { texto: string; color: string }> = {
    VENCIDO: { texto: 'Vencido', color: 'bg-semaforo-vencido' },
    EN_RIESGO: { texto: 'En riesgo', color: 'bg-semaforo-riesgo' },
    EN_TIEMPO: { texto: 'En tiempo', color: 'bg-semaforo-tiempo' },
}

// El texto acompana al color para que se entienda sin distinguir colores
export const Semaforo = ({ estado }: SemaforoProps) => (
    <span className="inline-flex items-center gap-1.5 text-sm text-texto">
        <span className={`size-2.5 shrink-0 rounded-full ${configuracion[estado].color}`} aria-hidden="true" />
        {configuracion[estado].texto}
    </span>
)
