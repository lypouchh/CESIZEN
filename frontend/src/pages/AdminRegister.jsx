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
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Administration</p>
          <h1 className="text-2xl font-bold text-cesi-primary">Initialisation du compte administrateur</h1>
        </div>
        <form onSubmit={handleSubmit} className="gov-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cesi-dark mb-1">Prénom</label>
              <input type="text" className="w-full p-3 border border-cesi-border gov-focus outline-none"
                     onChange={e => setFormData({...formData, firstname: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-cesi-dark mb-1">Nom</label>
              <input type="text" className="w-full p-3 border border-cesi-border gov-focus outline-none"
                     onChange={e => setFormData({...formData, lastname: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cesi-dark mb-1">Email</label>
            <input type="email" className="w-full p-3 border border-cesi-border gov-focus outline-none"
                   onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-cesi-dark mb-1">Mot de passe</label>
            <input type="password" className="w-full p-3 border border-cesi-border gov-focus outline-none"
                   onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="bg-gray-50 p-4 border border-cesi-border">
            <label className="block text-sm font-medium text-cesi-dark mb-1">Code de sécurité maître</label>
            <p className="text-xs text-gray-500 mb-2">Valeur définie dans le fichier <code>.env</code> du serveur.</p>
            <input type="password" className="w-full p-3 border border-cesi-border gov-focus outline-none"
                   onChange={e => setFormData({...formData, secret_code: e.target.value})} required />
          </div>
          {message && <p className="p-3 bg-blue-50 border border-cesi-border text-cesi-dark text-sm text-center">{message}</p>}
          <button className="gov-button w-full">
            Créer le compte administrateur
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminRegister;