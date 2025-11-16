/**
 * Hook to get active personalization variants
 * 
 * Usage:
 * const { variants, loading } = usePersonalizeVariants();
 * 
 * if (variants.includes('tamil-variant')) {
 *   // Show Tamil content
 * }
 */

import { useState, useEffect } from 'react';
import { usePersonalize } from '../context/PersonalizeContext';

export function usePersonalizeVariants() {
  const sdk = usePersonalize();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sdk) {
      setLoading(false);
      return;
    }

    try {
      console.log('🎭 Getting active variants...');
      
      // Get variant aliases (array of strings)
      const variantAliases = sdk.getVariantAliases();
      
      console.log('🎨 Active variant aliases:', variantAliases);
      setVariants(variantAliases || []);
      
    } catch (error) {
      console.error('❌ Error getting variants:', error);
      setVariants([]);
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  return { variants, loading, sdk };
}

/**
 * Hook to trigger impression when component mounts
 * 
 * Usage:
 * useTriggerImpression('experience_short_uid');
 */
export function useTriggerImpression(experienceShortUid) {
  const sdk = usePersonalize();

  useEffect(() => {
    if (!sdk || !experienceShortUid) return;

    const triggerImpression = async () => {
      try {
        console.log('📊 Triggering impression for:', experienceShortUid);
        await sdk.triggerImpression(experienceShortUid);
        console.log('✅ Impression triggered');
      } catch (error) {
        console.error('❌ Error triggering impression:', error);
      }
    };

    triggerImpression();
  }, [sdk, experienceShortUid]);
}

/**
 * Hook to trigger custom events
 * 
 * Usage:
 * const triggerEvent = useTriggerEvent();
 * await triggerEvent('buttonClicked');
 */
export function useTriggerEvent() {
  const sdk = usePersonalize();

  return async (eventKey, eventProperties = {}) => {
    if (!sdk) {
      console.warn('⚠️ SDK not available, cannot trigger event');
      return;
    }

    try {
      console.log('🎯 Triggering event:', eventKey, eventProperties);
      await sdk.triggerEvent(eventKey, eventProperties);
      console.log('✅ Event triggered');
    } catch (error) {
      console.error('❌ Error triggering event:', error);
    }
  };
}

