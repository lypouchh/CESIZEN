import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminRegister() {
  const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '', password: '', secret_code: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { api } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register-admin-secret', formData);
      setMessage('Admin créé ! Redirection...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Si Laravel renvoie des erreurs de validation (422)
      if (err.response?.status === 422 && err.response.data.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setMessage(firstError);
      } else {
        setMessage(err.response?.data?.message || 'Une erreur est survenue lors de la connexion au serveur.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4">
        <h1 className="text-2xl font-black text-red-600 uppercase tracking-tighter">Initialisation Admin</h1>
        <input type="text" placeholder="Prénom" className="w-full p-3 border rounded-xl" 
               onChange={e => setFormData({...formData, firstname: e.target.value})} required />
        <input type="text" placeholder="Nom" className="w-full p-3 border rounded-xl" 
               onChange={e => setFormData({...formData, lastname: e.target.value})} required />
        <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" 
               onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Mot de passe" className="w-full p-3 border rounded-xl" 
               onChange={e => setFormData({...formData, password: e.target.value})} required />
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <label className="block text-xs font-bold text-red-400 uppercase mb-1">Code Maître de Sécurité</label>
          <input type="password" placeholder="Entrez le code du fichier .env" className="w-full p-2 border-red-200 border rounded-lg focus:ring-red-500" 
                 onChange={e => setFormData({...formData, secret_code: e.target.value})} required />
        </div>
        {message && <p className="text-center font-bold text-sm">{message}</p>}
        <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors">
          Générer le compte privilège
        </button>
      </form>
    </div>
  );
}

export default AdminRegister;