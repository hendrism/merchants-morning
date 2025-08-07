// Real-time performance monitoring and optimization utilities

export const performanceMonitor = {
  measureRenderTime: (componentName, callback) => {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const result = callback ? callback() : undefined;
    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = end - start;
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[perf] ${componentName} rendered in ${duration.toFixed(2)}ms`);
    }
    return { duration, result };
  },

  detectSlowDevices: () => {
    if (typeof navigator === 'undefined') return false;
    return navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  },

  optimizeForDevice: (deviceCapabilities = {}) => {
    if (deviceCapabilities.lowPower) {
      // Placeholder for disabling heavy effects
      return { animations: 'minimal' };
    }
    return {};
  },

  reportMetrics: (metrics) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[perf-metrics]', metrics);
    }
  },
};

export default performanceMonitor;
