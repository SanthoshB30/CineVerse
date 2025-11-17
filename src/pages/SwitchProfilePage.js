import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SwitchProfilePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { user, selectProfile } = useAuth();

  const upcomingMoviesImages = [
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1574267432644-f909a57bc26d?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop'
  ];

  useEffect(() => {
    // Redirect if no profiles exist
    if (!user?.profiles || user.profiles.length === 0) {
      navigate('/create-profile');
      return;
    }

    // Slideshow rotation
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % upcomingMoviesImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleSelectProfile = (profile) => {
    selectProfile(profile);
    
    // Navigate with preferred_language in URL for Personalization
    const preferredLanguage = profile.preferred_language || 'english';
    navigate(`/home?preferred_language=${preferredLanguage}`);
  };

  if (!user?.profiles || user.profiles.length === 0) {
    return null;
  }

  return (
    <div className="profile-page">
      <div 
        className="profile-background"
        style={{ backgroundImage: `url(${upcomingMoviesImages[currentImageIndex]})` }}
      >
        <div className="profile-background-overlay"></div>
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <h1 className="profile-title">Switch Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1rem' }}>
            Select a profile to continue watching
          </p>
        </div>

        <div className="profiles-container">
          <div className="profiles-grid">
            {user.profiles.map((profile, index) => (
              <div key={profile._metadata?.uid || index} className="profile-item">
                <button
                  className="profile-avatar-button"
                  onClick={() => handleSelectProfile(profile)}
                >
                  <div className="profile-avatar">{profile.avatar}</div>
                  <span className="profile-name">
                    {profile.profile_name}
                    {profile.is_kid && <span style={{ fontSize: '0.9rem', marginLeft: '0.3rem' }}>👶</span>}
                  </span>
                  {profile.preferred_language && (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)', 
                      marginTop: '0.25rem',
                      textTransform: 'capitalize'
                    }}>
                      🌐 {profile.preferred_language}
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="profile-manage">
            <button 
              onClick={() => navigate('/home')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchProfilePage;

