CREATE TABLE public.eventos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creado_en timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  user_id uuid,
  variante text,
  evento text NOT NULL,
  dimension text,
  detalle jsonb
);

GRANT INSERT ON public.eventos TO anon, authenticated;
GRANT ALL ON public.eventos TO service_role;

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eventos_insert_anyone" ON public.eventos
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_eventos_session ON public.eventos(session_id);
CREATE INDEX idx_eventos_variante ON public.eventos(variante);
CREATE INDEX idx_eventos_evento ON public.eventos(evento);
