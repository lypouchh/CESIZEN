import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configuration d'Axios avec votre IP locale pour le mobile
  const api = axios.create({
    baseURL: `http://${window.location.hostname}:8000/api`, // S'adapte automatiquement à l'IP utilisée
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Ajouter le token automatiquement s'il existe
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const register = async (firstname, lastname, email, password, password_confirmation) => {
    try {
      const response = await api.post('/register', { firstname, lastname, email, password, password_confirmation });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Erreur inscription:", error.response?.data || error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Erreur connexion:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
        await api.post('/logout');
    } catch (e) {
        // On ignore les erreurs de logout (ex: token déjà expiré)
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Vérifier si l'utilisateur est déjà connecté au chargement de la page
  useEffect(() => {
    if (token && !user) {
      api.get('/user')
        .then(response => setUser(response.data))
        .catch(() => {
          // Si le token est invalide, on nettoie
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
