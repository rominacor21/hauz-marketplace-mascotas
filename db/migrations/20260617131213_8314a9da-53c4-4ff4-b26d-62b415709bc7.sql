DROP POLICY IF EXISTS "eventos_insert_anyone" ON public.eventos;

CREATE POLICY "eventos_insert_self_or_anon" ON public.eventos
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()
  );
