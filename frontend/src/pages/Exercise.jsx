import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MODES = {
  '748': { inhale: 7, hold: 4, exhale: 8, label: 'Sommeil (7-4-8)' },
  '55': { inhale: 5, hold: 0, exhale: 5, label: 'Équilibre (5-5)' },
  '46': { inhale: 4, hold: 0, exhale: 6, label: 'Relaxation (4-6)' }
};

export default function Exercise() {
  const [selectedMode, setSelectedMode] = useState('55');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Prêt ?'); // Inhale, Hold, Exhale
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [targetRepetitions, setTargetRepetitions] = useState(5);
  const [currentRepetition, setCurrentRepetition] = useState(0);
  const [message, setMessage] = useState('');
  
  const { user, api } = useAuth();
  
  // On récupère les infos du mode actuel
  const currentMode = MODES[selectedMode];

  // Fonction pour sauvegarder la session
  const saveSession = async (duration, breathingRate) => {
    if (!user) return;

    try {
      const exerciseId = selectedMode === '55' ? 1 : selectedMode === '46' ? 2 : 3; // Mapping des modes aux exercises

      await api.post('/sessions', {
        duration: Math.round(duration),
        breathingRate,
        id_user: user.id,
        id_Exercise: exerciseId,
      });

      setMessage('✅ Session sauvegardée avec succès !');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Fonction pour démarrer/arrêter l'exercice
  const completeSession = () => {
    const duration = sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0;
    const breathingRate = selectedMode === '55' ? 6 : selectedMode === '46' ? 5 : 4;

    if (duration > 10 && user) {
      saveSession(duration, breathingRate);
    }

    setSessionStartTime(null);
    setIsActive(false);
  };

  const toggleExercise = () => {
    if (isActive) {
      completeSession();
    } else {
      setSessionStartTime(Date.now());
      setCurrentRepetition(0);
      setMessage('');
      setIsActive(true);
    }
  };

  // Calcul du scale factor pour une animation plus fluide
  const getScaleFactor = () => {
    if (!isActive) return 1;
    if (phase === 'Inspirez') return 1.4; // Grossit pendant l'inspiration
    if (phase === 'Bloquez') return 1.4; // Reste gros pendant le blocage
    if (phase === 'Expirez') return 0.8; // Rétrécit pendant l'expiration
    return 1;
  };

  // Durée de transition fixe pour fluidité (2 secondes pour plus de douceur)
  const transitionDuration = '2000ms';

  useEffect(() => {
    let interval = null;
    let t1 = null;
    let t2 = null;
    let completedCycles = 0;

    if (isActive) {
      const mode = currentMode;
      
      const runCycle = () => {
        completedCycles += 1;
        setCurrentRepetition(completedCycles);

        if (completedCycles > targetRepetitions) {
          return;
        }

        setPhase('Inspirez');
        t1 = setTimeout(() => {
          if (mode.hold > 0) {
            setPhase('Bloquez');
            t2 = setTimeout(() => {
              setPhase('Expirez');
            }, mode.hold * 1000);
          } else {
            setPhase('Expirez');
          }
        }, mode.inhale * 1000);
      };

      runCycle();
      const cycleDuration = (mode.inhale + mode.hold + mode.exhale) * 1000;
      interval = setInterval(() => {
        if (completedCycles >= targetRepetitions) {
          clearInterval(interval);
          setPhase('Terminé');
          completeSession();
          return;
        }
        runCycle();
      }, cycleDuration);
    } else {
      setPhase('Prêt ?');
    }
    
    // Nettoyage complet pour éviter les bugs si on change de mode rapidement
    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isActive, selectedMode, currentMode, targetRepetitions]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cesi-primary">Cohérence Cardiaque</h2>
        <p className="text-gray-600 text-sm mt-1">Suivez le guide pour respirer</p>
      </div>

      {/* Animation Circle */}
      <div className="relative flex items-center justify-center">
        <div 
          className="w-48 h-48 rounded-full border-4 border-cesi-secondary/50 bg-cesi-secondary/10 flex items-center justify-center transition-transform ease-in-out"
          style={{ 
            transitionDuration: transitionDuration,
            transform: `scale(${getScaleFactor()})`
          }}
        >
          <span className="text-cesi-primary font-medium text-xl">{phase}</span>
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
          {Object.keys(MODES).map(m => (
            <button 
              key={m}
              onClick={() => {
                setSelectedMode(m);
                setIsActive(false); // On arrête l'exercice si on change de mode
              }}
              className={`px-4 py-2 border-2 font-medium text-sm transition-colors ${selectedMode === m ? 'bg-cesi-primary text-white border-cesi-primary' : 'bg-white text-cesi-dark border-cesi-border hover:border-cesi-primary'}`}
            >
              {m.replace('748', '7-4-8').replace('55', '5-5').replace('46', '4-6')}
            </button>
          ))}
        </div>
        
        <p className="text-center text-xs text-gray-500 italic mb-2">
          Mode : {currentMode.label}
        </p>

        <div>
          <label htmlFor="repetitions" className="block text-xs text-gray-600 mb-1">Nombre de répétitions</label>
          <input
            id="repetitions"
            type="number"
            min={1}
            max={20}
            value={targetRepetitions}
            onChange={(e) => setTargetRepetitions(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            className="w-full p-2 border border-cesi-border text-sm"
            disabled={isActive}
          />
        </div>

        {isActive && (
          <p className="text-center text-xs text-blue-600 font-medium">
            Répétition {Math.min(currentRepetition, targetRepetitions)} / {targetRepetitions}
          </p>
        )}

        <button 
          onClick={toggleExercise}
          className={`w-full py-3 font-medium text-sm border-2 transition-colors ${isActive ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-cesi-accent text-white border-cesi-accent hover:bg-cesi-primary hover:border-cesi-primary'}`}
        >
          {isActive ? 'Arrêter l\'exercice' : 'Commencer la séance'}
        </button>

        {message && (
          <div className="text-center text-sm text-green-600 font-medium mt-2">
            {message}
          </div>
        )}

        {user && (
          <p className="text-center text-xs text-gray-400 mt-2">
            {isActive ? 'Session en cours...' : 'Vos sessions sont automatiquement sauvegardées'}
          </p>
        )}
      </div>
    </div>
  );
}