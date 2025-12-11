import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setIsMenuOpen(false);
  };

  // Check if link is active
  const isActiveLink = (path) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/home" className="nav-logo" aria-label="CineVerse Home">
          <img src="/images/cv1.png" alt="" className="nav-logo-image" aria-hidden="true" />
          <span className="nav-logo-text">CineVerse</span>
        </Link>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} role="menubar">
          <Link 
            to="/home" 
            className={`nav-link ${isActiveLink('/home') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/home') ? 'page' : undefined}
          >
            Home
          </Link>
          <Link 
            to="/genres" 
            className={`nav-link ${isActiveLink('/genres') || isActiveLink('/genre/') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/genres') ? 'page' : undefined}
          >
            Genres
          </Link>
          <Link 
            to="/directors" 
            className={`nav-link ${isActiveLink('/directors') || isActiveLink('/director/') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/directors') ? 'page' : undefined}
          >
            Directors
          </Link>
          <Link 
            to="/actors" 
            className={`nav-link ${isActiveLink('/actors') || isActiveLink('/actor/') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/actors') ? 'page' : undefined}
          >
            Actors
          </Link>
        </div>

        <div className="nav-right">
          <SearchBar onSearch={handleSearch} />
          
          {/* User Menu with Hamburger */}
          <UserMenu />
          
          <button 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="nav-links"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

