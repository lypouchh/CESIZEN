import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const HistoryPage = () => {
  const { api } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/breathing-sessions')
      .then(response => {
        setSessions(response.data);
      })
      .catch(err => {
        setError('Impossible de charger l\'historique.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api]);

  if (loading) return <div>Chargement de l'historique...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Historique des sessions</h1>
      {sessions.length === 0 ? (
        <p>Vous n'avez pas encore de session enregistrée.</p>
      ) : (
        <ul>
          {sessions.map(session => (
            <li key={session.id}>
              Le {new Date(session.created_at).toLocaleDateString('fr-FR')}
              - Durée : {Math.round(session.duration_seconds / 60)} minute(s)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPage;