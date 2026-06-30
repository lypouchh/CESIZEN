/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const storeTokens = useCallback((nextAccessToken) => {
    localStorage.setItem('token', nextAccessToken);
    setToken(nextAccessToken);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // On utilise useMemo pour ne pas recréer l'instance axios à chaque rendu.
  const api = useMemo(() => {
    // Construire l'URL de l'API de manière flexible
    const getApiUrl = () => {
      const hostname = window.location.hostname;
      const port = 8000;
      
      // Si on accède depuis le réseau local (192.168.x.x, 10.x.x.x, etc.), utiliser cette IP
      // Sinon (localhost), utiliser localhost:8000
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:${port}/api`;
      }
      // Pour accès depuis le réseau local (phone, autre PC, etc.)
      return `http://${hostname}:${port}/api`;
    };

    const apiUrl = getApiUrl();
    
    const axiosInstance = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
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

    axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error?.config;

        if (!originalRequest || error?.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        const isAuthRoute = ['/login', '/register', '/refresh'].some(path =>
          String(originalRequest.url || '').includes(path),
        );

        if (isAuthRoute) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const refreshResponse = await axiosInstance.post('/refresh');

          const nextAccessToken = refreshResponse.data.access_token ?? refreshResponse.data.token;

          if (!nextAccessToken) {
            throw new Error('Access token missing from refresh response');
          }

          storeTokens(nextAccessToken);
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          clearSession();
          return Promise.reject(refreshError);
        }
      },
    );

    return axiosInstance;
  }, [clearSession, storeTokens]);
  
  const register = async (firstname, lastname, email, password, password_confirmation) => {
    try {
      const response = await api.post('/register', {
        firstname,
        lastname,
        email,
        password,
        password_confirmation,
      });

      const { user, access_token, token: legacyToken } = response.data;
      const resolvedAccessToken = access_token ?? legacyToken;

      if (!resolvedAccessToken) {
        throw new Error('Token missing in register response');
      }

      storeTokens(resolvedAccessToken);
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
      const { user, access_token, token: legacyToken } = response.data;
      const resolvedAccessToken = access_token ?? legacyToken;

      if (!resolvedAccessToken) {
        throw new Error('Token missing in login response');
      }

      storeTokens(resolvedAccessToken);
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
    } catch {
      // On ignore les erreurs de logout (ex: token deja expire)
    }
    clearSession();
  };

  const updateUser = async (userData) => {
    try {
      const { firstname, lastname, email, current_password } = userData;
      const response = await api.put('/user', { firstname, lastname, email, current_password });
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur mise à jour profil:", error.response?.data || error.message);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/user');
    } catch (error) {
      console.error("Erreur suppression de compte:", error.response?.data || error.message);
      throw error;
    } finally {
      clearSession();
    }
  };

  // Vérifier si l'utilisateur est déjà connecté au chargement de la page
  useEffect(() => {
    if (token && !user) {
      api.get('/user')
        .then(response => setUser(response.data))
        .catch(() => {
          // Si le token est invalide, on nettoie
          clearSession();
        });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]); // On ajoute 'user' pour éviter une boucle si l'utilisateur est déjà chargé

  return (
    <AuthContext.Provider value={{ user, token, api, register, login, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
