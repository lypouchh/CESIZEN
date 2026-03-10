import { useState } from 'react';
import axios from 'axios';

function ChangePassword() {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // On récupère le token de session (stocké lors du login)
      const token = localStorage.getItem('token'); 
      
      await axios.post('http://localhost:8000/api/change-password', {
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation,
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      setMessage('Mot de passe modifié avec succès !');
      setFormData({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-center text-2xl font-bold text-cesi-primary">Changer mon mot de passe</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Mot de passe actuel</label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              required
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
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
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
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
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
            />
          </div>

          {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-cesi-accent text-white font-bold py-4 rounded-xl shadow-lg shadow-cesi-accent/20 mt-4 active:scale-95 transition-transform"
          >
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;