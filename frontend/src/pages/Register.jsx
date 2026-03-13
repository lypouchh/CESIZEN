import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation pour créer un compte.");
      return;
    }
    setError('');
    try {
      await register(firstName, lastName, email, password, passwordConfirmation);
      navigate('/profile');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de l'inscription. Vérifiez que le backend est lancé.");
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center px-8 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-cesi-primary">Créer un compte</h2>
        <p className="text-gray-500 mt-2 text-sm">Rejoignez la communauté CESIZEN pour mieux gérer votre stress.</p>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Prénom</label>
            <input 
              type="text" 
              placeholder="Jean"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nom</label>
            <input 
              type="text" 
              placeholder="Dupont"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
            />
          </div>
        </div>

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

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Confirmation</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 px-1">
          <input 
            type="checkbox" 
            id="terms" 
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-cesi-primary focus:ring-cesi-primary cursor-pointer accent-cesi-primary"
          />
          <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer select-none">
            J'accepte les <Link to="/terms" className="text-cesi-primary font-bold hover:underline" target="_blank">conditions d'utilisation</Link>
          </label>
        </div>

        <button type="submit" className="bg-cesi-accent text-white font-bold py-4 rounded-xl shadow-lg shadow-cesi-accent/20 mt-4 active:scale-95 transition-transform">
          S'inscrire
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Déjà un compte ? 
          <Link to="/login" className="text-cesi-primary font-bold ml-1">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}