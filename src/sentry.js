import * as Sentry from '@sentry/react';

// Error reports only. No session replay: it recorded every visit in the background, which needs consent
// in the EEA, UK and Quebec, and error reports alone set no cookies.
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 0.2,
});
