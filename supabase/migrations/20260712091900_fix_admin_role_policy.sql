-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.set_admin_role(UUID);

-- Create a security definer function to assign admin role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.set_admin_role(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the user's email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = target_user_id;
  
  -- Only allow admin role for whitelisted emails
  IF user_email NOT IN ('admin@udyami.com', 'sangam8168@gmail.com') THEN
    RAISE EXCEPTION 'Unauthorized: Email not in admin whitelist';
  END IF;
  
  -- Insert or update admin role using qualified column names
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.set_admin_role(UUID) TO authenticated;
