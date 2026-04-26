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
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Administration</p>
          <h1 className="text-3xl font-bold text-cesi-primary">Gestion des Articles</h1>
        </div>
        <button 
          onClick={() => navigate('/admin/articles/add')}
          className="gov-button"
        >
          Ajouter un article
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Chargement des articles...</p>}
      {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700">{error}</p>}

      {!loading && !error && (
        <div className="gov-card p-0 overflow-hidden">
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
      )}
    </div>
  );
}

export default ArticleManagement;
