import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Exercise from './pages/Exercise';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import AddArticle from './pages/AddArticle';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// On crée un composant séparé pour la Navigation pour que le code reste clair
function Navigation() {
  // state pour savoir si le menu mobile est ouvert (true) ou fermé (false)
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  // Fonction pour inverser l'état du menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo CESIZEN (à gauche) */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-cesi-primary text-3xl">🧘‍♂️</span>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl text-cesi-primary tracking-widest leading-none">
                CESI<span className="text-yellow-400">ZEN</span>
              </span>
            </div>
          </Link>

          {/* Menu Classique (Écrans d'ordinateur - caché sur mobile) */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-cesi-primary border-b-2 border-cesi-primary font-bold pb-1">Accueil</Link>
            <Link to="/infos" className="text-gray-600 hover:text-cesi-primary font-semibold transition">Informations</Link>
            <Link to="/exercise" className="text-gray-600 hover:text-cesi-primary font-semibold transition">Exercices de Respiration</Link>
            
            {/* Lien Admin visible uniquement pour id_role === 1 */}
            {user?.id_role === 1 && (
              <div className="flex gap-4 items-center">
                <Link to="/admin/dashboard" className="text-red-500 font-bold hover:underline">Dashboard</Link>
                <Link to="/admin/add-article" className="text-red-500 font-bold hover:underline">Publier</Link>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="bg-cesi-primary text-white px-5 py-2 rounded-md font-bold hover:opacity-90 transition shadow-sm flex items-center gap-2">
                  <span>👤</span> {user.firstname}
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
              <Link to="/profile" onClick={toggleMenu} className="bg-cesi-primary text-white font-bold block px-3 py-3 rounded-md text-center mt-4 shadow-sm">Mon Profil ({user.firstname})</Link>
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
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        {/* Le contenu des pages s'affiche ici */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </AuthProvider>
>>>>>>> 2de08eed4b49f28326c1c4e340f06043df2e3e0e
    </BrowserRouter>
  );
}

export default App;