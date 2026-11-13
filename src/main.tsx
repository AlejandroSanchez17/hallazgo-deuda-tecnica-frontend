import '@hnba/design-tokens/fonts.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from '@hnba/react-ui'
import { App } from './App'
import { PuenteAvisos } from './components/common/PuenteAvisos/PuenteAvisos'
import './styles/globals.css'

const raiz = document.getElementById('root')
if (!raiz) {
    throw new Error('No existe el elemento #root en index.html')
}

createRoot(raiz).render(
    <StrictMode>
        <ToastProvider position="top-right">
            <PuenteAvisos />
            <App />
        </ToastProvider>
    </StrictMode>,
)
