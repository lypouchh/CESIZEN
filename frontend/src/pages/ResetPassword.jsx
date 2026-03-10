import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email'); // On récupère l'email passé dans l'URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:8000/api/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage('Mot de passe réinitialisé ! Redirection vers la connexion...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-cesi-primary">Nouveau mot de passe</h2>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cesi-primary focus:border-cesi-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cesi-primary focus:border-cesi-primary"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-cesi-primary hover:bg-opacity-90"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;