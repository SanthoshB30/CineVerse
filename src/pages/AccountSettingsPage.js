import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Accordion, Toggle } from '../components/ui';

const AccountSettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newReleases: true,
    recommendations: true,
    reminders: false,
    marketingEmails: false,
    smsNotifications: false,
    kidsProfileProtection: false,
    autoplayNextEpisode: true,
    autoplayPreviews: true,
    personalization: true,
    thirdPartySharing: false,
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      logout();
      navigate('/signup');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  // Helper component for setting rows with edit button
  const SettingRow = ({ label, value, description, action, onAction, variant = 'default' }) => (
    <div className="setting-row">
      <div className="setting-row-info">
        <div className="setting-row-label">{label}</div>
        {value && <div className="setting-row-value">{value}</div>}
        {description && <div className="setting-row-value">{description}</div>}
      </div>
      {action && (
        <button
          className={`btn btn-${variant} btn-sm setting-row-action`}
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  );

  // Accordion items configuration
  const accordionItems = [
    {
      icon: '👤',
      title: 'Account Information',
      badge: null,
      content: (
        <div className="settings-group">
          <SettingRow
            label="Username"
            value={user?.username}
            action="Edit"
            onAction={() => {}}
          />
          <SettingRow
            label="Email Address"
            value={user?.email || 'demo@cineverse.com'}
            action="Edit"
            onAction={() => {}}
          />
          <SettingRow
            label="Phone Number"
            value="+1 (555) 123-4567"
            action="Edit"
            onAction={() => {}}
          />
          <SettingRow
            label="Membership Plan"
            value="Premium - $14.99/month"
            description="Next billing date: January 15, 2025"
            action="Manage Plan"
            onAction={() => {}}
          />
          <SettingRow
            label="Payment Method"
            value="•••• •••• •••• 4242"
            description="Visa ending in 4242"
            action="Update"
            onAction={() => {}}
          />
          <SettingRow
            label="Billing History"
            description="View and download your past invoices"
            action="View History"
            onAction={() => {}}
          />
        </div>
      ),
    },
    {
      icon: '👥',
      title: 'Profile Management',
      badge: user?.profiles?.length || 0,
      content: (
        <div className="settings-group">
          <SettingRow
            label="Active Profiles"
            value={`${user?.profiles?.length || 0} of 4 profiles`}
            description="Manage who can watch on your account"
            action="Manage Profiles"
            onAction={() => navigate('/profiles')}
          />
          <SettingRow
            label="Profile Transfer"
            description="Transfer a profile to a new account"
            action="Transfer"
            onAction={() => {}}
          />
          <Toggle
            checked={settings.kidsProfileProtection}
            onChange={(checked) => updateSetting('kidsProfileProtection', checked)}
            label="Kids Profile Protection"
            description="Enable PIN protection for profile access"
          />
          <SettingRow
            label="Profile Icons"
            description="Customize profile avatars and icons"
            action="Customize"
            onAction={() => navigate('/profiles')}
          />
        </div>
      ),
    },
    {
      icon: '🔒',
      title: 'Security Settings',
      badge: null,
      content: (
        <div className="settings-group">
          <SettingRow
            label="Password"
            description="Last changed 30 days ago"
            action="Change Password"
            onAction={() => {}}
          />
          <SettingRow
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
            action="Enable 2FA"
            onAction={() => {}}
          />
          <SettingRow
            label="Active Sessions"
            description="Manage devices logged into your account"
            action="View Sessions"
            onAction={() => {}}
          />
          <SettingRow
            label="Sign Out All Devices"
            description="Sign out from all devices except this one"
            action="Sign Out All"
            onAction={() => {}}
            variant="secondary"
          />
          <SettingRow
            label="Login Activity"
            description="Review recent login attempts"
            action="View Activity"
            onAction={() => {}}
          />
          <SettingRow
            label="Security Questions"
            description="Set up account recovery options"
            action="Setup"
            onAction={() => {}}
          />
        </div>
      ),
    },
    {
      icon: '🔔',
      title: 'Notifications',
      badge: null,
      content: (
        <div className="settings-group">
          <Toggle
            checked={settings.emailNotifications}
            onChange={(checked) => updateSetting('emailNotifications', checked)}
            label="Email Notifications"
            description="Receive updates about new movies and shows"
          />
          <Toggle
            checked={settings.pushNotifications}
            onChange={(checked) => updateSetting('pushNotifications', checked)}
            label="Push Notifications"
            description="Get notifications on your devices"
          />
          <Toggle
            checked={settings.newReleases}
            onChange={(checked) => updateSetting('newReleases', checked)}
            label="New Releases"
            description="Notify me when new content is added"
          />
          <Toggle
            checked={settings.recommendations}
            onChange={(checked) => updateSetting('recommendations', checked)}
            label="Recommendations"
            description="Personalized content suggestions"
          />
          <Toggle
            checked={settings.reminders}
            onChange={(checked) => updateSetting('reminders', checked)}
            label="Reminders"
            description="Remind me about saved content"
          />
          <Toggle
            checked={settings.marketingEmails}
            onChange={(checked) => updateSetting('marketingEmails', checked)}
            label="Marketing Emails"
            description="Special offers and promotions"
          />
          <Toggle
            checked={settings.smsNotifications}
            onChange={(checked) => updateSetting('smsNotifications', checked)}
            label="SMS Notifications"
            description="Text message alerts"
          />
        </div>
      ),
    },
    {
      icon: '🎨',
      title: 'Viewing Preferences',
      badge: null,
      content: (
        <div className="settings-group">
          <SettingRow
            label="Language"
            value="English (US)"
            action="Change"
            onAction={() => {}}
          />
          <SettingRow
            label="Subtitle Appearance"
            description="Customize subtitle font, size, and color"
            action="Customize"
            onAction={() => {}}
          />
          <Toggle
            checked={settings.autoplayNextEpisode}
            onChange={(checked) => updateSetting('autoplayNextEpisode', checked)}
            label="Autoplay Next Episode"
            description="Automatically play the next episode"
          />
          <Toggle
            checked={settings.autoplayPreviews}
            onChange={(checked) => updateSetting('autoplayPreviews', checked)}
            label="Autoplay Previews"
            description="Play previews while browsing"
          />
          <SettingRow
            label="Video Quality"
            value="Auto (up to 4K)"
            description="Adjust data usage per screen"
            action="Manage"
            onAction={() => {}}
          />
          <SettingRow
            label="Playback Settings"
            description="Skip intro, credits, and recaps"
            action="Configure"
            onAction={() => {}}
          />
          <SettingRow
            label="Content Maturity Rating"
            value="All Maturity Levels"
            action="Change"
            onAction={() => {}}
          />
          <SettingRow
            label="Download Quality"
            value="Standard"
            description="Higher quality takes more space"
            action="Change"
            onAction={() => {}}
          />
        </div>
      ),
    },
    {
      icon: '🛡️',
      title: 'Privacy & Data',
      badge: null,
      content: (
        <div className="settings-group">
          <SettingRow
            label="Viewing Activity"
            description="See and manage your watch history"
            action="View Activity"
            onAction={() => {}}
          />
          <SettingRow
            label="Clear Viewing History"
            description="Remove all watched content from your history"
            action="Clear History"
            onAction={() => {}}
            variant="secondary"
          />
          <SettingRow
            label="Ratings"
            description="View and manage your ratings"
            action="Manage Ratings"
            onAction={() => {}}
          />
          <SettingRow
            label="Download Your Data"
            description="Get a copy of your personal information"
            action="Request Data"
            onAction={() => {}}
          />
          <Toggle
            checked={settings.personalization}
            onChange={(checked) => updateSetting('personalization', checked)}
            label="Personalization"
            description="Use viewing activity for recommendations"
          />
          <SettingRow
            label="Cookies & Tracking"
            description="Manage cookie preferences"
            action="Manage"
            onAction={() => {}}
          />
          <Toggle
            checked={settings.thirdPartySharing}
            onChange={(checked) => updateSetting('thirdPartySharing', checked)}
            label="Third-Party Data Sharing"
            description="Control data shared with partners"
          />
          <div className="settings-group" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-default)' }}>
            <div className="danger-zone-header">
              <h3 style={{ color: 'var(--error-color)', fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                ⚠️ Danger Zone
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Irreversible actions that affect your account
              </p>
            </div>
            <SettingRow
              label="Delete Account"
              description="Permanently delete your account and all data"
              action={showDeleteConfirm ? '⚠️ Click Again to Confirm' : 'Delete Account'}
              onAction={handleDeleteAccount}
              variant={showDeleteConfirm ? 'danger' : 'secondary'}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="account-settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <button
            className="btn btn-secondary btn-sm back-btn"
            onClick={() => navigate('/home')}
            style={{ marginBottom: '1rem' }}
          >
            ← Back to Home
          </button>
          <h1 className="settings-title">⚙️ Account Settings</h1>
          <p className="settings-subtitle">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Accordion Layout */}
        <div className="settings-content-accordion">
          <Accordion items={accordionItems} defaultExpandedIndex={0} />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
