DROP POLICY IF EXISTS eventos_insert_self_or_anon ON public.eventos;
CREATE POLICY eventos_insert_any ON public.eventos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
