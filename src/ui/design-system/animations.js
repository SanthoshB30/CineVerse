/**
 * CineVerse Design System - Animations
 * Smooth, cinematic animations
 */

export const keyframes = {
  // Fade animations
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  fadeInDown: `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  // Slide animations
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  
  slideInRight: `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  
  // Scale animations
  scaleIn: `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  
  scaleOut: `
    @keyframes scaleOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.9);
      }
    }
  `,
  
  // Pulse animations
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.05);
      }
    }
  `,
  
  pulseGlow: `
    @keyframes pulseGlow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(228, 181, 100, 0.3);
      }
      50% {
        box-shadow: 0 0 40px rgba(228, 181, 100, 0.6);
      }
    }
  `,
  
  // Spin animation
  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  
  // Bounce animation
  bounce: `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  `,
  
  // Shimmer animation (for loading states)
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `,
  
  // Glow animation
  glow: `
    @keyframes glow {
      0%, 100% {
        filter: drop-shadow(0 0 5px rgba(228, 181, 100, 0.3));
      }
      50% {
        filter: drop-shadow(0 0 20px rgba(228, 181, 100, 0.6));
      }
    }
  `,
  
  // Shake animation (for errors)
  shake: `
    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
      }
      20%, 40%, 60%, 80% {
        transform: translateX(5px);
      }
    }
  `,
  
  // Float animation
  float: `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  `,
  
  // Skeleton loading animation
  skeletonLoading: `
    @keyframes skeletonLoading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `,
};

export const animationClasses = {
  fadeIn: 'animation: fadeIn 0.3s ease-out',
  fadeInUp: 'animation: fadeInUp 0.5s ease-out',
  fadeInDown: 'animation: fadeInDown 0.5s ease-out',
  slideInLeft: 'animation: slideInLeft 0.4s ease-out',
  slideInRight: 'animation: slideInRight 0.4s ease-out',
  scaleIn: 'animation: scaleIn 0.3s ease-out',
  pulse: 'animation: pulse 2s ease-in-out infinite',
  spin: 'animation: spin 1s linear infinite',
  bounce: 'animation: bounce 1s ease-in-out infinite',
  glow: 'animation: glow 2s ease-in-out infinite',
  float: 'animation: float 3s ease-in-out infinite',
};

// CSS-in-JS animation utilities
export const animations = {
  fadeIn: (duration = '0.3s', delay = '0s') => `
    animation: fadeIn ${duration} ease-out ${delay} both;
  `,
  
  fadeInUp: (duration = '0.5s', delay = '0s') => `
    animation: fadeInUp ${duration} ease-out ${delay} both;
  `,
  
  staggeredFadeInUp: (index, baseDelay = 0.05) => `
    animation: fadeInUp 0.5s ease-out ${index * baseDelay}s both;
  `,
  
  scaleIn: (duration = '0.3s', delay = '0s') => `
    animation: scaleIn ${duration} ease-out ${delay} both;
  `,
  
  pulse: (duration = '2s') => `
    animation: pulse ${duration} ease-in-out infinite;
  `,
  
  spin: (duration = '1s') => `
    animation: spin ${duration} linear infinite;
  `,
};

// Hover animations (to be used with :hover)
export const hoverAnimations = {
  lift: `
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
  `,
  
  liftGlow: `
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(228, 181, 100, 0.4);
    }
  `,
  
  scale: `
    transition: transform 0.2s ease;
    &:hover {
      transform: scale(1.05);
    }
  `,
  
  glow: `
    transition: filter 0.2s ease;
    &:hover {
      filter: drop-shadow(0 0 16px rgba(228, 181, 100, 0.5));
    }
  `,
  
  brighten: `
    transition: filter 0.2s ease;
    &:hover {
      filter: brightness(1.2);
    }
  `,
};

export default {
  keyframes,
  animationClasses,
  animations,
  hoverAnimations,
};

