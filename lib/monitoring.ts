// Production monitoring utilities
export const trackEvent = (eventName: string, eventData?: Record<string, unknown>) => {
  if (typeof window === "undefined") return

  // Track with analytics if available
  if (window.gtag) {
    window.gtag("event", eventName, eventData)
  }
}

export const trackError = (error: Error, context?: Record<string, unknown>) => {
  console.error("Error tracked:", error, context)

  // Send to error tracking service in production
  if (process.env.NODE_ENV === "production") {
    // Example: Sentry integration
    // Sentry.captureException(error, { contexts: { context } })
  }
}

export const logPerformance = (metricName: string, duration: number) => {
  console.log(`⏱️ ${metricName}: ${duration}ms`)

  if (process.env.NODE_ENV === "production") {
    trackEvent("performance_metric", {
      metric: metricName,
      duration,
      timestamp: new Date().toISOString(),
    })
  }
}
