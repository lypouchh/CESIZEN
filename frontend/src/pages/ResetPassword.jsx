import { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email'); // On récupère l'email passé dans l'URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { api } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/reset-password', {
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
    <div className="min-h-screen bg-gov-primary flex items-center justify-center py-12 px-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gov-light-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gov-light-blue rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h1>
            <p className="text-gray-600">Saisissez votre nouveau mot de passe.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gov-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gov-primary transition-colors"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>

            {message && <p className="text-green-600 text-sm font-medium text-center">{message}</p>}
            {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gov-accent text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all active:scale-95"
            >
              Réinitialiser le mot de passe
            </button>
          </form>
        </div>
        <div className="text-center mt-6">
          <Link to="/login" className="text-white hover:text-gray-100 transition-colors">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;