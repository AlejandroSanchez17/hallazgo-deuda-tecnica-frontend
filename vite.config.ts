import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    // El backend solo acepta CORS desde este puerto
    server: { port: 5173, strictPort: true },
})
