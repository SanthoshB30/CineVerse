/**
 * ============================================================================
 * DEVELOPMENT LOGGER UTILITY
 * ============================================================================
 * 
 * Professional logging utility that only outputs in development mode.
 * All logs are suppressed in production builds.
 * 
 * Usage:
 *   import logger from '../utils/logger';
 *   logger.info('Message');
 *   logger.success('Operation completed');
 *   logger.warn('Warning message');
 *   logger.error('Error message');
 *   logger.group('Group Title');
 *   logger.groupEnd();
 * 
 * ============================================================================
 */

const isDev = process.env.NODE_ENV === 'development';

// Styling for different log types (professional, subtle colors)
const styles = {
  info: 'color: #6B7280; font-weight: normal;',
  success: 'color: #059669; font-weight: normal;',
  warn: 'color: #D97706; font-weight: normal;',
  error: 'color: #DC2626; font-weight: bold;',
  group: 'color: #3B82F6; font-weight: bold;',
  data: 'color: #8B5CF6; font-weight: normal;',
};

/**
 * Logger object with methods for different log levels
 */
const logger = {
  /**
   * Info level logging - general information
   */
  info: (message, ...args) => {
    if (!isDev) return;
    if (args.length > 0) {
      console.log(`%c[INFO] ${message}`, styles.info, ...args);
    } else {
      console.log(`%c[INFO] ${message}`, styles.info);
    }
  },

  /**
   * Success level logging - successful operations
   */
  success: (message, ...args) => {
    if (!isDev) return;
    if (args.length > 0) {
      console.log(`%c[OK] ${message}`, styles.success, ...args);
    } else {
      console.log(`%c[OK] ${message}`, styles.success);
    }
  },

  /**
   * Warning level logging - non-critical issues
   */
  warn: (message, ...args) => {
    if (!isDev) return;
    if (args.length > 0) {
      console.warn(`%c[WARN] ${message}`, styles.warn, ...args);
    } else {
      console.warn(`%c[WARN] ${message}`, styles.warn);
    }
  },

  /**
   * Error level logging - errors and failures
   */
  error: (message, ...args) => {
    if (!isDev) return;
    if (args.length > 0) {
      console.error(`%c[ERROR] ${message}`, styles.error, ...args);
    } else {
      console.error(`%c[ERROR] ${message}`, styles.error);
    }
  },

  /**
   * Start a collapsed group
   */
  group: (title) => {
    if (!isDev) return;
    console.groupCollapsed(`%c${title}`, styles.group);
  },

  /**
   * End a group
   */
  groupEnd: () => {
    if (!isDev) return;
    console.groupEnd();
  },

  /**
   * Log data/object with formatting
   */
  data: (label, data) => {
    if (!isDev) return;
    console.log(`%c[DATA] ${label}:`, styles.data, data);
  },

  /**
   * Log a table (useful for arrays/objects)
   */
  table: (data, columns) => {
    if (!isDev) return;
    if (columns) {
      console.table(data, columns);
    } else {
      console.table(data);
    }
  },

  /**
   * Log a separator line
   */
  separator: () => {
    if (!isDev) return;
    console.log('%c────────────────────────────────────', 'color: #4B5563;');
  },

  /**
   * Log timing information
   */
  time: (label) => {
    if (!isDev) return;
    console.time(label);
  },

  timeEnd: (label) => {
    if (!isDev) return;
    console.timeEnd(label);
  },
};

export default logger;

