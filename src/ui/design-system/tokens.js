/**
 * CineVerse Design System - Design Tokens
 * Premium cinematic theme with glassmorphism
 */

export const colors = {
  // Primary Colors - Deep Charcoal & Gold Accent
  primary: {
    dark: '#0D0D0F',      // Deep charcoal background
    charcoal: '#1A1A1F',  // Lighter charcoal
    gold: '#E4B564',      // Accent gold
    goldDark: '#C99D47',  // Darker gold
    goldLight: '#F0D399', // Lighter gold
  },
  
  // Secondary Colors - Purple Accent
  secondary: {
    purple: '#4C3BCF',    // Secondary purple
    purpleLight: '#6C5CE7',
    purpleDark: '#3A2EA0',
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    gray100: '#F5F5F5',
    gray200: '#E8E8E8',
    gray300: '#CCCCCC',
    gray400: '#999999',
    gray500: '#666666',
    gray600: '#4A4A4A',
    gray700: '#2A2A2A',
    gray800: '#1A1A1A',
    gray900: '#0D0D0D',
    black: '#000000',
  },
  
  // Semantic Colors
  success: '#4CAF50',
  warning: '#FFB020',
  error: '#FF4D4D',
  info: '#00D9FF',
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    tertiary: '#808080',
    muted: '#666666',
    inverse: '#0D0D0F',
  },
  
  // Background Colors
  background: {
    dark: '#0D0D0F',
    darkElevated: '#1A1A1F',
    light: '#1E1E24',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassDark: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Border Colors
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(255, 255, 255, 0.2)',
    gold: 'rgba(228, 181, 100, 0.3)',
  },
};

export const typography = {
  // Font Families
  fontFamily: {
    heading: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace",
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  // Font Weights - Optimized for cinema
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.5rem',   // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  full: '9999px',
};

export const shadows = {
  // Standard Shadows
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Cinematic Shadows - Gold Glow
  goldGlow: '0 0 20px rgba(228, 181, 100, 0.3)',
  goldGlowHover: '0 0 30px rgba(228, 181, 100, 0.5)',
  goldGlowStrong: '0 0 40px rgba(228, 181, 100, 0.6)',
  
  // Purple Glow
  purpleGlow: '0 0 20px rgba(76, 59, 207, 0.3)',
  purpleGlowHover: '0 0 30px rgba(76, 59, 207, 0.5)',
  
  // Inner Shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  innerLg: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
  
  // None
  none: 'none',
};

export const transitions = {
  // Durations - Smooth transitions (150-250ms)
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '250ms',
    slower: '350ms',
  },
  
  // Timing Functions
  timing: {
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  // Common Transitions
  all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const glassmorphism = {
  // Glass effect presets
  light: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  strong: {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
};

export const gradients = {
  // Gold Gradients
  goldLinear: 'linear-gradient(135deg, #E4B564 0%, #C99D47 100%)',
  goldRadial: 'radial-gradient(circle, #F0D399 0%, #E4B564 50%, #C99D47 100%)',
  
  // Purple Gradients
  purpleLinear: 'linear-gradient(135deg, #6C5CE7 0%, #4C3BCF 100%)',
  purpleRadial: 'radial-gradient(circle, #6C5CE7 0%, #4C3BCF 100%)',
  
  // Combined Gradients
  cinematic: 'linear-gradient(135deg, #E4B564 0%, #4C3BCF 100%)',
  cinematicReverse: 'linear-gradient(135deg, #4C3BCF 0%, #E4B564 100%)',
  
  // Overlay Gradients
  overlayTop: 'linear-gradient(to bottom, rgba(13, 13, 15, 0.9) 0%, transparent 100%)',
  overlayBottom: 'linear-gradient(to bottom, transparent 0%, rgba(13, 13, 15, 0.9) 100%)',
  overlayDark: 'linear-gradient(to bottom, rgba(13, 13, 15, 0) 0%, rgba(13, 13, 15, 1) 100%)',
};

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// Export all tokens
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
};

