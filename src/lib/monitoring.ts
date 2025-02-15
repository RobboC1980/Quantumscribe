import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/tracing';

export interface ErrorContext {
  user?: {
    id?: string;
    email?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

export function initMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 1.0,
        integrations: [new BrowserTracing()],
        environment: process.env.NODE_ENV,
      });
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }
}

export function logError(
  error: unknown,
  context: ErrorContext = {}
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('Error:', error);
    return;
  }

  try {
    const { user, tags, extra } = context;

    if (user) {
      Sentry.setUser(user);
    }

    if (tags) {
      Sentry.setTags(tags);
    }

    Sentry.captureException(error, {
      extra,
    });
  } catch (sentryError) {
    console.error('Failed to log error to Sentry:', sentryError);
    console.error('Original error:', error);
  }
}

export function setUserContext(user: ErrorContext['user']) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && user) {
    Sentry.setUser(user);
  }
}

export function clearUserContext() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(null);
  }
} 