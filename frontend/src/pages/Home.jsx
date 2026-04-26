import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      <section className="gov-card overflow-hidden">
        <div className="bg-cesi-primary px-6 py-10 text-white md:px-10">
          <p className="text-xs uppercase tracking-wider opacity-90">Sante mentale et prevention</p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Accompagnement numerique pour mieux gerer votre stress
          </h1>
          <p className="mt-4 max-w-3xl text-sm md:text-base text-blue-50">
            CESIZEN propose des informations fiables, des exercices guides et des outils de suivi pour aider chacun a developper des pratiques de bien-etre au quotidien.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/exercise" className="gov-button inline-block px-6 py-3 text-center gov-focus">
              Demarrer un exercice de respiration
            </Link>
            <Link to="/infos" className="gov-button-secondary inline-block bg-white px-6 py-3 text-center gov-focus">
              Consulter les informations
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="gov-section-title text-2xl">Acces rapides</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="gov-card p-6">
            <h3 className="text-lg font-bold text-cesi-primary">Exercices de respiration</h3>
            <p className="mt-2 text-sm text-gray-700">Configurez une seance de coherence cardiaque avec un rythme adapte.</p>
            <Link to="/exercise" className="mt-4 inline-block text-sm font-semibold gov-focus">Acceder au module</Link>
          </article>

          <article className="gov-card p-6">
            <h3 className="text-lg font-bold text-cesi-primary">Informations prevention</h3>
            <p className="mt-2 text-sm text-gray-700">Parcourez des contenus pedagogiques autour de la sante mentale.</p>
            <Link to="/infos" className="mt-4 inline-block text-sm font-semibold gov-focus">Voir les publications</Link>
          </article>

          <article className="gov-card p-6">
            <h3 className="text-lg font-bold text-cesi-primary">Suivi personnel</h3>
            <p className="mt-2 text-sm text-gray-700">Retrouvez votre activite respiration et mettez a jour votre profil.</p>
            <Link to="/profile" className="mt-4 inline-block text-sm font-semibold gov-focus">Ouvrir mon espace</Link>
          </article>
        </div>
      </section>

      <section className="gov-card p-6 md:p-8">
        <h2 className="gov-section-title text-2xl">Priorites de la plateforme</h2>
        <ul className="grid gap-3 text-sm text-gray-700 md:grid-cols-2">
          <li className="border border-cesi-border p-4">Accompagner les citoyens avec des outils accessibles a tous les niveaux.</li>
          <li className="border border-cesi-border p-4">Garantir un parcours simple, lisible et securise sur mobile et desktop.</li>
          <li className="border border-cesi-border p-4">Proposer des contenus de prevention faciles a comprendre et a appliquer.</li>
          <li className="border border-cesi-border p-4">Permettre un suivi des seances de respiration pour encourager la regularite.</li>
        </ul>
      </section>
    </div>
  );
}