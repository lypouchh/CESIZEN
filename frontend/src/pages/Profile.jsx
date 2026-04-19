import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProfileForm({ user, logout, updateUser, deleteAccount, navigate }) {
  const [firstname, setFirstname] = useState(user.firstname || '');
  const [lastname, setLastname] = useState(user.lastname || '');
  const [email, setEmail] = useState(user.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await updateUser({ firstname, lastname, email });
      setMessage('Profil mis à jour avec succès.');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de mettre à jour le profil.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer le compte.');
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center pt-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white p-8 border border-cesi-border shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cesi-dark">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations et votre compte.</p>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}
        {message && <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-4 text-green-700">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="profile-firstname" className="block text-sm font-medium text-cesi-dark mb-2">Prénom</label>
              <input
                id="profile-firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full p-3 border border-cesi-border rounded-lg focus:border-cesi-primary focus:ring-1 focus:ring-cesi-primary outline-none"
              />
            </div>

            <div>
              <label htmlFor="profile-lastname" className="block text-sm font-medium text-cesi-dark mb-2">Nom</label>
              <input
                id="profile-lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full p-3 border border-cesi-border rounded-lg focus:border-cesi-primary focus:ring-1 focus:ring-cesi-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-cesi-dark mb-2">Adresse e-mail</label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-cesi-border rounded-lg focus:border-cesi-primary focus:ring-1 focus:ring-cesi-primary outline-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="submit"
              className="w-full bg-cesi-primary text-white py-3 rounded-lg font-semibold hover:bg-cesi-secondary transition"
            >
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={() => navigate('/change-password')}
              className="w-full border border-cesi-border text-cesi-dark py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Changer le mot de passe
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-cesi-border pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-lg font-semibold hover:bg-red-100 transition"
          >
            Supprimer mon compte
          </button>
          <button
            type="button"
            onClick={logout}
            className="mt-4 w-full bg-cesi-muted text-cesi-dark border border-cesi-border py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <ProfileForm
      key={user.id}
      user={user}
      logout={logout}
      updateUser={updateUser}
      deleteAccount={deleteAccount}
      navigate={navigate}
    />
  );
}
