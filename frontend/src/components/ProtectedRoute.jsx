// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Allow access if logged in
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is admin, only allow /admin
  if (user?.role === 'admin') {
    if (location.pathname !== '/admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  // Otherwise, allow regular users to proceed
  return children;
};