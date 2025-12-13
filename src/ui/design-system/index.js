/**
 * CineVerse Design System
 * Central export for all design tokens and utilities
 */

import tokens from './tokens';
import animations from './animations';

export const {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  glassmorphism,
  gradients,
  breakpoints,
  zIndex,
} = tokens;

export const {
  keyframes,
  animationClasses,
  animations: animationUtils,
  hoverAnimations,
} = animations;

// Utility functions
export const utils = {
  /**
   * Create CSS variable string from design token
   */
  cssVar: (value) => `var(--${value})`,
  
  /**
   * Create media query string
   */
  mediaQuery: (breakpoint) => `@media (min-width: ${breakpoints[breakpoint]})`,
  
  /**
   * Create responsive value
   */
  responsive: (mobile, tablet, desktop) => ({
    mobile,
    tablet,
    desktop,
  }),
  
  /**
   * Create glassmorphism style object
   */
  glass: (variant = 'medium') => glassmorphism[variant],
};

// Export everything
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  glassmorphism,
  gradients,
  breakpoints,
  zIndex,
  keyframes,
  animationClasses,
  animationUtils,
  hoverAnimations,
  utils,
};

