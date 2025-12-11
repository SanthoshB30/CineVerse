import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUpcomingMovies, getImageUrl, getAllGenres } from '../api/contentstack';
import { trackProfileCreation } from '../services/analytics';
import { setProfileTraits } from '../personalize/personalizeHelpers';
import AvatarGallery from '../components/AvatarGallery';
import ProfileAvatar from '../components/ProfileAvatar';
import { DEFAULT_AVATAR } from '../data/avatars';

const CreateProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR.id);
  const [isKid, setIsKid] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('english');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [error, setError] = useState('');
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUserProfiles, selectProfile } = useAuth();

  useEffect(() => {
    loadUpcomingMovies();
    loadGenres();
    
    if (user?.profiles) {
      setProfiles(user.profiles);
    }

    if (location.state?.openForm && user?.profiles?.length < 4) {
      setShowCreateForm(true);
    }
  }, [user, location.state]);

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
      
      if (upcomingMovies && upcomingMovies.length > 0) {
        const images = upcomingMovies
          .map(movie => getImageUrl(movie.banner_image) || getImageUrl(movie.poster_image))
          .filter(url => url !== null)
          .slice(0, 5);
        
        if (images.length > 0) {
          setBackgroundImages(images);
        } else {
          setBackgroundImages([
            'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop',
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
            'https://images.unsplash.com/photo-1574267432644-f909a57bc26d?w=1920&h=1080&fit=crop',
            'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1920&h=1080&fit=crop',
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop'
          ]);
        }
      } else {
        setBackgroundImages([
          'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop',
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
          'https://images.unsplash.com/photo-1574267432644-f909a57bc26d?w=1920&h=1080&fit=crop'
        ]);
      }
    } catch (error) {
      setBackgroundImages([
        'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop'
      ]);
    }
  };

  const loadGenres = async () => {
    try {
      const genresData = await getAllGenres();
      setGenres(genresData);
    } catch (error) {
      setGenres([]);
    }
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    if (profiles.length >= 4) {
      setError('Maximum 4 profiles allowed');
      return;
    }

    const newProfile = {
      profile_name: newProfileName.trim(),
      avatar: selectedAvatar,
      is_kid: isKid,
      preferred_language: preferredLanguage,
      favorite_genre: favoriteGenre || null
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    
    try {
      await updateUserProfiles(updatedProfiles);
      trackProfileCreation(newProfile.profile_name, newProfile.profile_name);
      setProfileTraits(newProfile, user);
      
      setNewProfileName('');
      setSelectedAvatar(DEFAULT_AVATAR.id);
      setIsKid(false);
      setPreferredLanguage('english');
      setFavoriteGenre('');
      setShowCreateForm(false);
      setError('');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError('Failed to save profile. Please try again.');
    }
  };

  const handleSelectProfile = (profile) => {
    selectProfile(profile);
    
    // Navigate with preferred_language in URL for Personalization
    const preferredLanguage = profile.preferred_language || 'english';
    navigate(`/home?preferred_language=${preferredLanguage}`);
  };

  const handleDeleteProfile = async (profileIndex) => {
    const previousProfiles = [...profiles];
    const updatedProfiles = profiles.filter((_, index) => index !== profileIndex);
    
    setProfiles(updatedProfiles);
    
    try {
      await updateUserProfiles(updatedProfiles);
    } catch (error) {
      setProfiles(previousProfiles);
      setError('Failed to delete profile. Please try again.');
    }
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
            {profiles.map((profile, index) => (
              <div key={profile._metadata?.uid || index} className="profile-item">
                <button
                  className="profile-avatar-button"
                  onClick={() => handleSelectProfile(profile)}
                >
                  <ProfileAvatar
                    avatarId={profile.avatar}
                    size="large"
                    variant="round"
                    showGlow={false}
                  />
                  <span className="profile-name">
                    {profile.profile_name}
                    {profile.is_kid && <span style={{ fontSize: '0.9rem', marginLeft: '0.3rem' }}>👶</span>}
                  </span>
                </button>
                <button
                  className="profile-delete-button"
                  onClick={() => handleDeleteProfile(index)}
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
                <AvatarGallery
                  selectedAvatarId={selectedAvatar}
                  onSelectAvatar={setSelectedAvatar}
                  variant="round"
                />
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

              <div className="form-group" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isKid}
                    onChange={(e) => setIsKid(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1rem' }}>👶 Kids Profile (Age-appropriate content)</span>
                </label>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginLeft: '1.8rem' }}>
                  Kids profiles have restricted content and parental controls
                </p>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '500' }}>
                  🌐 Preferred Language
                </label>
                <select
                  className="form-input"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                >
                  <option value="english">English (Hollywood)</option>
                  <option value="tamil">Tamil</option>
                  <option value="hindi">Hindi</option>
                  <option value="telugu">Telugu</option>
                  <option value="malayalam">Malayalam</option>
                  <option value="kannada">Kannada</option>
                </select>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Movies in this language will be prioritized
                </p>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '500' }}>
                  🎬 Favorite Genre (Optional)
                </label>
                <select
                  className="form-input"
                  value={favoriteGenre}
                  onChange={(e) => setFavoriteGenre(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                >
                  <option value="">Select a genre...</option>
                  {genres.map((genre) => (
                    <option key={genre.uid} value={genre.slug}>
                      {genre.name || genre.title}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Get personalized recommendations based on your favorite genre
                </p>
              </div>

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
                    setIsKid(false);
                    setPreferredLanguage('english');
                    setFavoriteGenre('');
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

