-- Script to create the first admin user
-- Replace 'user-email@example.com' with the actual email of the user you want to make admin

-- First, find the user_id from auth.users table (run this to get the user_id)
-- SELECT id, email FROM auth.users WHERE email = 'user-email@example.com';

-- Then, insert admin role (replace the UUID with the actual user_id)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('your-user-id-here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the admin role was created
-- SELECT ur.*, p.display_name, au.email 
-- FROM user_roles ur 
-- JOIN profiles p ON ur.user_id = p.user_id 
-- JOIN auth.users au ON ur.user_id = au.id 
-- WHERE ur.role = 'admin';