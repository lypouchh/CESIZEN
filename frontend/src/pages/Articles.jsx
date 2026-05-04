import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, api } = useAuth();

  const getExcerpt = (article) => {
    if (typeof article?.excerpt === 'string' && article.excerpt.trim()) {
      return article.excerpt;
    }

    if (typeof article?.content === 'string' && article.content.trim()) {
      return `${article.content.slice(0, 150)}${article.content.length > 150 ? '...' : ''}`;
    }

    return 'Contenu indisponible pour cet article.';
  };

  const getAuthorName = (article) => {
    const author = article?.user || article?.author;
    if (!author) {
      return 'Auteur inconnu';
    }

    const firstname = author.firstname || '';
    const lastname = author.lastname || '';
    const fullName = `${firstname} ${lastname}`.trim();
    return fullName || author.name || 'Auteur inconnu';
  };

  const formatArticleDate = (value) => {
    if (!value) {
      return 'Date indisponible';
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime())
      ? 'Date indisponible'
      : parsedDate.toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles');
      setArticles(response.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion au serveur');
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
    <div className="min-h-[80vh] py-8">
      <section className="gov-card max-w-6xl mx-auto p-6 md:p-8">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-wide text-gray-500">Ressources</p>
          <h1 className="text-3xl font-bold text-cesi-primary mt-2">Informations & Articles</h1>
          <p className="text-gray-600 mt-2">Consultez les contenus de prevention et de sensibilisation en sante mentale.</p>
        </div>

        {user?.id_role === 1 && (
          <div className="mb-8">
            <Link
              to="/admin/add-article"
              className="gov-button inline-flex items-center px-5 py-2.5 gov-focus"
            >
              Ajouter un article
            </Link>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-12 border border-cesi-border bg-cesi-muted">
            <div className="text-gray-500 mb-4">Aucun article disponible pour le moment.</div>
            {user?.id_role === 1 && (
              <Link
                to="/admin/add-article"
                className="text-cesi-primary hover:underline font-semibold gov-focus"
              >
                Créer le premier article
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.id} className="gov-card p-5 flex flex-col justify-between">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-cesi-primary mb-3">{article.title}</h2>
                  <p className="text-gray-700 text-sm">{getExcerpt(article)}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Par {getAuthorName(article)}</span>
                  <span>{formatArticleDate(article.created_at)}</span>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/article/${article.id}`}
                    className="text-cesi-primary hover:text-cesi-accent font-semibold transition gov-focus"
                  >
                    Lire la suite →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}