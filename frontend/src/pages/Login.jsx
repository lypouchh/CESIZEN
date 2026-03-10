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
        <h2 className="text-2xl font-bold text-cesi-primary">Bon retour parmi nous</h2>
        <p className="text-gray-500 mt-2 text-sm text-balance">Connectez-vous pour suivre vos progrès et vos émotions.</p>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email</label>
          <input 
            type="email" 
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Mot de passe</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
          />
        </div>

        <button type="submit" className="bg-cesi-accent text-white font-bold py-4 rounded-xl shadow-lg shadow-cesi-accent/20 mt-4 active:scale-95 transition-transform">
          Se connecter
        </button>
      </form>

      <div className="mt-8 text-center flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          Pas encore de compte ? 
          <Link to="/register" className="text-cesi-primary font-bold ml-1">Inscrivez-vous</Link>
        </p>
        <Link to="/forgot-password" title="Récupérer mon mot de passe" className="text-xs text-gray-400 hover:text-cesi-primary transition-colors mt-2">
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
}