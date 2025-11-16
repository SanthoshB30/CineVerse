import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUpcomingMovies, getImageUrl } from '../api/contentstack';
import { trackProfileCreation } from '../services/analytics';

const AVATAR_OPTIONS = [
  '👤', '🎭', '🎬', '🎪', '🎨', '🎯', '🎮', '🎲',
  '🌟', '⭐', '💫', '✨', '🔥', '💎', '👑', '🎩',
  '🦸', '🦹', '🧙', '🧛', '🧜', '🧚', '👻', '👽'
];

const CreateProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [error, setError] = useState('');
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { user, updateUserProfiles, selectProfile } = useAuth();

  // Fetch upcoming movies from Contentstack
  useEffect(() => {
    loadUpcomingMovies();
    
    // Load existing profiles if any
    if (user?.profiles) {
      setProfiles(user.profiles);
    }
  }, [user]);

  // Slideshow rotation
  useEffect(() => {
    if (backgroundImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [backgroundImages]);

  const loadUpcomingMovies = async () => {
    try {
      const upcomingMovies = await getUpcomingMovies();
      
      // Extract backdrop/banner images from upcoming movies
      if (upcomingMovies && upcomingMovies.length > 0) {
        const images = upcomingMovies
          .map(movie => getImageUrl(movie.banner_image) || getImageUrl(movie.poster_image))
          .filter(url => url !== null)
          .slice(0, 5);
        
        // If we have images from Contentstack, use them; otherwise use fallback
        if (images.length > 0) {
          setBackgroundImages(images);
        } else {
          // Fallback images
          setBackgroundImages([
            'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop',
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
            'https://images.unsplash.com/photo-1574267432644-f909a57bc26d?w=1920&h=1080&fit=crop',
            'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1920&h=1080&fit=crop',
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop'
          ]);
        }
      } else {
        // Fallback if no upcoming movies
        setBackgroundImages([
          'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop',
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
          'https://images.unsplash.com/photo-1574267432644-f909a57bc26d?w=1920&h=1080&fit=crop'
        ]);
      }
    } catch (error) {
      console.error('Error loading upcoming movies:', error);
      // Use fallback images on error
      setBackgroundImages([
        'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop'
      ]);
    }
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    if (profiles.length >= 4) {
      setError('Maximum 4 profiles allowed');
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      avatar: selectedAvatar
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    updateUserProfiles(updatedProfiles);
    
    // Track profile creation
    trackProfileCreation(newProfile.id, newProfile.name);
    
    setNewProfileName('');
    setSelectedAvatar(AVATAR_OPTIONS[0]);
    setShowCreateForm(false);
    setError('');
  };

  const handleSelectProfile = (profile) => {
    selectProfile(profile);
    navigate('/home');
  };

  const handleDeleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    updateUserProfiles(updatedProfiles);
  };

  return (
    <div className="profile-page">
      <div 
        className="profile-background"
        style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
      >
        <div className="profile-background-overlay"></div>
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <h1 className="profile-title">Who's watching CineVerse?</h1>
        </div>

        <div className="profiles-container">
          <div className="profiles-grid">
            {profiles.map((profile) => (
              <div key={profile.id} className="profile-item">
                <button
                  className="profile-avatar-button"
                  onClick={() => handleSelectProfile(profile)}
                >
                  <div className="profile-avatar">{profile.avatar}</div>
                  <span className="profile-name">{profile.name}</span>
                </button>
                <button
                  className="profile-delete-button"
                  onClick={() => handleDeleteProfile(profile.id)}
                  title="Delete profile"
                >
                  ✕
                </button>
              </div>
            ))}

            {profiles.length < 4 && !showCreateForm && (
              <div className="profile-item">
                <button
                  className="profile-avatar-button add-profile"
                  onClick={() => setShowCreateForm(true)}
                >
                  <div className="profile-avatar add-avatar">+</div>
                  <span className="profile-name">Add Profile</span>
                </button>
              </div>
            )}
          </div>

          {showCreateForm && (
            <div className="profile-create-form">
              <h3>Create New Profile</h3>
              
              <div className="avatar-selector">
                <p>Select Avatar:</p>
                <div className="avatar-grid">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={avatar}
                      className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                      onClick={() => setSelectedAvatar(avatar)}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                className="form-input"
                placeholder="Profile name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                maxLength={20}
                autoFocus
              />

              {error && (
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}

              <div className="form-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError('');
                    setNewProfileName('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateProfile}
                >
                  Create Profile
                </button>
              </div>
            </div>
          )}

          {profiles.length > 0 && !showCreateForm && (
            <div className="profile-continue">
              <p className="profile-hint">Select a profile to continue</p>
            </div>
          )}

          {profiles.length === 0 && !showCreateForm && (
            <div className="profile-continue">
              <p className="profile-hint">Create your first profile to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;

