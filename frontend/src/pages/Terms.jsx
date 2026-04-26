import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-gray-700 min-h-[80vh]">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Informations légales</p>
        <h1 className="text-3xl font-bold text-cesi-primary">Conditions Générales d'Utilisation</h1>
      </div>
      
      <div className="gov-card space-y-6 text-justify">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h2>
          <p>Bienvenue sur CESIZEN. En accédant à cette application, vous acceptez d'être lié par les présentes conditions d'utilisation, toutes les lois et réglementations applicables, et convenez que vous êtes responsable du respect des lois locales applicables.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Utilisation de l'application</h2>
          <p>CESIZEN est une application d'aide à la gestion du stress et au bien-être étudiant. Les contenus (exercices de respiration, articles, suivi) sont fournis à titre informatif et éducatif uniquement. Ils ne remplacent en aucun cas un avis médical professionnel, un diagnostic ou un traitement.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Données personnelles</h2>
          <p>Nous attachons une grande importance à la confidentialité de vos données. Vos informations d'inscription et de suivi émotionnel sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement explicite.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">4. Limitations</h2>
          <p>L'équipe CESIZEN ne pourra être tenue responsable des dommages découlant de l'utilisation ou de l'impossibilité d'utiliser les outils présents sur l'application.</p>
        </section>

        <div className="pt-6 border-t border-gray-100">
          <p className="mb-4 text-sm text-gray-500">Dernière mise à jour : Mars 2026</p>
          <Link to="/register" className="gov-button inline-block">
            Retour à l'inscription
          </Link>
        </div>
      </div>
    </div>
  );
}