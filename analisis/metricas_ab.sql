-- Métricas del experimento del MVP de Hauz, calculadas sobre public.eventos.

-- 1. Hipótesis central: % de usuarios que consultó más de una dimensión (criterio de éxito: 60 % o más).
with dimensiones_por_usuario as (
  select usuario_id, count(distinct dimension) as dimensiones
  from public.eventos
  where dimension is not null
  group by usuario_id
)
select
  count(*)                                          as usuarios,
  count(*) filter (where dimensiones > 1)           as usuarios_uso_cruzado,
  round(100.0 * count(*) filter (where dimensiones > 1) / count(*), 1) as pct_uso_cruzado
from dimensiones_por_usuario;

-- 2. Dimensión de entrada: la primera dimensión que consulta cada usuario.
select dimension as dimension_de_entrada, count(*) as usuarios
from (
  select distinct on (usuario_id) usuario_id, dimension
  from public.eventos
  where dimension is not null
  order by usuario_id, creado_en
) primera
group by dimension
order by usuarios desc;

-- 3. Búsquedas por sesión.
select round(avg(busquedas), 2) as busquedas_promedio_por_sesion
from (
  select sesion_id, count(*) filter (where evento = 'busqueda') as busquedas
  from public.eventos
  group by sesion_id
) s;

-- 4. Selección de plan por variante del A/B.
select
  variante,
  count(distinct usuario_id)                                                   as usuarios,
  count(distinct usuario_id) filter (where evento = 'seleccion_plan'
                                       and detalle ->> 'plan' = 'integrado')  as eligieron_integrado
from public.eventos
group by variante
order by variante;
