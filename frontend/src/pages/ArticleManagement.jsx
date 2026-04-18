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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Articles</h1>
        <button 
          onClick={() => navigate('/admin/articles/add')}
          className="bg-gov-primary hover:opacity-90 text-white font-bold py-2 px-4"
        >
          Ajouter un article
        </button>
      </div>

      {loading && <p>Chargement des articles...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3">{error}</p>}

      {!loading && !error && (
        <div className="bg-white shadow-sm overflow-hidden border">
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
                      className="text-gov-primary hover:underline font-bold"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => deleteArticle(article.id)} 
                      className="text-red-500 hover:underline font-bold"
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
