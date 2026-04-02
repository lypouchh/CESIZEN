import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { api } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/forgot-password', { email });
      setMessage('Si cet email existe, un lien de récupération a été envoyé.');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
            <p className="text-gray-600">Saisissez votre e-mail pour recevoir un lien de réinitialisation.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gov-primary transition-colors"
                placeholder="vous@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && <p className="text-green-600 text-sm font-medium text-center">{message}</p>}
            {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gov-accent text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all active:scale-95"
            >
              Envoyer le lien
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-white hover:text-gray-100 transition-colors">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;