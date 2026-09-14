-- ==========================================================
-- Ev Envanter & Garanti Takip - Hibrit Bildirim Kurulumu
-- ==========================================================

-- 1. Profiles tablosuna expo_push_token alanını ekleyin
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS expo_push_token TEXT;

-- 2. Push token arama ve erişim performansı için indeks
CREATE INDEX IF NOT EXISTS idx_profiles_expo_push_token ON public.profiles(expo_push_token);

-- ==========================================================
-- 3. Supabase pg_cron ile Her Gün Saat 09:00'da Edge Function Tetikleme
-- ==========================================================
-- Not: Supabase Dashboard -> Database -> Extensions alanından 'pg_cron' ve 'pg_net' eklentilerini açın.

-- Örnek Cron Tanımı (PROJECT_REF ve ANON_KEY değerlerinizi yazın):
/*
SELECT cron.schedule(
  'daily-warranty-notifications',
  '0 6 * * *', -- Her gün saat 06:00 UTC (TSİ 09:00)
  $$
  SELECT
    net.http_post(
      url:='https://<PROJECT_REF>.supabase.co/functions/v1/send-warranty-notifications',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);
*/
