import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navLinkClasses = ({ isActive }) => 
    `py-2 px-4 font-semibold ${isActive ? 'bg-gov-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <nav className="flex items-center space-x-4">
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
