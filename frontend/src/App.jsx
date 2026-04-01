import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Exercise from './pages/Exercise';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import AddArticle from './pages/AddArticle';
import EditArticle from './pages/EditArticle'; // À créer
import AdminRegister from './pages/AdminRegister';
import AdminLayout from './pages/AdminLayout';
import UserManagement from './pages/UserManagement';
import ArticleManagement from './pages/ArticleManagement';
import Articles from './pages/Articles';
import Article from './pages/Article';
import Terms from './pages/Terms';
import Profile from './pages/Profile';
import ProtectedRoute from './contexts/ProtectedRoute';
import AdminRoute from './contexts/AdminRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// On crée un composant séparé pour la Navigation pour que le code reste clair
function Navigation() {
  // state pour savoir si le menu mobile est ouvert (true) ou fermé (false)
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  // Fonction pour inverser l'état du menu
  const toggleMenu = () => setIsOpen(!isOpen);

  const isAdmin = user?.role?.nom === 'admin';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo CESIZEN (à gauche) */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            {/* Remplacez le texte par une balise <img> pour votre logo */}
            <img
              src="/test.png" // Assurez-vous que votre logo est dans public/
              alt="CESIZEN Logo" 
              className="h-10 w-auto" // Ajustez la taille selon vos besoins
            />
          </Link>

          {/* Menu Classique (Écrans d'ordinateur - caché sur mobile) */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-cesi-primary border-b-2 border-cesi-primary font-bold pb-1">Accueil</Link>
            <Link to="/infos" className="text-gray-600 hover:text-cesi-primary font-semibold transition">Informations</Link>
            <Link to="/exercise" className="text-gray-600 hover:text-cesi-primary font-semibold transition">Exercices de Respiration</Link>
            
            {/* Liens Admin visibles uniquement si l'utilisateur est admin */}
            {isAdmin && (
              <div className="flex gap-4 items-center">
                <Link to="/admin/users" className="text-red-500 font-bold hover:underline">Dashboard Admin</Link>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="bg-cesi-primary text-white px-5 py-2 rounded-md font-bold hover:opacity-90 transition shadow-sm flex items-center gap-2">
                  <span>👤</span> {user.name.split(' ')[0]}
                </Link>
                <button onClick={logout} className="text-gray-500 text-sm hover:text-red-500">Déconnexion</button>
              </div>
            ) : (
              <Link to="/login" className="bg-cesi-accent text-white px-5 py-2 rounded-md font-bold hover:opacity-90 transition shadow-sm">
                Se Connecter / Inscription
              </Link>
            )}
          </div>

          {/* Bouton Menu Burger (Mobile uniquement - caché sur ordinateur) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-cesi-dark hover:text-cesi-primary focus:outline-none p-2"
            >
              {/* Icône SVG qui change si c'est ouvert (Croix) ou fermé (Burger) */}
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> // Croix
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> // 3 lignes
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Déroulant (S'affiche uniquement sur mobile et si isOpen est true) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link to="/" onClick={toggleMenu} className="text-cesi-primary font-bold block px-3 py-3 rounded-md bg-green-50">Accueil</Link>
            <Link to="/infos" onClick={toggleMenu} className="text-gray-600 font-semibold block px-3 py-3 rounded-md hover:bg-gray-50">Informations</Link>
            <Link to="/exercise" onClick={toggleMenu} className="text-gray-600 font-semibold block px-3 py-3 rounded-md hover:bg-gray-50">Exercices de Respiration</Link>
            
            {user ? (
              <Link to="/profile" onClick={toggleMenu} className="bg-cesi-primary text-white font-bold block px-3 py-3 rounded-md text-center mt-4 shadow-sm">Mon Profil ({user.name.split(' ')[0]})</Link>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu} className="bg-cesi-accent text-white font-bold block px-3 py-3 rounded-md text-center mt-4 shadow-sm">Se Connecter</Link>
                <Link to="/register" onClick={toggleMenu} className="bg-cesi-primary text-white font-bold block px-3 py-3 rounded-md text-center mt-2 shadow-sm">S'Inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
// Composant Principal
function App() {
  // Met à jour le titre de la page (onglet du navigateur)
  useEffect(() => {
    document.title = "CESIZEN"; // Texte de l'onglet du navigateur
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        {/* Le contenu des pages s'affiche ici */}
        <main>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/infos" element={<Articles />} />
            <Route path="/articles/:id" element={<Article />} />

            {/* Routes protégées - nécessitent une authentification */}
            <Route element={<ProtectedRoute />}>
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            {/* Routes Admin - nécessitent le rôle admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="users" replace />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="articles" element={<ArticleManagement />} />
                <Route path="articles/add" element={<AddArticle />} />
                <Route path="articles/edit/:id" element={<EditArticle />} />
                <Route path="register" element={<AdminRegister />} />
              </Route>
            </Route>

            {/* Route de secours pour les chemins non trouvés */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;