import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Bonjour, {user?.firstname} !</h1>
      <p>Prêt pour une session de relaxation ?</p>
      
      <Link to="/breathing">
        <button style={{ padding: '15px 30px', fontSize: '1.2em', cursor: 'pointer' }}>
          Démarrer l'exercice
        </button>
      </Link>
    </div>
  );
};

export default HomePage;