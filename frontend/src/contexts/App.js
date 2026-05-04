import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Importer les pages
import HomePage from './pages/HomePage';
import BreathingPage from './pages/BreathingPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Importer les composants de structure
import ProtectedRoute from './components/ProtectedRoute';
// import BottomNav from './components/BottomNav'; // À créer plus tard

// Ce composant interne permet d'utiliser le hook useAuth
const AppLayout = () => {
  const { token } = useAuth();

  return (
    <div className="app-container">
      <main>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/breathing" element={<BreathingPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
        </Routes>
      </main>
      {/* {token && <BottomNav />} */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;