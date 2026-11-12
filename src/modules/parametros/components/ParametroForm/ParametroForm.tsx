import { useState } from 'react'
import { AreaTexto } from '../../../../components/ui/AreaTexto/AreaTexto'
import { Campo } from '../../../../components/ui/Campo/Campo'
import { Etiqueta } from '../../../../components/ui/Etiqueta/Etiqueta'
import { Interruptor } from '../../../../components/ui/Interruptor/Interruptor'
import { ModalFormulario } from '../../../../components/ui/ModalFormulario/ModalFormulario'
import { useGuardarParametro } from '../../hooks/useGuardarParametro'
import type { ParametroResponse } from '../../types'
import { separarLista } from '../../valores'

interface ParametroFormProps {
    parametro: ParametroResponse
    onCerrar: () => void
    onGuardado: () => void
}

export const ParametroForm = ({ parametro, onCerrar, onGuardado }: ParametroFormProps) => {
    const [valor, setValor] = useState(parametro.valor)
    const { guardar, error, guardando } = useGuardarParametro(onGuardado)

    // La lista se envia limpia: sin espacios ni elementos vacios
    const valorAEnviar = parametro.tipoDato === 'LISTA' ? separarLista(valor).join(',') : valor.trim()

    const control = () => {
        switch (parametro.tipoDato) {
            case 'BOOLEANO':
                return (
                    <Interruptor
                        etiqueta={valor === 'true' ? 'Activado' : 'Desactivado'}
                        activo={valor === 'true'}
                        onCambiar={(activo) => setValor(String(activo))}
                    />
                )
            case 'ENTERO':
                return (
                    <Campo
                        etiqueta="Valor"
                        obligatorio
                        type="number"
                        min={0}
                        step={1}
                        value={valor}
                        onChange={(evento) => setValor(evento.target.value)}
                        error={error}
                        ayuda="Número entero sin signo"
                    />
                )
            case 'DECIMAL':
                return (
                    <Campo
                        etiqueta="Valor"
                        obligatorio
                        inputMode="decimal"
                        value={valor}
                        onChange={(evento) => setValor(evento.target.value)}
                        error={error}
                        ayuda="Número sin signo; use punto para los decimales, por ejemplo 2.5"
                    />
                )
            case 'LISTA':
                return (
                    <div className="space-y-2">
                        <AreaTexto
                            etiqueta="Valores"
                            obligatorio
                            rows={2}
                            value={valor}
                            onChange={(evento) => setValor(evento.target.value)}
                            error={error}
                            ayuda="Separados por coma"
                        />
                        <div className="flex flex-wrap gap-1">
                            {separarLista(valor).map((elemento, indice) => (
                                <Etiqueta key={`${elemento}-${indice}`} variante="apagada">
                                    {elemento}
                                </Etiqueta>
                            ))}
                        </div>
                    </div>
                )
            default:
                return (
                    <Campo
                        etiqueta="Valor"
                        obligatorio
                        maxLength={500}
                        value={valor}
                        onChange={(evento) => setValor(evento.target.value)}
                        error={error}
                    />
                )
        }
    }

    return (
        <ModalFormulario
            titulo="Editar parámetro"
            guardando={guardando}
            onCerrar={onCerrar}
            onEnviar={() => void guardar(parametro.clave, valorAEnviar)}
        >
            <div>
                <p className="text-sm">{parametro.descripcion}</p>
                <p className="mt-1 font-mono text-xs text-texto-secundario">{parametro.clave}</p>
            </div>
            {control()}
            {parametro.tipoDato === 'BOOLEANO' && error && <p className="text-xs text-error">{error}</p>}
        </ModalFormulario>
    )
}
