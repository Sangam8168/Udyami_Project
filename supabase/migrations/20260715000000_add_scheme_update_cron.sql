-- Create a function to manually trigger the update
CREATE OR REPLACE FUNCTION trigger_scheme_update()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- This function can be called manually to trigger scheme updates
  -- For automatic updates, use Supabase Dashboard's pg_cron or external cron services
  result := jsonb_build_object('success', true, 'message', 'Use Edge Function for updates');
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION trigger_scheme_update() TO authenticated;
