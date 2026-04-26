import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function EditArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setCategory(res.data.category);
      } catch (err) {
        setError("Impossible de charger l'article.");
      }
    };
    fetchArticle();
  }, [id, api]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put(`/articles/${id}`, { title, content, category });
      setSuccess('Article modifié avec succès !');
      setTimeout(() => navigate('/admin/articles'), 1500);
    } catch (err) {
      setError("Erreur lors de la modification de l'article.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="gov-card">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Administration &rsaquo; Articles</p>
          <h2 className="text-2xl font-bold text-cesi-primary">Modifier l'article</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-cesi-dark mb-1">Titre</label>
            <input
              id="title"
              type="text"
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-cesi-dark mb-1">Catégorie</label>
            <input
              id="category"
              type="text"
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-cesi-dark mb-1">Contenu</label>
            <textarea
              id="content"
              rows="10"
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {success && <p className="p-3 bg-green-50 border border-green-200 text-green-700">{success}</p>}
          {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700">{error}</p>}

          <button
            type="submit"
            className="gov-button"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditArticle;
