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
import logger from '../utils/logger';

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
      // Get variant aliases (array of strings)
      const variantAliases = sdk.getVariantAliases();
      
      if (variantAliases && variantAliases.length > 0) {
        logger.info('Active variants:', variantAliases);
      }
      setVariants(variantAliases || []);
      
    } catch (error) {
      logger.error('Failed to get variants:', error.message);
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
        await sdk.triggerImpression(experienceShortUid);
        logger.info('Impression triggered:', experienceShortUid);
      } catch (error) {
        logger.error('Impression trigger failed:', error.message);
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
      logger.warn('SDK not available, event not triggered');
      return;
    }

    try {
      await sdk.triggerEvent(eventKey, eventProperties);
      logger.info('Event triggered:', eventKey);
    } catch (error) {
      logger.error('Event trigger failed:', error.message);
    }
  };
}

