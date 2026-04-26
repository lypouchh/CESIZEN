import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else {
        setError('Article non trouvé');
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
        <div className="text-cesi-primary">Chargement de l'article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Article non trouvé'}</div>
          <Link
            to="/infos"
            className="bg-cesi-primary text-white px-4 py-2 hover:bg-cesi-accent transition"
          >
            Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-8">
      <div className="max-w-4xl mx-auto gov-card p-6 md:p-8">
        <div className="mb-6">
          <Link
            to="/infos"
            className="text-cesi-primary hover:text-cesi-accent font-semibold transition inline-flex items-center gap-2 gov-focus"
          >
            ← Retour aux articles
          </Link>
        </div>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="bg-cesi-muted border border-cesi-border px-3 py-1">{article.category}</span>
              <span>•</span>
              <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
            </div>

            <h1 className="text-3xl font-bold text-cesi-primary mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Par {article.user?.firstname} {article.user?.lastname}</span>
              {article.user?.id_role === 1 && (
                <span className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 text-xs">Administrateur</span>
              )}
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {user?.id_role === 1 && (
            <div className="mt-8 pt-8 border-t border-cesi-border">
              <div className="flex gap-4">
                <button className="gov-button-secondary px-4 py-2 gov-focus">
                  Modifier
                </button>
                <button className="px-4 py-2 border border-red-600 text-red-700 hover:bg-red-50 transition gov-focus">
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}