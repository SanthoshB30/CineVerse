import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  // Simulated upcoming movies slideshow
  const upcomingMoviesImages = [
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1574267432644-f909a57bc26d?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop'
  ];

  useEffect(() => {
    setBackgroundImages(upcomingMoviesImages);
    
    // Load existing profiles if any
    if (user?.profiles) {
      setProfiles(user.profiles);
    }

    // Slideshow rotation
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % upcomingMoviesImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

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

