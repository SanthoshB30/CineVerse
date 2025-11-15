import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const { logout, selectedProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears user, selected profile, local/session storage
    navigate("/login");
  };

  return (
    <div className="user-menu-container">
      {/* Hamburger icon */}
      <div 
        className="hamburger-menu" 
        onClick={() => setOpen(!open)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <strong>{selectedProfile?.name || "User"}</strong>
          </div>
          <button
            className="user-menu-item"
            onClick={() => {
              setOpen(false);
              navigate("/profiles");
            }}
          >
            👥 Manage Profiles
          </button>
          <button
            className="user-menu-item"
            onClick={() => {
              setOpen(false);
              navigate("/switch-profile");
            }}
          >
            🔄 Switch Profile
          </button>
          <button
            className="user-menu-item"
            onClick={() => {
              setOpen(false);
              navigate("/account");
            }}
          >
            ⚙️ Account Settings
          </button>
          <button
            className="user-menu-item logout-button"
            onClick={handleLogout}
          >
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

