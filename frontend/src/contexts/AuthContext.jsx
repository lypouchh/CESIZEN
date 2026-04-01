import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // On utilise useMemo pour ne pas recréer l'instance axios à chaque rendu.
  const api = useMemo(() => {
    const axiosInstance = axios.create({
      baseURL: `http://${window.location.hostname}:8000/api`, // S'adapte automatiquement à l'IP utilisée
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // On utilise un intercepteur pour ajouter le token dynamiquement à chaque requête.
    // C'est plus robuste que de le définir une seule fois.
    axiosInstance.interceptors.request.use(config => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });

    return axiosInstance;
  }, []);
  
  const register = async (firstname, lastname, email, password, password_confirmation) => {
    try {
      // On combine prénom et nom pour correspondre au champ 'name' du backend
      const name = `${firstname} ${lastname}`;
      const response = await api.post('/register', { name, email, password, password_confirmation });
      
      // Après l'inscription, on pourrait vouloir connecter l'utilisateur directement
      // Pour l'instant, on se contente de ne pas lever d'erreur
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

  const updateUser = async (userData) => {
    try {
      // On ne met à jour que les champs modifiables
      const { name, email } = userData;
      const response = await api.put('/user', { name, email });
      setUser(response.data); // Met à jour l'état global de l'utilisateur
      return response.data;
    } catch (error) {
      console.error("Erreur mise à jour profil:", error.response?.data || error.message);
      throw error;
    }
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
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]); // On ajoute 'user' pour éviter une boucle si l'utilisateur est déjà chargé

  return (
    <AuthContext.Provider value={{ user, token, api, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
