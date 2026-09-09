-- Contact requests are write-only from the server (service role). These
-- explicit policies document that no anon/authenticated client may read or
-- write the table directly, replacing the implicit "RLS on, no policy" state.
CREATE POLICY "No client reads of contact requests"
  ON public.contact_requests
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "No client writes of contact requests"
  ON public.contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);