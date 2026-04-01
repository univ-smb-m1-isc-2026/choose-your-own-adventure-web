import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, User, LogOut, Plus, Heart, Save, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <BookOpen size={22} />
          <span>CYOA</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Explorer</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={16} />
                <span>Mes aventures</span>
              </Link>
              <Link to="/saves" className="nav-link">
                <Save size={16} />
                <span>Sauvegardes</span>
              </Link>
              <Link to="/favorites" className="nav-link">
                <Heart size={16} />
                <span>Favoris</span>
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/editor" className="btn btn-primary btn-sm">
                <Plus size={15} />
                <span>Créer</span>
              </Link>
              <div className="user-menu">
                <button className="user-btn">
                  <User size={16} />
                  <span>{user?.username}</span>
                </button>
                <button onClick={handleLogout} className="nav-link logout-btn" title="Déconnexion">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Connexion</Link>
              <Link to="/register" className="btn btn-primary btn-sm">S'inscrire</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
