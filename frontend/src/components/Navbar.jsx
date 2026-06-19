import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-text">NoteShare</span>
        </Link>

        <div className="navbar-links">
          <Link to="/notes" className={`nav-link ${isActive('/notes') ? 'active' : ''}`}>Browse</Link>
          {user && (
            <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>Upload</Link>
          )}
          {user && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="user-avatar-btn">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
                )}
                <span className="user-name-short">{user.name.split(' ')[0]}</span>
                <span className="chevron">▾</span>
              </div>
              {menuOpen && (
                <div className="dropdown-menu">
                  <Link to={`/profile/${user._id}`} className="dropdown-item" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </div>
          )}
        </div>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/notes" className="mobile-link" onClick={() => setMenuOpen(false)}>Browse Notes</Link>
          {user && <Link to="/upload" className="mobile-link" onClick={() => setMenuOpen(false)}>Upload Note</Link>}
          {user && <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {user ? (
            <button className="mobile-link danger" onClick={handleLogout}>Log Out</button>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
