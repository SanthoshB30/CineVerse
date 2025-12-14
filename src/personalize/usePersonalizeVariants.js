/**
 * Personalize Variants Hooks
 * 
 * Hooks to access personalization variants and trigger events.
 * Uses the personalizeService for all SDK operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { usePersonalize } from '../context/PersonalizeContext';
import personalizeService from '../services/personalizeService';
import logger from '../utils/logger';

/**
 * Hook to get active personalization variants
 */
export function usePersonalizeVariants() {
  const { isInitialized, isLoading } = usePersonalize();
  const [variants, setVariants] = useState([]);
  const [variantAliases, setVariantAliases] = useState({});
  const [variantParam, setVariantParam] = useState(null);
  const [variantString, setVariantString] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshVariants = useCallback(() => {
    if (!isInitialized) {
      setLoading(false);
      return;
    }

    try {
      // Get variant param using service
      const param = personalizeService.getVariantParam();
      setVariantParam(param);
      
      // Get variant aliases object from service
      const aliases = personalizeService.getRawVariantAliases() || {};
      setVariantAliases(aliases);
      
      // Convert aliases object values to array
      const aliasValues = Object.values(aliases);
      setVariants(aliasValues);
      
      // Get comma-separated string for .variants() API
      const aliasString = personalizeService.getVariantAlias();
      setVariantString(aliasString);
      
      // Debug output
      console.log('[Personalize] getVariantParam():', param);
      console.log('[Personalize] getVariantAliases():', aliases);
      console.log('[Personalize] Variant string for API:', aliasString);
      
      if (aliasValues.length > 0) {
        logger.info('Active variants:', aliasValues);
      } else {
        logger.info('No active variants (default content)');
      }
      
    } catch (error) {
      logger.error('Failed to get variants:', error.message);
      setVariants([]);
      setVariantAliases({});
      setVariantParam(null);
      setVariantString('');
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isLoading) {
      refreshVariants();
    }
  }, [isLoading, refreshVariants]);

  // Also refresh when SDK becomes initialized
  useEffect(() => {
    if (isInitialized) {
      refreshVariants();
    }
  }, [isInitialized, refreshVariants]);

  return { 
    variants,           // Array of variant alias values
    variantAliases,     // Object: { experience_uid: variant_alias }
    variantParam,       // Raw variant param string
    variantString,      // Comma-separated string for .variants() API
    loading: loading || isLoading, 
    refresh: refreshVariants 
  };
}

/**
 * Hook to trigger impression when component mounts
 */
export function useTriggerImpression(experienceShortUid) {
  const { isInitialized } = usePersonalize();

  useEffect(() => {
    if (!isInitialized || !experienceShortUid) return;

    const triggerImpression = async () => {
      try {
        await personalizeService.trackImpression(experienceShortUid);
        logger.info('Impression triggered:', experienceShortUid);
      } catch (error) {
        logger.error('Impression trigger failed:', error.message);
      }
    };

    triggerImpression();
  }, [isInitialized, experienceShortUid]);
}

/**
 * Hook to trigger custom events
 */
export function useTriggerEvent() {
  const { isInitialized } = usePersonalize();

  return async (eventKey, eventProperties = {}) => {
    if (!isInitialized) {
      logger.warn('SDK not initialized, event not triggered');
      return;
    }

    try {
      await personalizeService.trackEvent(eventKey, eventProperties);
      logger.info('Event triggered:', eventKey);
    } catch (error) {
      logger.error('Event trigger failed:', error.message);
    }
  };
}

/**
 * Hook to set user attributes
 */
export function useSetUserAttributes() {
  const { isInitialized, updateAttributes } = usePersonalize();

  return async (attributes) => {
    if (!isInitialized) {
      logger.warn('SDK not initialized, cannot set attributes');
      return;
    }

    try {
      logger.info('Setting user attributes:', attributes);
      
      // Use context's updateAttributes to keep state in sync
      const result = await updateAttributes(attributes);
      
      logger.success('Attributes set successfully');
      
      return result;
      
    } catch (error) {
      logger.error('Failed to set attributes:', error.message);
      throw error;
    }
  };
}

/**
 * Hook to get current variant param (for debugging)
 */
export function useVariantParam() {
  const { isInitialized } = usePersonalize();
  const [variantParam, setVariantParam] = useState(null);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      const param = personalizeService.getVariantParam();
      setVariantParam(param);
      console.log('[Personalize] getVariantParam():', param);
    } catch (error) {
      logger.error('Failed to get variant param:', error.message);
    }
  }, [isInitialized]);

  return variantParam;
}

/**
 * Hook to get user attributes
 */
export function useUserAttributes() {
  const { userAttributes, isInitialized } = usePersonalize();
  
  if (!isInitialized) {
    return {};
  }
  
  return userAttributes;
}
