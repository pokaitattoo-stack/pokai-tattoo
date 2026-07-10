export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

export function trackPixelEvent(name, params) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', name, params)
}
