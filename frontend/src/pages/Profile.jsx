import { useEffect, useMemo, useState } from 'react';
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

  const handleLogout = async () => {
    await logout();
    navigate('/logged-out');
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
            onClick={handleLogout}
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
  const { user, logout, updateUser, deleteAccount, api } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await api.get(`/sessions?id_user=${user?.id}`);
      setSessions(res.data || []);
    } catch {
      setSessions([]);
    } finally {
      setSessionsLoaded(true);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const now = useMemo(() => new Date(), []);

  const { totalsByExercise, totalAll, calendarCells } = useMemo(() => {
    const totals = sessions.reduce((acc, session) => {
      const name = session.exercise?.name || `Exercice #${session.id_Exercise}`;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = (firstDay.getDay() + 6) % 7;

    const byDay = sessions.reduce((acc, session) => {
      const dateKey = new Date(session.date).toISOString().slice(0, 10);
      if (!acc[dateKey]) {
        acc[dateKey] = { total: 0, byExercise: {} };
      }
      const exerciseName = session.exercise?.name || `Exercice #${session.id_Exercise}`;
      acc[dateKey].total += 1;
      acc[dateKey].byExercise[exerciseName] = (acc[dateKey].byExercise[exerciseName] || 0) + 1;
      return acc;
    }, {});

    const cells = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const d = new Date(year, month, day);
      const dateKey = d.toISOString().slice(0, 10);
      cells.push({ day, dateKey, info: byDay[dateKey] || null });
    }

    return {
      totalsByExercise: totals,
      totalAll: sessions.length,
      calendarCells: cells,
    };
  }, [sessions, now]);

  if (!user) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="space-y-6">
      <ProfileForm
        key={user.id}
        user={user}
        logout={logout}
        updateUser={updateUser}
        deleteAccount={deleteAccount}
        navigate={navigate}
      />

      <section className="max-w-3xl mx-auto bg-white p-6 border border-cesi-border shadow-sm">
        <h2 className="text-2xl font-bold text-cesi-dark mb-4">Tableau de bord respiration</h2>
        {!sessionsLoaded && <p className="text-sm text-gray-500 mb-3">Chargement des sessions...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="p-4 border border-cesi-border bg-blue-50">
            <p className="text-sm text-gray-600">Total toutes séances</p>
            <div className="mt-2">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-600 text-white text-lg font-bold">
                {totalAll}
              </span>
            </div>
          </div>
          {Object.entries(totalsByExercise).map(([name, total]) => (
            <div key={name} className="p-4 border border-cesi-border bg-gray-50">
              <p className="text-sm text-gray-600">{name}</p>
              <div className="mt-2">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-cesi-primary text-white text-lg font-bold">
                  {total}
                </span>
              </div>
            </div>
          ))}
        </div>

        {sessionsLoaded && totalAll === 0 && (
          <p className="text-sm text-gray-500 mb-4">Aucune séance enregistrée pour le moment. Lance un exercice et reviens ici.</p>
        )}

        <h3 className="text-lg font-bold text-cesi-dark mb-3">Calendrier des séances ({now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })})</h3>
        <p className="text-xs text-gray-500 mb-3">Les jours avec séance sont entourés en bleu. Survole un jour pour voir le détail par type d'exercice.</p>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 mb-2">
          <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="h-10 border border-transparent" />;
            }

            const tooltip = cell.info
              ? `${cell.info.total} exercice(s) fait(s)`
              : 'Aucune séance';

            return (
              <div
                key={cell.dateKey}
                title={tooltip}
                className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm mx-auto transition-colors ${cell.info ? 'border-blue-600 bg-blue-600 text-white font-bold hover:bg-blue-700' : 'border-cesi-border text-gray-600 hover:bg-gray-100'}`}
              >
                {cell.day}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
