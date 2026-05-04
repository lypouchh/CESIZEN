import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const { api } = useAuth();

  const fetchUsers = async () => {
    const res = await api.get('/admin/users');
    const payload = Array.isArray(res.data) ? { users: res.data } : res.data;
    setUsers(payload.users || []);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Administration</p>
        <h1 className="text-3xl font-bold text-cesi-primary">Gestion des Utilisateurs</h1>
      </div>
      <div className="gov-card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-cesi-border">
            <tr>
              <th className="p-4 text-sm font-semibold text-cesi-dark">Nom</th>
              <th className="p-4 text-sm font-semibold text-cesi-dark">Email</th>
              <th className="p-4 text-sm font-semibold text-cesi-dark">Rôle</th>
              <th className="p-4 text-sm font-semibold text-cesi-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-cesi-border hover:bg-gray-50">
                <td className="p-4">{u.firstname} {u.lastname}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold uppercase px-2 py-1 border ${
                    u.id_role === 1
                      ? 'border-cesi-primary text-cesi-primary bg-blue-50'
                      : 'border-gray-300 text-gray-600 bg-gray-50'
                  }`}>
                    {u.id_role === 1 ? 'Admin' : 'Utilisateur'}
                  </span>
                </td>
                <td className="p-4">
                  {u.id_role !== 1 && (
                    <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:underline font-semibold text-sm">Supprimer</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AdminDashboard;