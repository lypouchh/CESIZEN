import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AddArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Bien-être');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          category,
          id_user: user.id
        })
      });

      if (response.ok) {
        setMessage('Article ajouté avec succès !');
        setTitle('');
        setContent('');
        setTimeout(() => navigate('/infos'), 2000);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Erreur lors de l\'ajout.');
      }
    } catch (err) {
      setMessage('Erreur de connexion.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-cesi-primary mb-6">Espace Administration</h1>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Ajouter un nouvel article</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de l'article</label>
            <input
              type="text"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-cesi-primary focus:border-cesi-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-cesi-primary focus:border-cesi-primary"
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
            <label className="block text-sm font-medium text-gray-700">Contenu</label>
            <textarea
              rows="10"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-cesi-primary focus:border-cesi-primary"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {message && (
            <p className={`p-3 rounded ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="bg-cesi-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
          >
            Publier l'article
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddArticle;