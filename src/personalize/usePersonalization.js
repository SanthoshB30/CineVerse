/**
 * React Hook for Personalization
 * 
 * Use this hook in components to apply personalization and get variant data
 */

import { useState, useEffect } from 'react';

/**
 * Hook to apply personalization and get active variant
 * 
 * @returns {Object} { variant, loading, error }
 * 
 * Usage:
 * const { variant, loading } = usePersonalization();
 * 
 * if (variant?.id === 'tamil-variant') {
 *   // Show Tamil content
 * }
 */
export function usePersonalization() {
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    applyPersonalization();
  }, []);

  const applyPersonalization = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if SDK is available
      if (!window.csPersonalize || !window.csPersonalize.apply) {
        console.warn('⚠️ Personalize SDK not available');
        setLoading(false);
        return;
      }

      console.log('🎭 Applying personalization...');

      // Call .apply() to get the active variant
      const activeVariant = await window.csPersonalize.apply();

      console.log('🎨 Active variant:', activeVariant);
      setVariant(activeVariant);

    } catch (err) {
      console.error('❌ Error applying personalization:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { variant, loading, error, reapply: applyPersonalization };
}

/**
 * Apply personalization and return variant (non-hook version)
 * Use this in non-component contexts
 * 
 * @returns {Promise<Object>} Active variant
 */
export async function applyPersonalization() {
  try {
    if (!window.csPersonalize || !window.csPersonalize.apply) {
      console.warn('⚠️ Personalize SDK not available');
      return null;
    }

    console.log('🎭 Applying personalization...');
    const variant = await window.csPersonalize.apply();
    console.log('🎨 Active variant:', variant);

    return variant;
  } catch (error) {
    console.error('❌ Error applying personalization:', error);
    return null;
  }
}

