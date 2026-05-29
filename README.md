# Coinnecta Mentores

Primera version de una web interna para dejar atras el Excel de seguimiento de alumnos.

El diseño sigue el branding de Coinnecta: negro/blanco con amarillo de acento, marca `COINNECTA` y una interfaz interna limpia para mentores. Ver `BRANDING.md`.

## Que incluye

- Panel con alumnos activos, cobros por confirmar y revisiones proximas.
- Vistas simples por seccion: panel, agenda, alumnos y cobros.
- Lista filtrable por alumno, tienda, curso, pagos y fechas.
- Ficha de alumno con fechas, precio, mentores, tienda y estado.
- Agenda semanal para reservar llamadas por Zoom o Meet con alumnos.
- Comentarios de tienda y control de pago por Pascu.
- Alta y edicion rapida de alumnos.
- Persistencia local en el navegador y exportacion JSON.
- Endpoint preparado para Vercel + Supabase.

## Probar en local

```bash
npm run dev
```

Abre `http://localhost:4173`.

## Desplegar en Vercel

Puedes subir esta carpeta a GitHub y conectarla con Vercel como proyecto estatico.

Configuracion recomendada en Vercel:

- Framework preset: `Other`
- Build command: vacio
- Output directory: `.`
- Install command: vacio

La app funciona sin backend usando `localStorage`.

Para backend real:

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase-schema.sql` en el SQL editor de Supabase.
3. En Vercel, anade estas variables de entorno:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_TABLE=student_records`
4. Conecta el frontend al endpoint `/api/students` cuando querais sincronizar datos entre mentores.

## Siguientes mejoras recomendadas

- Login por mentor.
- Historial de cambios por alumno.
- Vista calendario para llamadas y fechas fin.
- Importador desde Excel/CSV.
- Recordatorios automaticos por WhatsApp, email o Slack.
