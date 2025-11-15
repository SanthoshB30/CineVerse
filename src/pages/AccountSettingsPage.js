import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountSettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      // In a real app, this would call an API to delete the account
      logout();
      navigate('/signup');
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="account-settings-page">
      <div className="settings-container">
        <h1 className="settings-title">⚙️ Account Settings</h1>
        
        {/* Tab Navigation */}
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            👤 Account
          </button>
          <button 
            className={`settings-tab ${activeTab === 'profiles' ? 'active' : ''}`}
            onClick={() => setActiveTab('profiles')}
          >
            👥 Profiles
          </button>
          <button 
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button 
            className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            🎨 Preferences
          </button>
          <button 
            className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            🛡️ Privacy
          </button>
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2 className="section-heading">Account Information</h2>
              
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Username</h3>
                  <p className="setting-value">{user?.username}</p>
                </div>
                <button className="btn-edit">Edit</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Email Address</h3>
                  <p className="setting-value">{user?.email || 'demo@cineverse.com'}</p>
                </div>
                <button className="btn-edit">Edit</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Phone Number</h3>
                  <p className="setting-value">+1 (555) 123-4567</p>
                </div>
                <button className="btn-edit">Edit</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Membership Plan</h3>
                  <p className="setting-value">Premium - $14.99/month</p>
                  <p className="setting-description">Next billing date: January 15, 2025</p>
                </div>
                <button className="btn-edit">Manage Plan</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Payment Method</h3>
                  <p className="setting-value">•••• •••• •••• 4242</p>
                  <p className="setting-description">Visa ending in 4242</p>
                </div>
                <button className="btn-edit">Update</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Billing History</h3>
                  <p className="setting-description">View and download your past invoices</p>
                </div>
                <button className="btn-edit">View History</button>
              </div>
            </div>
          )}

          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="settings-section">
              <h2 className="section-heading">Profile Management</h2>
              
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Active Profiles</h3>
                  <p className="setting-value">{user?.profiles?.length || 0} of 4 profiles</p>
                  <p className="setting-description">Manage who can watch on your account</p>
                </div>
                <button className="btn-edit" onClick={() => navigate('/profiles')}>
                  Manage Profiles
                </button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Profile Transfer</h3>
                  <p className="setting-description">Transfer a profile to a new account</p>
                </div>
                <button className="btn-edit">Transfer</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Kids Profile Protection</h3>
                  <p className="setting-description">Enable PIN protection for profile access</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Profile Icons</h3>
                  <p className="setting-description">Customize profile avatars and icons</p>
                </div>
                <button className="btn-edit">Customize</button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2 className="section-heading">Security Settings</h2>
              
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Password</h3>
                  <p className="setting-description">Last changed 30 days ago</p>
                </div>
                <button className="btn-edit">Change Password</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Two-Factor Authentication</h3>
                  <p className="setting-description">Add an extra layer of security</p>
                </div>
                <button className="btn-edit">Enable 2FA</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Active Sessions</h3>
                  <p className="setting-description">Manage devices logged into your account</p>
                </div>
                <button className="btn-edit">View Sessions</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Sign Out All Devices</h3>
                  <p className="setting-description">Sign out from all devices except this one</p>
                </div>
                <button className="btn-edit">Sign Out All</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Login Activity</h3>
                  <p className="setting-description">Review recent login attempts</p>
                </div>
                <button className="btn-edit">View Activity</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Security Questions</h3>
                  <p className="setting-description">Set up account recovery options</p>
                </div>
                <button className="btn-edit">Setup</button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="section-heading">Notification Preferences</h2>
              
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Email Notifications</h3>
                  <p className="setting-description">Receive updates about new movies and shows</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Push Notifications</h3>
                  <p className="setting-description">Get notifications on your devices</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>New Releases</h3>
                  <p className="setting-description">Notify me when new content is added</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Recommendations</h3>
                  <p className="setting-description">Personalized content suggestions</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Reminders</h3>
                  <p className="setting-description">Remind me about saved content</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Marketing Emails</h3>
                  <p className="setting-description">Special offers and promotions</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>SMS Notifications</h3>
                  <p className="setting-description">Text message alerts</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2 className="section-heading">Viewing Preferences</h2>
              
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Language</h3>
                  <p className="setting-value">English (US)</p>
                </div>
                <button className="btn-edit">Change</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Subtitle Appearance</h3>
                  <p className="setting-description">Customize subtitle font, size, and color</p>
                </div>
                <button className="btn-edit">Customize</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Autoplay Next Episode</h3>
                  <p className="setting-description">Automatically play the next episode</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Autoplay Previews</h3>
                  <p className="setting-description">Play previews while browsing</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Video Quality</h3>
                  <p className="setting-value">Auto (up to 4K)</p>
                  <p className="setting-description">Adjust data usage per screen</p>
                </div>
                <button className="btn-edit">Manage</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Playback Settings</h3>
                  <p className="setting-description">Skip intro, credits, and recaps</p>
                </div>
                <button className="btn-edit">Configure</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Content Maturity Rating</h3>
                  <p className="setting-value">All Maturity Levels</p>
                </div>
                <button className="btn-edit">Change</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Download Quality</h3>
                  <p className="setting-value">Standard</p>
                  <p className="setting-description">Higher quality takes more space</p>
                </div>
                <button className="btn-edit">Change</button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2 className="section-heading">Privacy & Data</h2>
              
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Viewing Activity</h3>
                  <p className="setting-description">See and manage your watch history</p>
                </div>
                <button className="btn-edit">View Activity</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Clear Viewing History</h3>
                  <p className="setting-description">Remove all watched content from your history</p>
                </div>
                <button className="btn-edit btn-danger">Clear History</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Ratings</h3>
                  <p className="setting-description">View and manage your ratings</p>
                </div>
                <button className="btn-edit">Manage Ratings</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Download Your Data</h3>
                  <p className="setting-description">Get a copy of your personal information</p>
                </div>
                <button className="btn-edit">Request Data</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Personalization</h3>
                  <p className="setting-description">Use viewing activity for recommendations</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Cookies & Tracking</h3>
                  <p className="setting-description">Manage cookie preferences</p>
                </div>
                <button className="btn-edit">Manage</button>
              </div>

              <div className="settings-item">
                <div className="setting-info">
                  <h3>Third-Party Data Sharing</h3>
                  <p className="setting-description">Control data shared with partners</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item danger-zone">
                <div className="setting-info">
                  <h3>Delete Account</h3>
                  <p className="setting-description">Permanently delete your account and all data</p>
                </div>
                <button 
                  className={`btn-edit btn-danger ${showDeleteConfirm ? 'confirm' : ''}`}
                  onClick={handleDeleteAccount}
                >
                  {showDeleteConfirm ? 'Click Again to Confirm' : 'Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;

