import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-cesi-primary">Bon retour parmi nous</h2>
        <p className="text-gray-500 mt-2 text-sm text-balance">Connectez-vous pour suivre vos progrès et vos émotions.</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email</label>
          <input 
            type="email" 
            placeholder="votre@email.com"
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Mot de passe</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
          />
        </div>

        <button className="bg-cesi-accent text-white font-bold py-4 rounded-xl shadow-lg shadow-cesi-accent/20 mt-4 active:scale-95 transition-transform">
          Se connecter
        </button>
      </form>

      <div className="mt-8 text-center flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          Pas encore de compte ? 
          <Link to="/register" className="text-cesi-primary font-bold ml-1">Inscrivez-vous</Link>
        </p>
        <Link to="/forgot-password" title="Récupérer mon mot de passe" className="text-xs text-gray-400 hover:text-cesi-primary transition-colors">
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
}