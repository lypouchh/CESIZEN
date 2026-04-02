import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ChangePassword() {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { api } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/change-password', {
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation,
      });

      setMessage('Mot de passe modifié avec succès !');
      setFormData({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gov-primary">Changer mon mot de passe</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Mot de passe actuel</label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              required
              className="w-full p-4 bg-gray-50 border-none focus:ring-2 focus:ring-gov-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nouveau mot de passe</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              className="w-full p-4 bg-gray-50 border-none focus:ring-2 focus:ring-gov-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              name="new_password_confirmation"
              value={formData.new_password_confirmation}
              onChange={handleChange}
              required
              className="w-full p-4 bg-gray-50 border-none focus:ring-2 focus:ring-gov-primary outline-none transition-all"
            />
          </div>

          {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gov-accent text-white font-bold py-4 shadow-lg shadow-gov-accent/20 mt-4 active:scale-95 transition-transform"
          >
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;