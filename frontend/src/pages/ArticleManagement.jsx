import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { api } = useAuth();
  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/articles');
      setArticles(res.data);
      setError('');
    } catch (err) {
      setError('Impossible de charger les articles.');
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      try {
        await api.delete(`/articles/${id}`);
        setArticles(prevArticles => prevArticles.filter(a => a.id !== id));
      } catch (err) {
        setError("Erreur lors de la suppression de l'article.");
      }
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Administration</p>
          <h1 className="text-3xl font-bold text-cesi-primary">Gestion des Articles</h1>
        </div>
        <button 
          onClick={() => navigate('/admin/articles/add')}
          className="gov-button w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-sm sm:text-base"
        >
          Ajouter un article
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Chargement des articles...</p>}
      {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700">{error}</p>}

      {!loading && !error && (
        <>
          <div className="space-y-3 md:hidden">
            {articles.map(article => (
              <article key={article.id} className="gov-card p-4">
                <h2 className="text-base font-bold text-cesi-primary">{article.title}</h2>
                <p className="text-sm text-gray-600 mt-1">Catégorie: {article.category}</p>
                <p className="text-sm text-gray-600">Auteur: {article.user?.name || 'N/A'}</p>
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                    className="text-cesi-primary hover:underline font-semibold text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="text-red-600 hover:underline font-semibold text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="gov-card p-0 overflow-hidden hidden md:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Titre</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Auteur</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{article.title}</td>
                  <td className="p-4 text-gray-600">{article.category}</td>
                  <td className="p-4 text-gray-600">{article.user?.name || 'N/A'}</td>
                  <td className="p-4 space-x-4">
                    <button 
                      onClick={() => navigate(`/admin/articles/edit/${article.id}`)} 
                      className="text-cesi-primary hover:underline font-semibold text-sm"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => deleteArticle(article.id)} 
                      className="text-red-600 hover:underline font-semibold text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ArticleManagement;
