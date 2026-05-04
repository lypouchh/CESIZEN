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
  const isCurrentUser = (u) => u?.id === currentUser?.id;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      const payload = Array.isArray(res.data) ? { users: res.data, currentAdmin: { isSuperAdmin: false } } : res.data;
      const list = payload.users || [];

      setIsSuperAdmin(Boolean(payload.currentAdmin?.isSuperAdmin));
      setUsers(list);
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
    <section className="gov-card p-6 md:p-8">
      <header className="mb-6 border-b border-cesi-border pb-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">Administration</p>
        <h1 className="text-2xl font-bold text-cesi-primary mt-2">Gestion des utilisateurs</h1>
      </header>

      {loading && <p>Chargement des utilisateurs...</p>}
      {error && <p className="text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
      {success && <p className="text-green-700 bg-green-50 border border-green-200 p-3">{success}</p>}

      {isSuperAdmin && (
        <form onSubmit={createSubAdmin} className="mb-6 bg-cesi-muted border border-cesi-border p-4">
          <h2 className="text-lg font-bold mb-3 text-cesi-dark">Créer un admin subordonné</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Prénom"
              value={newAdmin.firstname}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, firstname: e.target.value }))}
              className="border border-cesi-border p-2 gov-focus"
              required
            />
            <input
              placeholder="Nom"
              value={newAdmin.lastname}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, lastname: e.target.value }))}
              className="border border-cesi-border p-2 gov-focus"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
              className="border border-cesi-border p-2 gov-focus"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
              className="border border-cesi-border p-2 gov-focus"
              minLength={8}
              required
            />
            <input
              type="password"
              placeholder="Confirmation du mot de passe"
              value={newAdmin.password_confirmation}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, password_confirmation: e.target.value }))}
              className="border border-cesi-border p-2 md:col-span-2 gov-focus"
              minLength={8}
              required
            />
          </div>
          <button type="submit" className="mt-4 gov-button px-4 py-2 gov-focus">
            Créer l'admin
          </button>
        </form>
      )}

      {!isSuperAdmin && (
        <p className="mb-6 text-sm text-gray-600 bg-gray-50 border border-cesi-border p-3">
          Vous êtes admin subordonné: vous pouvez gérer les comptes utilisateurs, mais vous ne pouvez pas créer d'autre admin.
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-3 md:hidden">
            {users.map(u => (
              <article key={u.id} className={`gov-card p-4 ${!u.isActive ? 'opacity-50' : ''}`}>
                <p className="font-semibold text-cesi-dark">{`${u.firstname} ${u.lastname}`}</p>
                <p className="text-sm text-gray-600 mt-1">{u.email}</p>
                <p className="text-sm mt-2">
                  {isAdminRow(u) ? (
                    <span className="font-bold text-red-700">
                      {u.isSuperAdmin ? 'Super Admin' : 'Admin'}{isCurrentUser(u) ? ' (vous)' : ''}
                    </span>
                  ) : (
                    <span className="text-gray-700">Utilisateur{isCurrentUser(u) ? ' (vous)' : ''}</span>
                  )}
                </p>
                <div className="mt-3 flex flex-wrap gap-4">
                  {(!isCurrentUser(u) && !isAdminRow(u)) && (
                    <>
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`font-bold gov-focus text-sm ${u.isActive ? 'text-orange-600 hover:underline' : 'text-green-600 hover:underline'}`}
                      >
                        {u.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                      <button onClick={() => deleteUser(u.id)} className="text-red-700 hover:underline font-bold gov-focus text-sm">Supprimer</button>
                    </>
                  )}

                  {(isSuperAdmin && !isCurrentUser(u) && isAdminRow(u) && !u.isSuperAdmin) && (
                    <>
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`font-bold gov-focus text-sm ${u.isActive ? 'text-orange-600 hover:underline' : 'text-green-600 hover:underline'}`}
                      >
                        {u.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                      <button onClick={() => deleteUser(u.id)} className="text-red-700 hover:underline font-bold gov-focus text-sm">Supprimer</button>
                    </>
                  )}

                  {(isCurrentUser(u) || u.isSuperAdmin) && (
                    <span className="text-sm text-gray-500">Aucune action</span>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="bg-white overflow-hidden border border-cesi-border hidden md:block">
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
                      <span className="font-bold text-red-700">
                        {u.isSuperAdmin ? 'Super Admin' : 'Admin'}{isCurrentUser(u) ? ' (vous)' : ''}
                      </span>
                    ) : (
                      <span className="text-gray-700">Utilisateur{isCurrentUser(u) ? ' (vous)' : ''}</span>
                    )}
                  </td>
                  <td className="p-4 space-x-4">
                    {(!isCurrentUser(u) && !isAdminRow(u)) && (
                      <>
                        <button 
                          onClick={() => toggleUserStatus(u.id)} 
                          className={`font-bold gov-focus ${u.isActive ? 'text-orange-600 hover:underline' : 'text-green-600 hover:underline'}`}
                        >
                          {u.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="text-red-700 hover:underline font-bold gov-focus">Supprimer</button>
                      </>
                    )}

                    {(isSuperAdmin && !isCurrentUser(u) && isAdminRow(u) && !u.isSuperAdmin) && (
                      <>
                        <button 
                          onClick={() => toggleUserStatus(u.id)} 
                          className={`font-bold gov-focus ${u.isActive ? 'text-orange-600 hover:underline' : 'text-green-600 hover:underline'}`}
                        >
                          {u.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="text-red-700 hover:underline font-bold gov-focus">Supprimer</button>
                      </>
                    )}

                    {(isCurrentUser(u) || u.isSuperAdmin) && (
                      <span className="text-sm text-gray-500">Aucune action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </section>
  );
}
export default UserManagement;