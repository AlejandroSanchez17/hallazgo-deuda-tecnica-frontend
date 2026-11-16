import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }

export default defineConfig({
    plugins: [react()],
    // El Footer muestra la version del package.json
    define: { VERSION_APP: JSON.stringify(version) },
    // El backend solo acepta CORS desde este puerto
    server: { port: 5173, strictPort: true },
})
