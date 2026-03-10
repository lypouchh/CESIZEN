import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:8000/api/articles', {
        title,
        content,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Article ajouté avec succès !');
      setTitle('');
      setContent('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage('Erreur lors de l\'ajout.');
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