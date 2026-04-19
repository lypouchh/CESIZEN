import { Link } from 'react-router-dom';

export default function LoggedOut() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white border border-cesi-border shadow-sm p-8 text-center">
        <h1 className="text-3xl font-bold text-cesi-dark mb-3">Vous avez bien ete deconnecte</h1>
        <p className="text-gray-600 mb-6">Votre session a ete fermee en toute securite.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-cesi-primary text-white px-6 py-3 font-semibold border border-cesi-primary hover:bg-cesi-secondary transition-colors"
        >
          Retourner a l'accueil
        </Link>
      </div>
    </div>
  );
}
