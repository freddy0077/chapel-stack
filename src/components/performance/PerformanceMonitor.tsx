/**
 * Performance Monitor Component
 * Tracks and displays performance metrics for debugging
 */

"use client";

import React, { useEffect, useState } from "react";

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      setMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
      });

      // Measure Web Vitals
      if ("web-vitals" in window) {
        // This would require installing web-vitals package
        // For now, we'll use basic performance API
      }

      // Get paint metrics
      const paintEntries = performance.getEntriesByType("paint");
      paintEntries.forEach((entry) => {
        if (entry.name === "first-contentful-paint") {
          setMetrics((prev) => ({
            ...prev,
            firstContentfulPaint: entry.startTime,
          }));
        }
      });
    };

    // Measure after page load
    if (document.readyState === "complete") {
      measurePerformance();
    } else {
      window.addEventListener("load", measurePerformance);
    }

    // Toggle visibility with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("load", measurePerformance);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  if (process.env.NODE_ENV !== "development" || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Performance Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-1">
        <div>Load Time: {metrics.loadTime?.toFixed(2) || "N/A"}ms</div>
        <div>DOM Ready: {metrics.domContentLoaded?.toFixed(2) || "N/A"}ms</div>
        <div>FCP: {metrics.firstContentfulPaint?.toFixed(2) || "N/A"}ms</div>
        <div>LCP: {metrics.largestContentfulPaint?.toFixed(2) || "N/A"}ms</div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}
