import { spacing } from '@hnba/design-tokens'
import { Button, Tooltip } from '@hnba/react-ui'
import { fila } from '../../../../styles/disposicion'
import type { DefinicionReporte, FormatoReporte } from '../../types'

interface BotonesDeDescargaProps {
    definicion: DefinicionReporte
    // Falta algo obligatorio (el elemento de REP-05)
    incompleto: boolean
    // El formato que se esta bajando; mientras tanto los dos botones quedan sin uso
    formatoEnCurso: FormatoReporte | null
    onDescargar: (formato: FormatoReporte) => void
}

export const BotonesDeDescarga = ({ definicion, incompleto, formatoEnCurso, onDescargar }: BotonesDeDescargaProps) => {
    const ocupado = formatoEnCurso !== null
    const excel = (
        <Button
            variant="primary"
            iconName="file_excel"
            loading={formatoEnCurso === 'xlsx'}
            disabled={definicion.soloPdf || incompleto || ocupado}
            onClick={() => onDescargar('xlsx')}
        >
            Descargar Excel
        </Button>
    )

    return (
        <div style={fila(spacing.sm)}>
            {definicion.soloPdf ? <Tooltip content="Este informe solo se genera en PDF">{excel}</Tooltip> : excel}
            <Button
                variant="outlined"
                iconName="file_pdf"
                loading={formatoEnCurso === 'pdf'}
                disabled={incompleto || ocupado}
                onClick={() => onDescargar('pdf')}
            >
                Descargar PDF
            </Button>
        </div>
    )
}
