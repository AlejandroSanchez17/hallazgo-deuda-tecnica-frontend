# Frontend del Sistema de Hallazgos y Deuda Técnica

React 19, TypeScript, Vite, TailwindCSS, React Router, Zustand, axios y SweetAlert2.

## Arrancar

1. `npm install`
2. Arranca el backend en `http://localhost:8080`.
3. `npm run dev` y abre `http://localhost:5173`. El puerto es fijo porque el backend solo acepta CORS desde él.

Las variables están en `.env.development`:

| Variable | Para qué |
|---|---|
| `VITE_API_URL` | URL del backend |
| `VITE_USUARIO_SIMULADO_ID` | Usuario que se envía en `X-Usuario-Id` hasta tener el selector (FE-03) y el login (FE-02) |

Para cambiar un valor solo en tu equipo, cópialo en `.env.development.local`, que git no sube.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Revisa los tipos y genera `dist/` |
| `npm run lint` | ESLint |
| `npm run format` | Formatea con Prettier |
| `npm run format:check` | Revisa el formato sin cambiar nada |

## Reglas

- Las páginas usan los componentes de `src/components/ui/` para botones, campos, tablas y modales, nunca Tailwind directo.
- Los colores y la fuente se definen solo en el `@theme` de `src/styles/globals.css`.
- El detalle de la estructura y las convenciones está en `FICHA_TECNICA_FRONTEND.md`.
