import React from 'react';
import { AVATARS } from '../data/avatars';
import AvatarPreviewModal from './AvatarPreviewModal';

const AvatarGallery = ({ selectedAvatarId, onSelectAvatar, variant = 'round' }) => {
  const [previewAvatar, setPreviewAvatar] = React.useState(null);

  const handleAvatarClick = (avatar) => {
    setPreviewAvatar(avatar);
  };

  const handleConfirmSelection = () => {
    if (previewAvatar) {
      onSelectAvatar(previewAvatar.id);
      setPreviewAvatar(null);
    }
  };

  const handleCancelPreview = () => {
    setPreviewAvatar(null);
  };

  return (
    <div className="avatar-gallery-container">
      <div className="avatar-gallery-header">
        <h3 className="avatar-gallery-title">Choose Your Avatar</h3>
      </div>

      <div className="avatar-section">
        <div className="avatar-grid main-grid">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              className={`avatar-item ${variant} ${selectedAvatarId === avatar.id ? 'selected' : ''}`}
              onClick={() => handleAvatarClick(avatar)}
              aria-label={`Select ${avatar.name} avatar`}
              aria-pressed={selectedAvatarId === avatar.id}
            >
              <div className="avatar-image-container">
                <div className="avatar-image">
                  <img 
                    src={avatar.imagePath} 
                    alt={avatar.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '👤';
                    }}
                  />
                </div>
                {selectedAvatarId === avatar.id && (
                  <div className="avatar-selected-indicator" aria-hidden="true">
                    <span>✓</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {previewAvatar && (
        <AvatarPreviewModal
          avatar={previewAvatar}
          variant={variant}
          onConfirm={handleConfirmSelection}
          onCancel={handleCancelPreview}
        />
      )}
    </div>
  );
};

export default AvatarGallery;
