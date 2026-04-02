import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-20 bg-gov-light min-h-screen">
      
      {/* Hero Section */}
      <header className="text-center py-16 px-4 w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gov-dark leading-tight">
          Accompagnement pour votre <span className="text-gov-primary">sérénité</span>
        </h1>
        <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
          Mieux comprendre et agir sur la gestion de votre stress grâce à des outils et des informations fiables.
        </p>
        
        <div className="mt-8 flex flex-col items-center">
          <Link 
            to="/exercise" 
            className="bg-gov-primary text-white px-8 py-4 font-bold text-lg hover:opacity-90 transition shadow-md flex items-center gap-2"
          >
            <span>🤍</span> Démarrer un Exercice de Respiration
          </Link>
          <span className="text-sm text-gray-500 mt-3">(Cohérence Cardiaque 5-5 - Accès immédiat)</span>
        </div>
      </header>

      {/* Section Articles à la Une */}
      <section className="w-full max-w-5xl px-4 mt-8">
        <h2 className="text-2xl font-bold text-gov-dark text-center mb-8">À la Une : Nos derniers conseils</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Carte 1 : Relaxation */}
          <div className="bg-white shadow-sm overflow-hidden border border-gray-100 flex flex-col">
            <div className="bg-gov-secondary h-32 flex items-center justify-center">
              <h3 className="text-3xl font-bold text-white">Relaxation</h3>
            </div>
            <div className="p-5 flex-1">
              <span className="bg-blue-50 text-gov-secondary text-xs font-bold px-3 py-1 uppercase">Gestion du stress</span>
              <p className="font-bold text-gov-dark mt-4 text-lg">Les 5 étapes pour vaincre le stress chronique</p>
            </div>
          </div>

          {/* Carte 2 : Sommeil */}
          <div className="bg-white shadow-sm overflow-hidden border border-gray-100 flex flex-col">
            <div className="bg-gov-primary h-32 flex items-center justify-center">
              <h3 className="text-3xl font-bold text-white">Sommeil</h3>
            </div>
            <div className="p-5 flex-1">
              <span className="bg-green-50 text-gov-primary text-xs font-bold px-3 py-1 uppercase">Sommeil</span>
              <p className="font-bold text-gov-dark mt-4 text-lg">Améliorer la qualité de votre sommeil</p>
            </div>
          </div>

          {/* Carte 3 : Respiration */}
          <div className="bg-white shadow-sm overflow-hidden border border-gray-100 flex flex-col">
            <div className="bg-gov-accent h-32 flex items-center justify-center">
              <h3 className="text-3xl font-bold text-white">Respiration</h3>
            </div>
            <div className="p-5 flex-1">
              <span className="bg-red-50 text-gov-accent text-xs font-bold px-3 py-1 uppercase">Cohérence cardiaque</span>
              <p className="font-bold text-gov-dark mt-4 text-lg">La technique du 5-5 : un guide simple</p>
            </div>
          </div>

        </div>
      </section>
      
    </div>
  );
}