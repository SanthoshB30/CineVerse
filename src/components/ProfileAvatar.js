import React from 'react';
import { getAvatarById, DEFAULT_AVATAR } from '../data/avatars';

/**
 * ProfileAvatar Component
 * Displays user profile avatars with consistent styling
 * Supports round/square variants, sizes, and cinematic effects
 */
const ProfileAvatar = ({
  avatarId,
  size = 'medium',
  variant = 'round',
  showGlow = false,
  className = '',
  alt = 'Profile avatar'
}) => {
  const avatar = getAvatarById(avatarId) || DEFAULT_AVATAR;

  const sizeClasses = {
    small: 'avatar-size-sm',
    medium: 'avatar-size-md',
    large: 'avatar-size-lg',
    xlarge: 'avatar-size-xl'
  };

  const variantClass = variant === 'square' ? 'avatar-square' : 'avatar-round';
  const glowClass = showGlow ? 'avatar-with-glow' : '';
  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div
      className={`profile-avatar-component ${variantClass} ${sizeClass} ${glowClass} ${className}`}
      role="img"
      aria-label={alt || avatar.name}
    >
      <div className="avatar-inner">
        <img 
          src={avatar.imagePath} 
          alt={alt || avatar.name}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '👤';
          }}
        />
      </div>
      {showGlow && (
        <div className="avatar-glow-effect" aria-hidden="true" />
      )}
    </div>
  );
};

export default ProfileAvatar;

