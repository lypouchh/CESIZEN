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
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Compte</p>
          <h1 className="text-2xl font-bold text-cesi-primary">Changer mon mot de passe</h1>
        </div>
        <div className="gov-card">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-cesi-dark mb-1">Mot de passe actuel</label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cesi-dark mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cesi-dark mb-1">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              name="new_password_confirmation"
              value={formData.new_password_confirmation}
              onChange={handleChange}
              required
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
            />
          </div>

          {message && <p className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm">{message}</p>}
          {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</p>}

          <button
            type="submit"
            className="gov-button w-full"
          >
            Mettre à jour
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;