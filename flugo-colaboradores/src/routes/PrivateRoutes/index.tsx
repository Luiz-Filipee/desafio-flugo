import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import { useAuth } from '../../contexts/useAuth';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/login" />;
}
