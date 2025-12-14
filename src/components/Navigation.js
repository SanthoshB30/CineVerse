import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProfile } = useAuth();
  const { watchlistCount } = useWatchlist();

  // Check if Kids mode is active
  const isKidsMode = selectedProfile?.is_kid;

  // Build home URL with query params based on selected profile
  const homeUrl = useMemo(() => {
    if (!selectedProfile) return '/home';
    
    const params = [];
    if (selectedProfile.preferred_language) {
      params.push(`preferred_language=${encodeURIComponent(selectedProfile.preferred_language)}`);
    }
    if (selectedProfile.is_kid) {
      params.push('isKids=true');
    }
    
    return params.length > 0 ? `/home?${params.join('&')}` : '/home';
  }, [selectedProfile]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <Link to={homeUrl} className="nav-logo" aria-label="CineVerse Home">
          <img src="/images/cv1.png" alt="" className="nav-logo-image" aria-hidden="true" />
          <span className="nav-logo-text">CineVerse</span>
        </Link>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} role="menubar">
          <Link 
            to={homeUrl} 
            className={`nav-link ${isActiveLink('/home') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/home') ? 'page' : undefined}
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            className={`nav-link ${isActiveLink('/movies') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/movies') ? 'page' : undefined}
          >
            Movies
          </Link>
          {/* Hide Genres, Directors, Actors in Kids mode */}
          {!isKidsMode && (
            <>
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
            </>
          )}
          <Link 
            to="/watchlist" 
            className={`nav-link nav-link-watchlist ${isActiveLink('/watchlist') ? 'active' : ''}`}
            role="menuitem"
            aria-current={isActiveLink('/watchlist') ? 'page' : undefined}
          >
            <span className="watchlist-nav-icon">🎬</span>
            Watchlist
            {watchlistCount > 0 && (
              <span className="watchlist-badge">{watchlistCount}</span>
            )}
          </Link>
        </div>

        <div className="nav-right">
          <SearchBar onSearch={handleSearch} />
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

