/**
 * Image Optimization Utilities
 * Helpers for lazy loading, image optimization, and performance
 */

/**
 * Generate optimized image URL with parameters
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (url, options = {}) => {
  const {
    width = null,
    height = null,
    quality = 80,
    format = 'auto',
    fit = 'cover'
  } = options;

  if (!url) return null;

  // If it's a Contentstack URL, add optimization parameters
  if (url.includes('contentstack')) {
    const params = new URLSearchParams();
    
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    params.append('quality', quality);
    if (format !== 'auto') params.append('format', format);
    params.append('fit', fit);
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }

  return url;
};

/**
 * Generate srcset for responsive images
 * @param {string} url - Original image URL
 * @param {Array} sizes - Array of widths [300, 600, 900, 1200]
 * @returns {string} srcset string
 */
export const generateSrcSet = (url, sizes = [300, 600, 900, 1200]) => {
  if (!url) return '';
  
  return sizes
    .map(size => `${optimizeImageUrl(url, { width: size })} ${size}w`)
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 * @param {Object} breakpoints - Object with breakpoint sizes
 * @returns {string} sizes string
 */
export const generateSizes = (breakpoints = {}) => {
  const defaults = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
    ...breakpoints
  };

  return `
    (max-width: 480px) ${defaults.mobile},
    (max-width: 1024px) ${defaults.tablet},
    ${defaults.desktop}
  `.trim();
};

/**
 * Lazy load image with IntersectionObserver
 * @param {HTMLImageElement} img - Image element
 * @param {Object} options - IntersectionObserver options
 */
export const lazyLoadImage = (img, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        const src = image.dataset.src;
        const srcset = image.dataset.srcset;

        if (src) {
          image.src = src;
        }
        if (srcset) {
          image.srcset = srcset;
        }

        image.classList.add('loaded');
        obs.unobserve(image);
      }
    });
  }, defaultOptions);

  observer.observe(img);
  return observer;
};

/**
 * Preload critical images
 * @param {Array} urls - Array of image URLs to preload
 */
export const preloadImages = (urls) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Get optimal image format based on browser support
 * @returns {string} Preferred format (webp, avif, jpg)
 */
export const getOptimalFormat = () => {
  // Check AVIF support
  const avifSupported = document.createElement('canvas')
    .toDataURL('image/avif')
    .indexOf('data:image/avif') === 0;
  
  if (avifSupported) return 'avif';

  // Check WebP support
  const webpSupported = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
  
  if (webpSupported) return 'webp';

  return 'jpg';
};

/**
 * Create placeholder blur data URL
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @param {string} color - Placeholder color
 * @returns {string} Data URL
 */
export const createPlaceholder = (width = 10, height = 10, color = '#1a1a1f') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL();
};

/**
 * Calculate image dimensions maintaining aspect ratio
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Object} New dimensions {width, height}
 */
export const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = (maxWidth / width) * height;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (maxHeight / height) * width;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Debounce function for scroll/resize handlers
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 150) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for high-frequency events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 150) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  optimizeImageUrl,
  generateSrcSet,
  generateSizes,
  lazyLoadImage,
  preloadImages,
  getOptimalFormat,
  createPlaceholder,
  calculateDimensions,
  debounce,
  throttle,
};

