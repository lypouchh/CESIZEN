import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { api, user: currentUser } = useAuth(); // On récupère l'instance API et l'utilisateur courant

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      // On filtre l'utilisateur courant de la liste pour qu'il ne puisse pas se supprimer
      setUsers(res.data.filter(u => u.id !== currentUser.id));
      setError('');
    } catch (err) {
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  }, [api, currentUser.id]);

  const deleteUser = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
      } catch (err) {
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
    } catch (err) {
      setError('Erreur lors du changement de statut de l\'utilisateur.');
    }
  };

  // On charge les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // On recharge si l'utilisateur courant change

  return (
    <>
      {loading && <p>Chargement des utilisateurs...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
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
                <tr key={u.id} className={`border-b hover:bg-gray-50 ${!u.is_active ? 'opacity-50' : ''}`}>
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    {u.role.nom === 'admin' ? (
                      <span className="font-bold text-red-600">🔴 Admin</span>
                    ) : (
                      <span className="text-gray-700">👤 Utilisateur</span>
                    )}
                  </td>
                  <td className="p-4 space-x-4">
                    {/* On ne peut pas modifier un admin */}
                    {u.role.nom !== 'admin' && (
                      <>
                        <button 
                          onClick={() => toggleUserStatus(u.id)} 
                          className={`font-bold ${u.is_active ? 'text-orange-500 hover:underline' : 'text-green-500 hover:underline'}`}
                        >
                          {u.is_active ? 'Désactiver' : 'Activer'}
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