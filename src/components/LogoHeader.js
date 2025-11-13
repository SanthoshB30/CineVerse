import React from 'react';

/**
 * Reusable Logo Header Component
 * Used in Login, SignUp, and other public pages
 */
const LogoHeader = ({ subtitle }) => {
  return (
    <div className="logo-header">
      <h1 className="logo">🎬 CineVerse</h1>
      {subtitle && <p className="logo-subtitle">{subtitle}</p>}
    </div>
  );
};

export default LogoHeader;

