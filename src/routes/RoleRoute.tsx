import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

export default function RoleRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8 text-center text-slate-600">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!user || !allowedRoles.includes(user.role ?? 'CUSTOMER')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
