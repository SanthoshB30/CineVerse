import { useEffect } from 'react';
import { getAppSettings } from '../services/dataService';
import logger from '../utils/logger';

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
          logger.info('Applying theme configuration...');
          
          // Apply primary color if available
          if (settings.theme_colors.primary_color) {
            document.body.style.setProperty('--primary-color', settings.theme_colors.primary_color);
          }
          
          // Apply accent color if available
          if (settings.theme_colors.accent_color) {
            document.body.style.setProperty('--accent-color', settings.theme_colors.accent_color);
          }
          
          // Store background image URL globally for use in login/signup pages
          if (settings.background_image && settings.background_image.url) {
            window.__CINEVERSE_BG_IMAGE__ = settings.background_image.url;
          }
          
          logger.success('Theme configuration applied');
        } else {
          logger.info('No custom theme found, using defaults');
        }
      } catch (error) {
        logger.error('Theme initialization failed:', error.message);
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

