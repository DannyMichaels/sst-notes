import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import config from '../config';

const isLocal = process.env.NODE_ENV === 'development';

export function initSentry() {
  if (isLocal) return;

  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

// sentry error log
export function logError(error, errorInfo = null) {
  if (isLocal) return;

  Sentry.withScope((scope) => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export function onError(error) {
  let errorInfo = {};
  let message = error.toString();

  // Auth errors
  if (!(error instanceof Error) && error.message) {
    errorInfo = error;
    message = error.message;
    error = new Error(message);
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url;
  }

  logError(error, errorInfo);

  alert(message);
}
