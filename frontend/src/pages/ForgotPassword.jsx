import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
      // On envoie la demande au backend
      await api.post('/forgot-password', { email });
      setMessage('Si cet email existe, un lien de récupération a été envoyé.');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Connexion</p>
          <h1 className="text-2xl font-bold text-cesi-primary">Mot de passe oublié</h1>
          <p className="text-gray-600 mt-1">Saisissez votre email pour recevoir un lien de réinitialisation.</p>
        </div>
        <div className="gov-card">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cesi-dark mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && <p className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm">{message}</p>}
          {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</p>}

          <button
            type="submit"
            className="gov-button w-full"
          >
            Envoyer le lien
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;