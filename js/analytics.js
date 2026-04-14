import posthog from 'posthog-js';

posthog.init(import.meta.env.POSTHOG_API_KEY, {
  api_host: import.meta.env.POSTHOG_HOST,
  defaults: '2026-01-30',
  disable_compression: true,
  autocapture: false
});

export const EVENTS = {
  COPY_CSS_PRESSED: 'copy_css_pressed',
  COLOR_UPDATED:    'color_updated',
  RADIUS_UPDATED:   'radius_updated',
  SHADOW_UPDATED:   'shadow_updated',
  SIZE_UPDATED:     'size_updated',
};

export const analytics = {
  track(event, props) { posthog.capture(event, props); },
  identify(userId, props) { posthog.identify(userId, props); },
  reset() { posthog.reset(); },
};
