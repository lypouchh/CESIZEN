import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Impossible de se connecter. Vérifiez le backend.");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <section className="gov-card w-full max-w-xl p-6 md:p-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wide text-gray-500">Authentification</p>
          <h2 className="mt-2 text-3xl font-bold text-cesi-primary">Connexion</h2>
          <p className="text-gray-600 mt-2 text-sm">Accedez a votre espace personnel.</p>
        </div>

        {error && <div className="bg-red-50 text-cesi-error p-3 border border-red-200 mb-4 text-sm">{error}</div>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold text-cesi-dark mb-2">Adresse e-mail</label>
            <input 
              id="login-email"
              type="email" 
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-2 focus:ring-blue-200 outline-none transition-all gov-focus"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold text-cesi-dark mb-2">Mot de passe</label>
            <input 
              id="login-password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-2 focus:ring-blue-200 outline-none transition-all gov-focus"
            />
          </div>

          <button type="submit" className="gov-button py-3 mt-2 gov-focus">
            Se connecter
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-700">
          <p>
            Pas encore de compte ?
            <Link to="/register" className="text-cesi-primary font-semibold ml-1 hover:underline gov-focus">Creer un compte</Link>
          </p>
          <Link to="/forgot-password" className="mt-2 inline-block text-gray-600 hover:text-cesi-primary transition-colors gov-focus">
            Mot de passe oublie ?
          </Link>
        </div>
      </section>
    </div>
  );
}