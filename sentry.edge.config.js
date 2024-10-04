// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { SENTRY_ENV_NAME } from './configs/sentry-config';

const environmentValue = SENTRY_ENV_NAME;
Sentry.init({
  dsn: 'https://2167f24611231d464ff4f4740ead8358@sentry.eks-prod-tools.k.aitention.com/10',
  environment: environmentValue,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
