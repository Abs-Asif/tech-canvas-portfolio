
-- Junction table: which premium fonts each API key grants access to
CREATE TABLE public.font_api_key_fonts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid NOT NULL REFERENCES public.font_api_keys(id) ON DELETE CASCADE,
  font_id text NOT NULL,
  UNIQUE(api_key_id, font_id)
);

ALTER TABLE public.font_api_key_fonts ENABLE ROW LEVEL SECURITY;

-- Admins can manage font permissions
CREATE POLICY "Admins can manage font permissions"
  ON public.font_api_key_fonts
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own font permissions (via join to font_api_keys)
CREATE POLICY "Users can view own font permissions"
  ON public.font_api_key_fonts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.font_api_keys
      WHERE font_api_keys.id = font_api_key_fonts.api_key_id
        AND font_api_keys.user_id = auth.uid()
    )
  );
