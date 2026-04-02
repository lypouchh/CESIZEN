import { useState, useEffect } from 'react';

const MODES = {
  '748': { inhale: 7, hold: 4, exhale: 8, label: 'Sommeil (7-4-8)' },
  '55': { inhale: 5, hold: 0, exhale: 5, label: 'Équilibre (5-5)' },
  '46': { inhale: 4, hold: 0, exhale: 6, label: 'Relaxation (4-6)' }
};

export default function Exercise() {
  const [selectedMode, setSelectedMode] = useState('55');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Prêt ?'); // Inhale, Hold, Exhale
  const [timer, setTimer] = useState(0);
  
  // On récupère les infos du mode actuel
  const currentMode = MODES[selectedMode];

  // Calcul pour savoir si le cercle doit être grand (Inspire ou Bloque)
  const isExpanded = isActive && (phase === 'Inspirez' || phase === 'Bloquez');

  // Calcul de la durée de transition CSS en fonction de la phase actuelle
  const getTransitionDuration = () => {
    if (!isActive) return '1000ms';
    if (phase === 'Inspirez') return `${currentMode.inhale * 1000}ms`;
    if (phase === 'Bloquez') return `${currentMode.hold * 1000}ms`;
    if (phase === 'Expirez') return `${currentMode.exhale * 1000}ms`;
    return '1000ms';
  };

  useEffect(() => {
    let interval = null;
    let t1 = null;
    let t2 = null;

    if (isActive) {
      const mode = currentMode;
      
      const runCycle = () => {
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
      interval = setInterval(runCycle, cycleDuration);
    } else {
      setPhase('Prêt ?');
    }
    
    // Nettoyage complet pour éviter les bugs si on change de mode rapidement
    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isActive, selectedMode, currentMode]); // Ajout de currentMode aux dépendances

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gov-primary">Cohérence Cardiaque</h2>
        <p className="text-gray-500 text-sm mt-1">Suivez le cercle pour respirer</p>
      </div>

      {/* Animation Circle */}
      <div className="relative flex items-center justify-center">
        <div 
          className={`w-48 h-48 rounded-full bg-gov-primary/20 flex items-center justify-center transition-all ease-in-out ${isExpanded ? 'scale-150 bg-gov-primary/40' : 'scale-100'}`}
          style={{ transitionDuration: getTransitionDuration() }}
        >
          <span className="text-gov-primary font-bold text-xl">{phase}</span>
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
              className={`px-3 py-2 text-xs font-bold transition-colors ${selectedMode === m ? 'bg-gov-primary text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              {m}
            </button>
          ))}
        </div>
        
        <p className="text-center text-xs text-gray-400 italic mb-2">
          Mode : {currentMode.label}
        </p>

        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-full py-4 font-bold text-white shadow-lg transition-all ${isActive ? 'bg-red-400 shadow-red-100' : 'bg-gov-accent shadow-gov-accent/20'}`}
        >
          {isActive ? 'Arrêter' : 'Commencer la séance'}
        </button>
      </div>
    </div>
  );
}