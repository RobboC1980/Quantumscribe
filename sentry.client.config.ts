import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [new Sentry.BrowserTracing()],
  
  // Adjust this value in production, or use tracesSampler for greater control
  replaysSessionSampleRate: 0.1,
  // If you're not using session replay, you can remove this option
  replaysOnErrorSampleRate: 1.0,
}); 