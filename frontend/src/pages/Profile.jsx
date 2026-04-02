import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout, updateUser, api } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
      
      const fetchFavorites = async () => {
        try {
          const response = await api.get('/favorites');
          setFavorites(response.data);
        } catch (err) {
          console.error('Failed to fetch favorites.', err);
        }
      };

      fetchFavorites();
    }
  }, [user, api]);

  if (!user) {
    return <div className="p-10 text-center">Chargement...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await updateUser({ name: formData.name, email: formData.email });
      setMessage('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center pt-10 px-4">
      <div className="bg-white p-8 shadow-lg w-full max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gov-primary/10 p-4 text-4xl">👤</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mon Profil</h1>
            <p className="text-gray-500">Mettez à jour vos informations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nom complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border-none focus:ring-2 focus:ring-gov-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Adresse e-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border-none focus:ring-2 focus:ring-gov-primary outline-none transition-all"
            />
          </div>

          {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gov-accent text-white font-bold py-3 shadow-lg shadow-gov-accent/20 active:scale-95 transition-transform"
          >
            Enregistrer les modifications
          </button>
        </form>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mes articles favoris</h2>
          {favorites.length > 0 ? (
            <ul className="space-y-2">
              {favorites.map(fav => (
                <li key={fav.id}>
                  <Link to={`/articles/${fav.id}`} className="block hover:bg-gray-50 p-2">
                    {fav.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Vous n'avez pas encore d'articles favoris.</p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
           <Link 
            to="/change-password" 
            className="block text-center w-full bg-gray-100 text-gray-700 font-bold py-3 hover:bg-gray-200 transition-colors"
          >
            Changer de mot de passe
          </Link>
          
          <button 
            onClick={logout} 
            className="w-full bg-red-50 text-red-500 font-bold py-3 hover:bg-red-100 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
