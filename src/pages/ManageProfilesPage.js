import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllGenres } from '../api/contentstack';
import AvatarGallery from '../components/AvatarGallery';
import ProfileAvatar from '../components/ProfileAvatar';
import { DEFAULT_AVATAR } from '../data/avatars';

const ManageProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: DEFAULT_AVATAR.id,
    isKids: false,
    preferredLanguage: 'english',
    favoriteGenre: ''
  });
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const { user, updateUserProfiles } = useAuth();

  useEffect(() => {
    if (user?.profiles) {
      setProfiles(user.profiles);
    }
    loadGenres();
  }, [user]);

  const loadGenres = async () => {
    try {
      const genresData = await getAllGenres();
      setGenres(genresData);
    } catch (error) {
      setGenres([]);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      avatar: DEFAULT_AVATAR.id,
      isKids: false,
      preferredLanguage: 'english',
      favoriteGenre: ''
    });
    setError('');
  };

  const handleCreateProfile = async () => {
    if (!formData.name.trim()) {
      setError('Please enter a profile name');
      return;
    }

    if (profiles.length >= 4) {
      setError('Maximum 4 profiles allowed');
      return;
    }

    const newProfile = {
      profile_name: formData.name.trim(),
      avatar: formData.avatar,
      is_kid: formData.isKids,
      preferred_language: formData.preferredLanguage,
      favorite_genre: formData.favoriteGenre || null
    };

    try {
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      await updateUserProfiles(updatedProfiles);
      
      resetForm();
      setShowCreateForm(false);
    } catch (error) {
      setError('Failed to create profile. Please try again.');
      setProfiles(profiles);
    }
  };

  const handleEditProfile = (profileIndex) => {
    const profile = profiles[profileIndex];
    setEditingProfile(profileIndex);
    setFormData({
      name: profile.profile_name,
      avatar: profile.avatar,
      isKids: profile.is_kid || false,
      preferredLanguage: profile.preferred_language || 'english',
      favoriteGenre: profile.favorite_genre || ''
    });
    setShowCreateForm(false);
    setError('');
    
    // Scroll to form for better UX
    setTimeout(() => {
      const formSection = document.querySelector('.profile-form-section');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSaveEdit = async () => {
    if (!formData.name.trim()) {
      setError('Please enter a profile name');
      return;
    }

    const previousProfiles = [...profiles];
    const updatedProfiles = profiles.map((p, index) => 
      index === editingProfile 
        ? { 
            ...p, 
            profile_name: formData.name.trim(), 
            avatar: formData.avatar, 
            is_kid: formData.isKids,
            preferred_language: formData.preferredLanguage,
            favorite_genre: formData.favoriteGenre || null
          }
        : p
    );

    try {
      setProfiles(updatedProfiles);
      await updateUserProfiles(updatedProfiles);
      
      resetForm();
      setEditingProfile(null);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      setProfiles(previousProfiles);
    }
  };

  const handleDeleteProfile = async (profileIndex) => {
    if (deleteConfirm === profileIndex) {
      const previousProfiles = [...profiles];
      const updatedProfiles = profiles.filter((_, index) => index !== profileIndex);
      
      try {
        setProfiles(updatedProfiles);
        await updateUserProfiles(updatedProfiles);
        setDeleteConfirm(null);
      } catch (error) {
        setError('Failed to delete profile. Please try again.');
        setProfiles(previousProfiles);
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(profileIndex);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingProfile(null);
    setShowCreateForm(false);
    setDeleteConfirm(null);
    setError('');
  };

  return (
    <div className="manage-profiles-page">
      <div className="manage-profiles-container">
        <div className="manage-profiles-header">
          <h1 className="manage-profiles-title">👥 Manage Profiles</h1>
          <p className="manage-profiles-subtitle">
            Add, edit, or delete profiles. Maximum 4 profiles allowed.
          </p>
          <button 
            className="btn btn-secondary back-btn"
            onClick={() => navigate('/home')}
          >
            ← Back to Home
          </button>
        </div>

        {/* Profiles List */}
        <div className="profiles-management-grid">
          {profiles.map((profile, index) => (
            <div key={profile._metadata?.uid || index} className="manage-profile-card">
              <div className="profile-card-header">
                <div className="profile-display">
                  <ProfileAvatar
                    avatarId={profile.avatar}
                    size="xlarge"
                    variant="round"
                    showGlow={true}
                    className={profile.is_kid ? 'kids-profile' : ''}
                  />
                  <div className="profile-details">
                    <h3 className="profile-card-name">{profile.profile_name}</h3>
                    {profile.is_kid && <span className="kids-badge">👶 Kids Profile</span>}
                    {profile.preferred_language && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        🌐 Language: <span style={{ textTransform: 'capitalize' }}>{profile.preferred_language}</span>
                      </div>
                    )}
                    {profile.favorite_genre && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        🎬 Favorite: <span style={{ textTransform: 'capitalize' }}>{profile.favorite_genre}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-card-actions">
                <button
                  className="btn-action btn-edit-action"
                  onClick={() => handleEditProfile(index)}
                >
                  ✏️ Edit
                </button>
                <button
                  className={`btn-action btn-delete-action ${deleteConfirm === index ? 'confirm' : ''}`}
                  onClick={() => handleDeleteProfile(index)}
                >
                  {deleteConfirm === index ? '⚠️ Confirm?' : '🗑️ Delete'}
                </button>
              </div>
            </div>
          ))}

          {/* Add New Profile Card */}
          {profiles.length < 4 && !showCreateForm && editingProfile === null && (
            <div className="manage-profile-card add-profile-card">
              <button
                className="add-profile-button"
                onClick={() => setShowCreateForm(true)}
              >
                <div className="add-icon">+</div>
                <span>Add New Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingProfile !== null) && (
          <div className="profile-form-section">
            <h2 className="form-title">
              {editingProfile !== null ? '✏️ Edit Profile' : '➕ Create New Profile'}
            </h2>

            <div className="form-content">
              <div className="form-group">
                <label>Profile Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter profile name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={20}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <AvatarGallery
                  selectedAvatarId={formData.avatar}
                  onSelectAvatar={(avatarId) => setFormData({ ...formData, avatar: avatarId })}
                  variant="round"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={formData.isKids}
                    onChange={(e) => setFormData({ ...formData, isKids: e.target.checked })}
                  />
                  <span className="checkbox-label">
                    👶 Kids Profile (Restricted content)
                  </span>
                </label>
                <p className="form-help-text">
                  Kids profiles have age-appropriate content and parental controls
                </p>
              </div>

              <div className="form-group">
                <label>🌐 Preferred Language</label>
                <select
                  className="form-input"
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                >
                  <option value="english">English (Hollywood)</option>
                  <option value="tamil">Tamil</option>
                  <option value="hindi">Hindi</option>
                  <option value="telugu">Telugu</option>
                  <option value="malayalam">Malayalam</option>
                  <option value="kannada">Kannada</option>
                </select>
                <p className="form-help-text">
                  Movies in this language will be prioritized
                </p>
              </div>

              <div className="form-group">
                <label>🎬 Favorite Genre (Optional)</label>
                <select
                  className="form-input"
                  value={formData.favoriteGenre}
                  onChange={(e) => setFormData({ ...formData, favoriteGenre: e.target.value })}
                >
                  <option value="">Select a genre...</option>
                  {genres.map((genre) => (
                    <option key={genre.uid} value={genre.slug}>
                      {genre.name || genre.title}
                    </option>
                  ))}
                </select>
                <p className="form-help-text">
                  Get personalized recommendations based on your favorite genre
                </p>
              </div>

              {error && (
                <div className="form-error">
                  ⚠️ {error}
                </div>
              )}

              <div className="form-actions-row">
                <button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={editingProfile !== null ? handleSaveEdit : handleCreateProfile}
                >
                  {editingProfile !== null ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{profiles.length}</span>
            <span className="stat-label">Active Profiles</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{4 - profiles.length}</span>
            <span className="stat-label">Available Slots</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{profiles.filter(p => p.is_kid).length}</span>
            <span className="stat-label">Kids Profiles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProfilesPage;

