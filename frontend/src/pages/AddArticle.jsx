import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AddArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Bien-être');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, api } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await api.post('/articles', {
        title,
        content,
        category,
        id_user: user.id,
      });

      setMessage('Article ajouté avec succès !');
      setTitle('');
      setContent('');
      setTimeout(() => navigate('/admin/articles'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur de connexion au serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="mb-5 sm:mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Administration &rsaquo; Articles</p>
        <h1 className="text-3xl font-bold text-cesi-primary">Ajouter un article</h1>
      </div>
      <div className="gov-card p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-cesi-dark mb-1">Titre de l'article</label>
            <input
              type="text"
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cesi-dark mb-1">Catégorie</label>
            <select
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Bien-être">Bien-être</option>
              <option value="Santé">Santé</option>
              <option value="Méditation">Méditation</option>
              <option value="Respiration">Respiration</option>
              <option value="Stress">Stress</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cesi-dark mb-1">Contenu</label>
            <textarea
              rows="10"
              className="w-full p-3 border border-cesi-border gov-focus outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {message && (
            <p className={`p-3 border ${message.includes('succès') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="gov-button w-full sm:w-auto px-5 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publication en cours...' : "Publier l'article"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddArticle;