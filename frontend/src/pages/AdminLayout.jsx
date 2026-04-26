import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navLinkClasses = ({ isActive }) =>
    `py-2 px-4 text-sm font-semibold border-b-2 transition-colors ${
      isActive
        ? 'border-cesi-primary text-cesi-primary'
        : 'border-transparent text-gray-600 hover:text-cesi-primary hover:border-cesi-primary'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 border-b border-cesi-border">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Espace administration</p>
        <nav className="flex items-center space-x-6 -mb-px">
          <NavLink to="/admin/users" className={navLinkClasses}>
            Gestion des Utilisateurs
          </NavLink>
          <NavLink to="/admin/articles" className={navLinkClasses}>
            Gestion des Articles
          </NavLink>
        </nav>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
