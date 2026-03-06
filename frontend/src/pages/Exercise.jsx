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

  useEffect(() => {
    let interval = null;
    if (isActive) {
      const mode = MODES[selectedMode];
      let currentTimer = 0;
      
      const runCycle = () => {
        setPhase('Inspirez');
        setTimeout(() => {
          if (mode.hold > 0) {
            setPhase('Bloquez');
            setTimeout(() => {
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
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, selectedMode]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cesi-primary">Cohérence Cardiaque</h2>
        <p className="text-gray-500 text-sm mt-1">Suivez le cercle pour respirer</p>
      </div>

      {/* Animation Circle */}
      <div className="relative flex items-center justify-center">
        <div className={`w-48 h-48 rounded-full bg-cesi-primary/20 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${isActive && phase === 'Inspirez' ? 'scale-150 bg-cesi-primary/40' : 'scale-100'}`}>
          <span className="text-cesi-primary font-bold text-xl">{phase}</span>
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
          {Object.keys(MODES).map(m => (
            <button 
              key={m}
              onClick={() => setSelectedMode(m)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedMode === m ? 'bg-cesi-primary text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              {m}
            </button>
          ))}
        </div>
        
        <p className="text-center text-xs text-gray-400 italic mb-2">
          Mode : {MODES[selectedMode].label}
        </p>

        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${isActive ? 'bg-red-400 shadow-red-100' : 'bg-cesi-accent shadow-cesi-accent/20'}`}
        >
          {isActive ? 'Arrêter' : 'Commencer la séance'}
        </button>
      </div>
    </div>
  );
}