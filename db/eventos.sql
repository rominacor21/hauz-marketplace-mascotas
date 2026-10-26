-- Tabla de eventos del MVP de Hauz (Supabase / PostgreSQL).
-- Registra cada interacción con sesión, usuario, variante del A/B, evento, dimensión consultada y detalle.
-- Es la base de todas las métricas del experimento (ver analisis/metricas_ab.sql).
-- Los nombres de los eventos son de referencia; la tabla del MVP vive en el proyecto de Supabase.

create table if not exists public.eventos (
  id          bigint generated always as identity primary key,
  creado_en   timestamptz not null default now(),
  sesion_id   uuid        not null,
  usuario_id  uuid        references auth.users (id),
  variante    text        not null check (variante in ('A', 'B')),
  -- A: planes al ingreso · B: planes después de navegar entre dimensiones
  evento      text        not null,
  -- ej.: ingreso, vista_dimension, busqueda, filtro, contacto_whatsapp, vista_planes, seleccion_plan
  dimension   text        check (dimension in ('servicios', 'espacios', 'orientacion')),
  detalle     jsonb       not null default '{}'::jsonb
);

create index if not exists eventos_usuario_idx on public.eventos (usuario_id);
create index if not exists eventos_sesion_idx  on public.eventos (sesion_id);

-- Seguridad: cada usuario solo puede insertar sus propios eventos; nadie los lee desde el cliente.
alter table public.eventos enable row level security;

create policy "insertar eventos propios"
  on public.eventos for insert
  to authenticated
  with check (usuario_id = auth.uid());
