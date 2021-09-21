import { useState } from 'react';
import { API } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { onError } from '../lib/errorLib';
import { loadStripe } from '@stripe/stripe-js';
import config from '../config';
import BillingForm from '../components/BillingForm';
import { Elements } from '@stripe/react-stripe-js';
import './Settings.css';

const billUser = (details) => {
  return API.post('notes', '/billing', {
    // {storage, source}
    body: details,
  });
};

export default function Settings() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const stripePromise = loadStripe(config.STRIPE_KEY);

  const handleFormSubmit = async (storage, { token, error }) => {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert('Your card has been charged successfully!');
      history.push('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };
  return (
    <div className="Settings">
      <Elements
        stripe={stripePromise}
        fonts={[
          {
            cssSrc:
              'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap',
          },
        ]}>
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
}
