import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Exercise from './pages/Exercise';
import Register from './pages/Register';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import AddArticle from './pages/AddArticle';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ArticleManagement from './pages/ArticleManagement';
import EditArticle from './pages/EditArticle';
import Profile from './pages/Profile';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import LoggedOut from './pages/LoggedOut';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/logged-out');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-cesi-border">
      <div className="h-1 w-full flex">
        <span className="w-1/3 bg-[#000091]" />
        <span className="w-1/3 bg-white" />
        <span className="w-1/3 bg-[#e1000f]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 gov-focus">
            <div className="h-12 w-1 bg-[#000091]" />
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-wide text-gray-600">Republique francaise</p>
              <p className="text-lg font-bold text-cesi-primary">CESIZEN</p>
              <p className="text-xs text-gray-500">Service numerique de prevention en sante mentale</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold" aria-label="Navigation principale">
            <Link to="/" className="text-cesi-dark hover:text-cesi-primary gov-focus">Accueil</Link>
            <Link to="/infos" className="text-cesi-dark hover:text-cesi-primary gov-focus">Informations</Link>
            <Link to="/exercise" className="text-cesi-dark hover:text-cesi-primary gov-focus">Exercices de respiration</Link>

            {user?.id_role === 1 && (
              <div className="flex gap-4 items-center">
                <Link to="/admin/users" className="text-red-700 hover:underline gov-focus">Utilisateurs</Link>
                <Link to="/admin/articles" className="text-red-700 hover:underline gov-focus">Articles</Link>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="gov-button px-4 py-2 gov-focus">
                  Espace {user.firstname}
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-700 transition gov-focus">Deconnexion</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-700 hover:text-cesi-primary gov-focus">
                  Connexion
                </Link>
                <Link to="/register" className="gov-button px-4 py-2 gov-focus">
                  Inscription
                </Link>
              </div>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-cesi-dark hover:text-cesi-primary p-2 gov-focus" aria-label="Ouvrir le menu">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-white border-t border-cesi-border absolute w-full" aria-label="Navigation mobile">
          <div className="px-4 py-4 space-y-2 flex flex-col">
            <Link to="/" onClick={toggleMenu} className="px-3 py-3 border border-transparent hover:border-cesi-border gov-focus">Accueil</Link>
            <Link to="/infos" onClick={toggleMenu} className="px-3 py-3 border border-transparent hover:border-cesi-border gov-focus">Informations</Link>
            <Link to="/exercise" onClick={toggleMenu} className="px-3 py-3 border border-transparent hover:border-cesi-border gov-focus">Exercices de respiration</Link>

            {user?.id_role === 1 && (
              <>
                <Link to="/admin/users" onClick={toggleMenu} className="px-3 py-3 text-red-700 border border-transparent hover:border-cesi-border gov-focus">Administration utilisateurs</Link>
                <Link to="/admin/articles" onClick={toggleMenu} className="px-3 py-3 text-red-700 border border-transparent hover:border-cesi-border gov-focus">Administration articles</Link>
              </>
            )}
            
            {user ? (
              <>
                <Link to="/profile" onClick={toggleMenu} className="gov-button text-center px-3 py-3 gov-focus">Mon profil ({user.firstname})</Link>
                <button onClick={handleLogout} className="gov-button-secondary text-center px-3 py-3 gov-focus">Deconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu} className="gov-button text-center px-3 py-3 gov-focus">Se connecter</Link>
                <Link to="/register" onClick={toggleMenu} className="gov-button-secondary text-center px-3 py-3 gov-focus">S'inscrire</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="mt-14 border-t border-cesi-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600">
        <p className="font-semibold text-cesi-dark">CESIZEN</p>
        <p className="mt-1">Plateforme de prevention et d'accompagnement autour de la sante mentale.</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <main className="gov-page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/infos" element={<Articles />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/logged-out" element={<LoggedOut />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/articles" element={<ArticleManagement />} />
            <Route path="/admin/articles/add" element={<AddArticle />} />
            <Route path="/admin/articles/edit/:id" element={<EditArticle />} />
            <Route path="/admin/add-article" element={<AddArticle />} />
          </Routes>
        </main>
        <AppFooter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;