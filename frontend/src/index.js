import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import config from './config';
import { Amplify } from 'aws-amplify';

/*
- Amplify refers to Cognito as Auth, S3 as Storage, and API Gateway as API.
- The mandatorySignIn flag for auth is set to true because we want our users to be signed in
before they can interact with our app.
- The name: "notes" is basically telling amplify that we want to name our API.
Amplif allows you to add multiple APIs that your app is going to work with. In our case our entire
backend is just one single API.
- The Amplify.configure() is just setting the various AWS resources that we want to interact with.
It isn't doing anything else special here besides configuration.
*/
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: 'notes',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
