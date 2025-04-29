import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useUserAuth from '../hooks/useUserAuth';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const PrivateRoute = () => {
  const user = useUserAuth();

  if (user === null) {
    // Aún cargando el estado de autenticación
    return <LoadingSpinner fullScreen />;
  }

  if (user === undefined) {
    // Usuario no autenticado, redirigir a login
    return <Navigate to="/login" replace />;
  }

  // Usuario autenticado, renderizar rutas hijas
  return <Outlet />;
};

export default PrivateRoute;