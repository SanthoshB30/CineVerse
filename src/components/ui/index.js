/**
 * CineVerse UI Component Library
 * Central export for all reusable UI components
 */

export { default as Button } from './Button';
export { default as Card, CardHeader, CardBody, CardFooter } from './Card';
export { default as Badge } from './Badge';
export { default as Accordion } from './Accordion';
export { default as Toggle } from './Toggle';
export { 
  SkeletonText, 
  SkeletonTitle, 
  SkeletonMovieCard, 
  SkeletonMovieGrid,
  SkeletonCard,
  SkeletonPersonCard,
  SkeletonPeopleGrid 
} from '../SkeletonLoader';

// Re-export design system for convenience
export { default as designSystem } from '../../ui/design-system';

