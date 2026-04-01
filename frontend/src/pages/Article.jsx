import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Article = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const { user, api } = useAuth();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/articles/${id}`);
                setArticle(response.data);
                // Check if the article is in the user's favorites
                if (user) {
                    const favoritesResponse = await api.get('/favorites');
                    const isFav = favoritesResponse.data.some(fav => fav.id === parseInt(id));
                    setIsFavorited(isFav);
                }
            } catch (err) {
                setError('Failed to fetch article.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id, user, api]);

    const handleFavorite = async () => {
        try {
            if (isFavorited) {
                await api.delete(`/articles/${id}/favorite`);
                setIsFavorited(false);
            } else {
                await api.post(`/articles/${id}/favorite`);
                setIsFavorited(true);
            }
        } catch (err) {
            console.error('Failed to update favorite status.', err);
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Chargement...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    if (!article) {
        return <div className="text-center mt-8">Article not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <div className="text-gray-600 mb-4">
                    <span>Par {article.user?.name || 'Auteur inconnu'}</span>
                    <span className="mx-2">|</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
                {user && (
                    <button onClick={handleFavorite} className="mb-4">
                        <svg
                            className={`w-6 h-6 ${isFavorited ? 'text-yellow-400' : 'text-gray-400'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.05 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
                        </svg>
                    </button>
                )}
                <div className="prose max-w-none">{article.content}</div>
            </div>
        </div>
    );
};

export default Article;