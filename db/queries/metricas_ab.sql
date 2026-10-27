-- Métricas del experimento del MVP de Hauz sobre el esquema real (db/migrations).
-- Eventos que registra el frontend en public.eventos:
--   sesion_inicio, registro_completo, ver_planes, elegir_plan, ver_dimension, click_whatsapp
-- Cada evento guarda session_id, user_id (si hay), variante A/B, dimensión y detalle.

-- 1. Hipótesis central: % de sesiones que consultaron más de una dimensión (criterio: 60 % o más).
with dimensiones_por_sesion as (
  select session_id, count(distinct dimension) as dimensiones
  from public.eventos
  where evento = 'ver_dimension'
  group by session_id
)
select
  count(*)                                     as sesiones_activas,
  count(*) filter (where dimensiones > 1)      as sesiones_uso_cruzado,
  round(100.0 * count(*) filter (where dimensiones > 1) / nullif(count(*), 0), 1) as pct_uso_cruzado
from dimensiones_por_sesion;

-- 2. Lo mismo por usuario registrado, con analytics_events (la tabla que usa el panel /admin).
with secciones as (
  select user_id, count(distinct section_visited) as dimensiones
  from public.analytics_events
  where section_visited in ('espacios', 'servicios', 'orientacion')
  group by user_id
)
select count(*) as usuarios_activos,
       count(*) filter (where dimensiones > 1) as usaron_mas_de_una,
       round(100.0 * count(*) filter (where dimensiones > 1) / nullif(count(*), 0), 1) as pct
from secciones;

-- 3. Dimensión de entrada: la primera que mira cada sesión.
select dimension as dimension_de_entrada, count(*) as sesiones
from (
  select distinct on (session_id) session_id, dimension
  from public.eventos
  where evento = 'ver_dimension'
  order by session_id, creado_en
) primera
group by dimension
order by sesiones desc;

-- 4. Embudo por variante: sesión, registro, planes vistos y plan elegido.
select
  variante,
  count(distinct session_id) filter (where evento = 'sesion_inicio')     as sesiones,
  count(distinct session_id) filter (where evento = 'registro_completo') as registros,
  count(distinct session_id) filter (where evento = 'ver_planes')        as vieron_planes,
  count(distinct session_id) filter (where evento = 'elegir_plan')       as eligieron_plan,
  count(distinct session_id) filter (where evento = 'elegir_plan'
                                       and detalle ->> 'plan' = 'Plan Integrado') as eligieron_integrado
from public.eventos
group by variante
order by variante;

-- 5. Intención de contratar: clics en WhatsApp.
select count(*) as clics_whatsapp,
       count(distinct session_id) as sesiones_con_clic
from public.eventos
where evento = 'click_whatsapp';
