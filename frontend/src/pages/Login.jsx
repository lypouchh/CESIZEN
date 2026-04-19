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
    <div className="min-h-[80vh] flex flex-col justify-center px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-cesi-primary">Connexion</h2>
        <p className="text-gray-600 mt-2 text-sm">Accédez à votre espace personnel</p>
      </div>

      {error && <div className="bg-red-50 text-cesi-error p-3 border border-red-200 mb-4 text-sm text-center">{error}</div>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-cesi-dark mb-2">Adresse e-mail</label>
          <input 
            id="login-email"
            type="email" 
            placeholder="votre@email.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-1 focus:ring-cesi-primary outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-cesi-dark mb-2">Mot de passe</label>
          <input 
            id="login-password"
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-1 focus:ring-cesi-primary outline-none transition-all"
          />
        </div>

        <button type="submit" className="bg-cesi-accent text-white font-medium py-3 border-2 border-cesi-accent hover:bg-cesi-primary hover:border-cesi-primary transition-colors mt-4">
          Se connecter
        </button>
      </form>

      <div className="mt-8 text-center flex flex-col gap-2">
        <p className="text-sm text-gray-600">
          Pas encore de compte ? 
          <Link to="/register" className="text-cesi-primary font-medium ml-1 hover:underline">Créer un compte</Link>
        </p>
        <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-cesi-primary transition-colors">
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
}