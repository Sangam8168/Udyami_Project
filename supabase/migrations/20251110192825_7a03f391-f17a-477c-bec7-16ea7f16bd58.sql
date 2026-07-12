-- Check if trigger exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger to ensure it fires on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();