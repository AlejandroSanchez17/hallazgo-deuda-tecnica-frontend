import Swal from 'sweetalert2'

// Las clases llevan ! porque el CSS de SweetAlert no esta en una capa y le gana a las utilidades de Tailwind
const aviso = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: false,
    customClass: {
        popup: 'text-sm! rounded-md! shadow-md!',
        title: 'text-sm! font-semibold! text-texto!',
    },
})

export const avisarExito = (mensaje: string) => aviso.fire({ icon: 'success', title: mensaje, timer: 3000 })

export const avisarError = (mensaje: string) => aviso.fire({ icon: 'error', title: mensaje, timer: 5000 })

export const confirmar = async (titulo: string, texto?: string): Promise<boolean> => {
    const resultado = await Swal.fire({
        title: titulo,
        text: texto,
        width: 380,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        focusCancel: true,
        buttonsStyling: false,
        customClass: {
            popup: 'rounded-md! text-sm! pb-5!',
            title: 'text-base! font-semibold! text-texto! px-5! pt-5!',
            htmlContainer: 'text-sm! text-texto-secundario! mx-5! mt-2!',
            actions: 'mt-5!',
            confirmButton: 'mx-1 rounded-md bg-primario px-4 py-2 font-semibold text-blanco hover:bg-primario-hover',
            cancelButton: 'mx-1 rounded-md border border-borde bg-blanco px-4 py-2 text-texto hover:bg-fondo',
        },
    })
    return resultado.isConfirmed
}
