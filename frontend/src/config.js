// loading the environment that are set from our serverless backend. We did this back when we were first
// setting up our React app.

const config = {
  STRIPE_KEY: 'pk_test_dcdmtFlahGtTRyHxAG8x5u0m00uouVFTwp', // publishable keys aren't confidential
  SENTRY_DSN:
    'https://5a33ca30756c4c49a6c6cdcc3cffe5ca@o1008644.ingest.sentry.io/5972636',

  MAX_ATTACHMENT_SIZE: 5000000,

  // Backend config
  s3: {
    REGION: process.env.REACT_APP_REGION,
    BUCKET: process.env.REACT_APP_BUCKET,
  },
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL: process.env.REACT_APP_API_URL,
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
};

export default config;
