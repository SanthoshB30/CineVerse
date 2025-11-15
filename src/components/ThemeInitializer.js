import { useEffect } from 'react';
import { getAppSettings } from '../services/dataService';

/**
 * ThemeInitializer Component
 * 
 * Fetches app settings from Contentstack and applies theme colors dynamically
 * to CSS custom properties on the document body.
 */
const ThemeInitializer = () => {
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Get app settings from data store
        const settings = getAppSettings();
        
        if (settings && settings.theme_colors) {
          console.log('🎨 Applying theme colors from Contentstack...');
          
          // Apply primary color if available
          if (settings.theme_colors.primary_color) {
            document.body.style.setProperty('--primary-color', settings.theme_colors.primary_color);
            console.log(`   Primary color: ${settings.theme_colors.primary_color}`);
          }
          
          // Apply accent color if available
          if (settings.theme_colors.accent_color) {
            document.body.style.setProperty('--accent-color', settings.theme_colors.accent_color);
            console.log(`   Accent color: ${settings.theme_colors.accent_color}`);
          }
          
          // Store background image URL globally for use in login/signup pages
          if (settings.background_image && settings.background_image.url) {
            window.__CINEVERSE_BG_IMAGE__ = settings.background_image.url;
            console.log(`   Background image: ${settings.background_image.url}`);
          }
          
          console.log('✅ Theme colors applied successfully');
        } else {
          console.log('⚠️  No theme colors found in app settings, using defaults');
        }
      } catch (error) {
        console.error('❌ Error initializing theme:', error);
      }
    };

    // Initialize theme after a short delay to ensure data store is ready
    const timer = setTimeout(initializeTheme, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything
  return null;
};

export default ThemeInitializer;

