import { Link } from 'react-router-dom';

export default function LoggedOut() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white border border-cesi-border shadow-sm p-8 text-center">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Session</p>
        <h1 className="text-3xl font-bold text-cesi-primary mb-3">Vous avez bien ete deconnecte</h1>
        <p className="text-gray-600 mb-6">Votre session a ete fermee en toute securite.</p>
        <Link
          to="/"
          className="gov-button inline-flex items-center justify-center"
        >
          Retourner a l'accueil
        </Link>
      </div>
    </div>
  );
}
