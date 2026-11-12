import { Etiqueta } from '../../../../components/ui/Etiqueta/Etiqueta'
import type { ParametroResponse } from '../../types'
import { separarLista } from '../../valores'

interface ValorParametroProps {
    parametro: ParametroResponse
}

export const ValorParametro = ({ parametro }: ValorParametroProps) => {
    if (parametro.tipoDato === 'BOOLEANO') {
        return parametro.valor === 'true' ? <Etiqueta>Sí</Etiqueta> : <Etiqueta variante="apagada">No</Etiqueta>
    }
    if (parametro.tipoDato === 'LISTA') {
        return (
            <div className="flex max-w-sm flex-wrap gap-1">
                {separarLista(parametro.valor).map((elemento) => (
                    <Etiqueta key={elemento} variante="apagada">
                        {elemento}
                    </Etiqueta>
                ))}
            </div>
        )
    }
    return <span className="font-semibold">{parametro.valor}</span>
}
