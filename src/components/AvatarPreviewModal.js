import React, { useEffect } from 'react';

const AvatarPreviewModal = ({ avatar, variant = 'round', onConfirm, onCancel }) => {
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [onCancel]);

  if (!avatar) return null;

  return (
    <div className="avatar-preview-modal" role="dialog" aria-modal="true">
      <div className="avatar-preview-backdrop" onClick={onCancel} aria-hidden="true" />

      <div className="avatar-preview-content">
        <button className="avatar-preview-close" onClick={onCancel} aria-label="Close preview">
          ✕
        </button>

        <div className="avatar-preview-display">
          <div className={`avatar-preview-image ${variant}`}>
            <img 
              src={avatar.imagePath} 
              alt={avatar.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '👤';
              }}
            />
          </div>
          <div className="avatar-preview-glow" aria-hidden="true" />
        </div>

        <div className="avatar-preview-actions">
          <button className="btn btn-secondary btn-lg" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary btn-lg" onClick={onConfirm} autoFocus>
            <span className="btn-icon" aria-hidden="true">✓</span>
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarPreviewModal;
