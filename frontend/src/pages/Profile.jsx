import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="min-h-[80vh] flex flex-col items-center pt-10 px-4">
      <div className="bg-white p-8 border border-cesi-border w-full max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-cesi-muted p-4 border border-cesi-border text-2xl">👤</div>
          <div>
            <h1 className="text-2xl font-bold text-cesi-dark">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="border-t border-cesi-border pt-6">
          <h3 className="font-bold text-cesi-dark mb-3">Mes statistiques</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-cesi-muted p-4 border border-cesi-border text-center">
              <span className="block text-2xl font-bold text-cesi-primary">0</span>
              <span className="text-xs text-gray-600 uppercase">Exercices</span>
            </div>
            <div className="bg-cesi-muted p-4 border border-cesi-border text-center">
              <span className="block text-2xl font-bold text-cesi-primary">0</span>
              <span className="text-xs text-gray-600 uppercase">Jours</span>
            </div>
          </div>
        </div>

        <button 
          onClick={logout} 
          className="w-full bg-red-50 text-red-600 font-medium py-3 border border-red-200 hover:bg-red-100 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
