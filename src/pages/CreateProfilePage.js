import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUpcomingMovies, getImageUrl } from '../api/contentstack';
import { trackProfileCreation } from '../services/analytics';
import { setProfileTraits } from '../personalize/personalizeHelpers';

const AVATAR_OPTIONS = [
  '😀', '😎', '🤓', '😊', '🥳', '🤩',
  '🐶', '🐱', '🐼', '🦁', '🐯', '🐸'
];

const CreateProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [isKid, setIsKid] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('english');
  const [favoriteGenre, setFavoriteGenre] = useState('');
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
      console.log('📥 Loading existing profiles from user:', user.profiles);
      setProfiles(user.profiles);
    } else {
      console.log('⚠️ No existing profiles found for user');
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

    console.log('🎭 Creating new profile:', newProfile);

    const updatedProfiles = [...profiles, newProfile];
    console.log('📊 All profiles after creation:', updatedProfiles);
    
    setProfiles(updatedProfiles);
    
    // Update user profiles (this will save to Contentstack and localStorage)
    try {
      await updateUserProfiles(updatedProfiles);
      console.log('✅ Profile saved successfully');
      
      // Track profile creation
      trackProfileCreation(newProfile.profile_name, newProfile.profile_name);
      
      // Set personalize traits for the newly created profile
      setProfileTraits(newProfile, user);
      
      setNewProfileName('');
      setSelectedAvatar(AVATAR_OPTIONS[0]);
      setIsKid(false);
      setPreferredLanguage('english');
      setFavoriteGenre('');
      setShowCreateForm(false);
      setError('');
    } catch (error) {
      console.error('❌ Failed to save profile:', error);
      setError('Failed to save profile. Please try again.');
    }
  };

  const handleSelectProfile = (profile) => {
    selectProfile(profile);
    navigate('/home');
  };

  const handleDeleteProfile = async (profileIndex) => {
    console.log('🗑️ Deleting profile at index:', profileIndex);
    const updatedProfiles = profiles.filter((_, index) => index !== profileIndex);
    console.log('📊 Profiles after deletion:', updatedProfiles);
    
    setProfiles(updatedProfiles);
    
    try {
      await updateUserProfiles(updatedProfiles);
      console.log('✅ Profile deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete profile:', error);
      // Revert the deletion on error
      setProfiles(profiles);
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
                  <div className="profile-avatar">{profile.avatar}</div>
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
                  <option value="action">Action</option>
                  <option value="comedy">Comedy</option>
                  <option value="drama">Drama</option>
                  <option value="horror">Horror</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="thriller">Thriller</option>
                  <option value="romance">Romance</option>
                  <option value="adventure">Adventure</option>
                  <option value="animation">Animation</option>
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

