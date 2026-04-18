import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        setError('Erreur lors du chargement des articles');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-cesi-primary">Chargement des articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchArticles}
            className="bg-cesi-primary text-white px-4 py-2 hover:bg-cesi-accent transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-cesi-primary mb-4">Informations & Articles</h1>
          <p className="text-gray-600">Découvrez nos articles sur la cohérence cardiaque et le bien-être</p>
        </div>

        {user?.id_role === 1 && (
          <div className="mb-8 text-center">
            <Link
              to="/admin/add-article"
              className="bg-red-600 text-white px-6 py-3 font-medium hover:bg-red-700 transition inline-flex items-center gap-2"
            >
              <span>➕</span> Ajouter un article
            </Link>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Aucun article disponible pour le moment.</div>
            {user?.id_role === 1 && (
              <Link
                to="/admin/add-article"
                className="text-cesi-primary hover:underline"
              >
                Créer le premier article
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.id} className="bg-white border border-cesi-border p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-cesi-primary mb-2">{article.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{article.excerpt || article.content.substring(0, 150) + '...'}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Par {article.author?.firstname} {article.author?.lastname}</span>
                  <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/article/${article.id}`}
                    className="text-cesi-primary hover:text-cesi-accent font-medium transition"
                  >
                    Lire la suite →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}