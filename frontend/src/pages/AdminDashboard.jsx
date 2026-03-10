import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:8000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gestion des Utilisateurs</h1>
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
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{u.firstname} {u.lastname}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.id_role === 1 ? '🔴 Admin' : '👤 Utilisateur'}</td>
                <td className="p-4">
                  {u.id_role !== 1 && (
                    <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline font-bold">Supprimer</button>
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