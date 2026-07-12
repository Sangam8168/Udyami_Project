import { useLocation } from 'react-router-dom';
import { useUserRole } from './useUserRole';

export type InterfaceType = 'admin' | 'user' | 'public';

export const useInterfaceType = () => {
  const location = useLocation();
  const { role, isAdmin, loading } = useUserRole();

  // Check if current route is admin-related
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Check if current route is auth-related
  const isAdminAuth = location.pathname === '/admin-auth';
  const isUserAuth = location.pathname === '/auth';

  // Determine interface type
  const getInterfaceType = (): InterfaceType => {
    if (isAdminRoute || isAdminAuth) return 'admin';
    if (isUserAuth || role === 'user') return 'user';
    return 'public';
  };

  return {
    interfaceType: getInterfaceType(),
    isAdminInterface: isAdminRoute || isAdminAuth || isAdmin,
    isUserInterface: !isAdminRoute && !isAdminAuth && role === 'user',
    isPublicInterface: !role && !isAdminRoute && !isAdminAuth,
    currentRoute: location.pathname,
    userRole: role,
    isAdmin,
    loading,
  };
};