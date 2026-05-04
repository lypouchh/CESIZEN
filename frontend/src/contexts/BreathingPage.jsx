import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
// Tu devras créer ce composant d'animation, comme vu précédemment
// import BreathingAnimation from '../components/breathing/BreathingAnimation'; 

// En attendant, on simule l'animation
const BreathingAnimation = ({ duration, onEnd }) => {
  React.useEffect(() => {
    const timer = setTimeout(onEnd, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, onEnd]);
  return <div>Animation de respiration en cours...</div>;
};

const BreathingPage = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [isExercising, setIsExercising] = useState(false);
  const EXERCISE_DURATION = 180; // 3 minutes

  const handleSessionEnd = async () => {
    try {
      await api.post('/breathing-sessions', { duration_seconds: EXERCISE_DURATION });
      alert('Session enregistrée !');
    } catch (error) {
      console.error("Erreur enregistrement session:", error);
    } finally {
      navigate('/history'); // Redirige vers l'historique
    }
  };

  return isExercising ? (
    <BreathingAnimation duration={EXERCISE_DURATION} onEnd={handleSessionEnd} />
  ) : (
    <button onClick={() => setIsExercising(true)}>Commencer l'exercice</button>
  );
};

export default BreathingPage;