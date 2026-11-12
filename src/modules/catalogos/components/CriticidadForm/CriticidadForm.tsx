import { Campo } from '../../../../components/ui/Campo/Campo'
import { Selector } from '../../../../components/ui/Selector/Selector'
import { useFormulario } from '../../../../hooks/useFormulario'
import { criticidadesApi } from '../../api'
import { useGuardarCatalogo } from '../../hooks/useGuardarCatalogo'
import { TEXTOS } from '../../textos'
import type { CriticidadFormulario, CriticidadRequest, CriticidadResponse, RolResumen } from '../../types'
import { ModalFormulario } from '../../../../components/ui/ModalFormulario/ModalFormulario'

const aNumero = (texto: string) => (texto.trim() === '' ? null : Number(texto))

const aSolicitud = (formulario: CriticidadFormulario): CriticidadRequest => ({
    nombre: formulario.nombre.trim(),
    plazoMeses: aNumero(formulario.plazoMeses),
    maxProrrogas: aNumero(formulario.maxProrrogas),
    rolApruebaPlanId: aNumero(formulario.rolApruebaPlanId),
    rolValidaCierreId: aNumero(formulario.rolValidaCierreId),
})

interface CriticidadFormProps {
    criticidad: CriticidadResponse
    roles: RolResumen[]
    onCerrar: () => void
    onGuardado: () => void
}

// Las criticidades no se crean ni se desactivan, y su nivel no se edita
export const CriticidadForm = ({ criticidad, roles, onCerrar, onGuardado }: CriticidadFormProps) => {
    const { formulario, cambiar } = useFormulario<CriticidadFormulario>({
        nombre: criticidad.nombre,
        plazoMeses: criticidad.plazoMeses.toString(),
        maxProrrogas: criticidad.maxProrrogas.toString(),
        rolApruebaPlanId: criticidad.rolApruebaPlan.id.toString(),
        rolValidaCierreId: criticidad.rolValidaCierre.id.toString(),
    })
    const { guardar, errores, guardando } = useGuardarCatalogo({
        aSolicitud,
        actualizar: criticidadesApi.actualizar,
        textos: TEXTOS.criticidad,
        onGuardado,
    })
    const opcionesRol = roles.map((rol) => ({ valor: rol.id, texto: rol.nombre }))

    return (
        <ModalFormulario
            titulo={`Editar criticidad (nivel ${criticidad.nivel})`}
            guardando={guardando}
            onCerrar={onCerrar}
            onEnviar={() => void guardar(formulario, criticidad.id)}
        >
            <Campo
                etiqueta="Nombre"
                obligatorio
                maxLength={30}
                value={formulario.nombre}
                onChange={cambiar('nombre')}
                error={errores.nombre}
            />
            <div className="grid grid-cols-2 gap-4">
                <Campo
                    etiqueta="Plazo (meses)"
                    obligatorio
                    type="number"
                    min={1}
                    value={formulario.plazoMeses}
                    onChange={cambiar('plazoMeses')}
                    error={errores.plazoMeses}
                    ayuda="Mínimo 1"
                />
                <Campo
                    etiqueta="Prórrogas máximas"
                    obligatorio
                    type="number"
                    min={0}
                    value={formulario.maxProrrogas}
                    onChange={cambiar('maxProrrogas')}
                    error={errores.maxProrrogas}
                    ayuda="Mínimo 0"
                />
            </div>
            <Selector
                etiqueta="Rol que aprueba el plan"
                obligatorio
                opciones={opcionesRol}
                value={formulario.rolApruebaPlanId}
                onChange={cambiar('rolApruebaPlanId')}
                error={errores.rolApruebaPlanId}
            />
            <Selector
                etiqueta="Rol que valida el cierre"
                obligatorio
                opciones={opcionesRol}
                value={formulario.rolValidaCierreId}
                onChange={cambiar('rolValidaCierreId')}
                error={errores.rolValidaCierreId}
            />
        </ModalFormulario>
    )
}
