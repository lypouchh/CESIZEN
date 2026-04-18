import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();

  if (user === null) {
    // Pendant que l'utilisateur charge, on n'affiche rien ou un spinner
    // Rediriger immédiatement pourrait causer un flash de contenu non désiré
    return <div className="p-10 text-center">Vérification de l'autorisation...</div>;
  }

  // Si l'utilisateur est chargé et qu'il n'est pas admin, on redirige
  if (user.role?.nom !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est un admin, on affiche le contenu de la route
  return <Outlet />;
};

export default AdminRoute;
