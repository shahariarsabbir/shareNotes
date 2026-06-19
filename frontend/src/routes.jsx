import { Navigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';

// Protected route wrapper
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading-page"><div className="spinner large" /></div>;

  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

// Public only (redirect if already logged in)
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner large" /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
};
