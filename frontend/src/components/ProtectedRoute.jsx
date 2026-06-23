import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import UserNotRegisteredError from '../components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-950">
    <div className="w-8 h-8 border-4 border-gray-700 border-t-yellow-500 rounded-full animate-spin" />
  </div>
);

export default function ProtectedRoute({
  
  fallback = <DefaultFallback />,
}) {
  const {
    isAuthenticated,
    isLoadingAuth,
    authChecked,
    authError,
    checkUserAuth,
  } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}