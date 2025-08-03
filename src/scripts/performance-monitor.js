// src/scripts/performance-monitor.js

// Core Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Report to analytics (replace with your analytics service)
function sendToAnalytics(metric) {
  console.log('Core Web Vital:', metric);
  
  // Example: Send to Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// Monitor all Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// Additional performance monitoring
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // Monitor long tasks
    if (entry.entryType === 'longtask') {
      console.warn('Long task detected:', entry.duration + 'ms');
    }
    
    // Monitor layout shifts
    if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
      console.log('Layout shift:', entry.value);
    }
  }
});

observer.observe({ entryTypes: ['longtask', 'layout-shift'] });

// Image loading performance
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    if (!img.complete) {
      const startTime = performance.now();
      img.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        console.log(`Image loaded in ${loadTime.toFixed(2)}ms:`, img.src);
      });
    }
  });
});

export { sendToAnalytics };
