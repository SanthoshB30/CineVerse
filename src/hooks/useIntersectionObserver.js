import { useEffect, useRef, useState } from 'react';

/**
 * useIntersectionObserver Hook
 * For lazy loading and viewport detection
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin (e.g., '50px')
 * @param {boolean} options.triggerOnce - Only trigger once
 * @returns {Object} { ref, isIntersecting, entry }
 */
const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = false,
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isElementIntersecting);
        setEntry(entry);

        // If triggerOnce is true and element is intersecting, disconnect observer
        if (triggerOnce && isElementIntersecting && observerRef.current) {
          observerRef.current.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Start observing
    observerRef.current.observe(node);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isIntersecting, entry };
};

export default useIntersectionObserver;

