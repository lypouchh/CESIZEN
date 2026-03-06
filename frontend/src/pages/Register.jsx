import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-[90vh] flex flex-col justify-center px-8 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-cesi-primary">Créer un compte</h2>
        <p className="text-gray-500 mt-2 text-sm">Rejoignez la communauté CESIZEN pour mieux gérer votre stress.</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Prénom</label>
            <input 
              type="text" 
              placeholder="Jean"
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nom</label>
            <input 
              type="text" 
              placeholder="Dupont"
              className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-cesi-primary outline-none transition-all"
            />
          </div>
        </div>

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