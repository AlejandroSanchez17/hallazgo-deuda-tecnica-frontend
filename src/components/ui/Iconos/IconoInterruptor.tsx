interface IconoInterruptorProps {
    encendido: boolean
    className?: string
}

export const IconoInterruptor = ({ encendido, className = 'size-4' }: IconoInterruptorProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
    >
        <rect x="2" y="6.5" width="20" height="11" rx="5.5" />
        <circle cx={encendido ? 16.5 : 7.5} cy="12" r="3" fill={encendido ? 'currentColor' : 'none'} />
    </svg>
)
