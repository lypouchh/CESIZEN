import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AddArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { api } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/articles', { title, content, category });
      setSuccess('Article ajouté avec succès !');
      setTimeout(() => navigate('/admin/articles'), 1500);
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'article.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white p-6 shadow-md border">
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouvel article</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              id="title"
              type="text"
              className="w-full p-3 mt-1 border border-gray-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
            <input
              id="category"
              type="text"
              className="w-full p-3 mt-1 border border-gray-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
            <textarea
              id="content"
              rows="10"
              className="w-full p-3 mt-1 border border-gray-300"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {success && <p className="p-3 bg-green-100 text-green-700">{success}</p>}
          {error && <p className="p-3 bg-red-100 text-red-700">{error}</p>}

          <button
            type="submit"
            className="bg-gov-primary text-white px-6 py-3 font-bold hover:opacity-90 transition"
          >
            Publier l'article
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddArticle;