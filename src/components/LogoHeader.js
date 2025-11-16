import React from 'react';

/**
 * Reusable Logo Header Component
 * Used in Login, SignUp, and other public pages
 */
const LogoHeader = ({ subtitle }) => {
  return (
    <div className="logo-header">
      <div className="logo-container">
        <img src="/images/cv1.png" alt="CineVerse" className="logo-image" />
        <h1 className="logo-text">CineVerse</h1>
      </div>
      {subtitle && <p className="logo-subtitle">{subtitle}</p>}
    </div>
  );
};

export default LogoHeader;

