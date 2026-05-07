-- ============================================
-- Relsoft Notify — pg_cron Setup
-- Run this AFTER deploying the app to Vercel
-- Replace the URL and CRON_SECRET with your values
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily notification check at 7:00 AM UTC
SELECT cron.schedule(
  'daily-expiry-check',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR-APP-URL.vercel.app/api/notifications/run',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "YOUR_CRON_SECRET"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- To view scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove the job:
-- SELECT cron.unschedule('daily-expiry-check');
