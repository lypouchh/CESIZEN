import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { api } = useAuth();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await api.get('/articles');
                setArticles(response.data);
            } catch (err) {
                setError('Failed to fetch articles.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [api]);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center mt-8">Chargement...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Articles</h1>
            <div className="mb-8 max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="w-full p-4 border rounded-lg"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                    <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                            <p className="text-gray-700 mb-4">{article.content.substring(0, 100)}...</p>
                            <Link to={`/articles/${article.id}`} className="text-blue-500 hover:underline">
                                Lire la suite
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Articles;