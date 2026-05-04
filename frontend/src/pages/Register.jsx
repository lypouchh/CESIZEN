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
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <section className="gov-card w-full max-w-2xl p-6 md:p-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wide text-gray-500">Creation de compte</p>
          <h2 className="text-3xl font-bold text-cesi-primary mt-2">Creer un compte</h2>
          <p className="text-gray-600 mt-2 text-sm">Rejoignez la plateforme CESIZEN.</p>
        </div>

        {error && <div className="bg-red-50 text-cesi-error p-3 border border-red-200 mb-4 text-sm">{error}</div>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="register-firstname" className="block text-sm font-semibold text-cesi-dark mb-2">Prénom</label>
              <input 
                id="register-firstname"
                type="text" 
                placeholder="Jean"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-2 focus:ring-blue-200 outline-none transition-all gov-focus"
              />
            </div>
            <div>
              <label htmlFor="register-lastname" className="block text-sm font-semibold text-cesi-dark mb-2">Nom</label>
              <input 
                id="register-lastname"
                type="text" 
                placeholder="Dupont"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-2 focus:ring-blue-200 outline-none transition-all gov-focus"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-semibold text-cesi-dark mb-2">Adresse e-mail</label>
            <input 
              id="register-email"
              type="email" 
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-2 focus:ring-blue-200 outline-none transition-all gov-focus"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-semibold text-cesi-dark mb-2">Mot de passe</label>
            <input 
              id="register-password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-2 focus:ring-blue-200 outline-none transition-all gov-focus"
            />
          </div>

          <div>
            <label htmlFor="register-password-confirmation" className="block text-sm font-semibold text-cesi-dark mb-2">Confirmation du mot de passe</label>
            <input 
              id="register-password-confirmation"
              type="password" 
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full p-3 bg-white border border-cesi-border focus:border-cesi-primary focus:ring-2 focus:ring-blue-200 outline-none transition-all gov-focus"
            />
          </div>

          <div className="flex items-center gap-3 px-1">
            <input 
              type="checkbox" 
              id="terms" 
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 border border-cesi-border text-cesi-primary focus:ring-cesi-primary cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
              J'accepte les <Link to="/terms" className="text-cesi-primary font-semibold hover:underline gov-focus">conditions d'utilisation</Link>
            </label>
          </div>

          <button type="submit" className="gov-button py-3 mt-2 gov-focus">
            Créer mon compte
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-700">
          <p>
            Deja un compte ?
            <Link to="/login" className="text-cesi-primary font-semibold ml-1 hover:underline gov-focus">Se connecter</Link>
          </p>
        </div>
      </section>
    </div>
  );
}