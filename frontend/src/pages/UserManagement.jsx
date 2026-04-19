import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const { api, user: currentUser } = useAuth(); // On récupère l'instance API et l'utilisateur courant

  const isAdminRow = (u) => (u?.role?.nom || '').toLowerCase() === 'admin' || u.id_role === 1;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      const payload = Array.isArray(res.data) ? { users: res.data, currentAdmin: { isSuperAdmin: false } } : res.data;
      const currentId = currentUser?.id;
      const list = payload.users || [];

      setIsSuperAdmin(Boolean(payload.currentAdmin?.isSuperAdmin));
      setUsers(currentId ? list.filter(u => u.id !== currentId) : list);
      setError('');
    } catch {
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  }, [api, currentUser?.id]);

  const deleteUser = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
        setSuccess('Compte supprimé avec succès.');
      } catch {
        setError('Erreur lors de la suppression de l\'utilisateur.');
      }
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/status`);
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === id ? res.data : u)
      );
      setSuccess('Statut utilisateur mis à jour.');
    } catch {
      setError('Erreur lors du changement de statut de l\'utilisateur.');
    }
  };

  const createSubAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/admin/admins', newAdmin);
      setSuccess('Admin subordonné créé avec succès.');
      setNewAdmin({ firstname: '', lastname: '', email: '', password: '', password_confirmation: '' });
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de créer l\'admin subordonné.');
    }
  };

  // On charge les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // On recharge si l'utilisateur courant change

  return (
    <>
      {loading && <p>Chargement des utilisateurs...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3">{error}</p>}
      {success && <p className="text-green-700 bg-green-100 p-3">{success}</p>}

      {isSuperAdmin && (
        <form onSubmit={createSubAdmin} className="mb-6 bg-white border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-3 text-cesi-dark">Créer un admin subordonné</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Prénom"
              value={newAdmin.firstname}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, firstname: e.target.value }))}
              className="border border-cesi-border p-2 rounded"
              required
            />
            <input
              placeholder="Nom"
              value={newAdmin.lastname}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, lastname: e.target.value }))}
              className="border border-cesi-border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
              className="border border-cesi-border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
              className="border border-cesi-border p-2 rounded"
              minLength={8}
              required
            />
            <input
              type="password"
              placeholder="Confirmation du mot de passe"
              value={newAdmin.password_confirmation}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, password_confirmation: e.target.value }))}
              className="border border-cesi-border p-2 rounded md:col-span-2"
              minLength={8}
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-cesi-primary text-white px-4 py-2 rounded hover:bg-cesi-secondary transition">
            Créer l'admin
          </button>
        </form>
      )}

      {!loading && !error && (
        <div className="bg-white shadow-sm overflow-hidden border">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Nom</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={`border-b hover:bg-gray-50 ${!u.isActive ? 'opacity-50' : ''}`}>
                  <td className="p-4 font-medium">{`${u.firstname} ${u.lastname}`}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    {isAdminRow(u) ? (
                      <span className="font-bold text-red-600">{u.isSuperAdmin ? '🛡️ Super Admin' : '🔴 Admin'}</span>
                    ) : (
                      <span className="text-gray-700">👤 Utilisateur</span>
                    )}
                  </td>
                  <td className="p-4 space-x-4">
                    {(!isAdminRow(u) || isSuperAdmin) && !u.isSuperAdmin && (
                      <>
                        <button 
                          onClick={() => toggleUserStatus(u.id)} 
                          className={`font-bold ${u.isActive ? 'text-orange-500 hover:underline' : 'text-green-500 hover:underline'}`}
                        >
                          {u.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline font-bold">Supprimer</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
export default UserManagement;