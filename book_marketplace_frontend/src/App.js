import React, { useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context';

// --- UI Pages ---
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Swaps from './pages/Swaps';
import Notifications from './pages/Notifications';
import CreateBook from './pages/CreateBook';

const brandColors = {
  primary: "#4F8A8B",
  secondary: "#FBD46D",
  accent: "#F67280"
};

function Navbar() {
  const { user, logout } = useApp();
  const [mobileNav, setMobileNav] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar" style={{ background: brandColors.primary, color: '#fff', borderBottom: `3px solid ${brandColors.accent}` }}>
      <div className="navbar-logo" style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: 2 }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>BookSwap Hub</Link>
      </div>
      <div className={"navbar-links" + (mobileNav ? " open" : "")}>
        <Link to="/books">Browse Books</Link>
        {user && (<>
          <Link to="/books/new">List a Book</Link>
          <Link to="/swaps">My Swaps</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/notifications">🔔</Link>
          <button className="btn btn-logout" onClick={() => { logout(); navigate('/'); }}>Logout</button>
      </>)}
        {!user && (<>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </>)}
      </div>
      <button className="navbar-toggle" onClick={() => setMobileNav(m => !m)}>
        <span>☰</span>
      </button>
    </nav>
  );
}

function AppContainer() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <AppProvider>
        <div className="App">
          <Navbar />
          {/* Theme toggle: */}
          <button
            className="theme-toggle"
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/new" element={<RequireAuth><CreateBook /></RequireAuth>} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/swaps" element={<RequireAuth><Swaps /></RequireAuth>} />
              <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </AppProvider>
    </Router>
  );
}

function RequireAuth({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// PUBLIC_INTERFACE
export default AppContainer;
