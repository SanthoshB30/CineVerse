import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">
          🎬 CineVerse
        </Link>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/genres" className="nav-link">Genres</Link>
          <Link to="/directors" className="nav-link">Directors</Link>
          <Link to="/actors" className="nav-link">Actors</Link>
        </div>

        <div className="nav-right">
          <SearchBar onSearch={handleSearch} />
          
          {/* User Menu with Hamburger */}
          <UserMenu />
          
          <button 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

