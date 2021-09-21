import { useState, useMemo } from 'react';
import Form from 'react-bootstrap/Form';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import LoaderButton from './LoaderButton';
import { useFormFields } from '../lib/hooksLib';
import './BillingForm.css';

/*
- To begin with we are getting a reference to the Stripe object by calling useStripe.

- As for the fields in our form, we have input field of type number that allows a user to enter the number of notes they want to store. We also take the name on the credit card. These are stored in the state through the handleChange method that we get from our useFormFields custom React Hook.

- The credit card number form is provided by the Stripe React SDK through the CardElement component that we import in the header.”

- The submit button has a loading state that is set to true
 when we call Stripe to get a token and when we call our billing API.
 However, since our Settings container is calling the billing API we use the props.isLoading to set the state of the button from the Settings container.

 - We also validate this form by checking if the name, the number of notes, and the card details are complete. For the card details, we use the CardElement’s onChange method.

- Finally, once the user completes and submits the form we make a call to Stripe by passing in the CardElement.
 It uses this to generate a token for the specific call.
 We simply pass this and the number of notes to be stored to the settings page via the onSubmit method.
*/

export default function BillingForm({ isLoading, onSubmit }) {
  const stripe = useStripe();
  const elements = useElements();

  const [fields, handleChange] = useFormFields({
    name: '',
    storage: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  isLoading = isProcessing || isLoading;

  const isFormValid = useMemo(() => {
    return (
      stripe &&
      elements &&
      fields.name !== '' &&
      fields.storage !== '' &&
      isCardComplete
    );
  }, [elements, fields.name, fields.storage, isCardComplete, stripe]);

  const handleSubmitClick = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    setIsProcessing(false);

    onSubmit(fields.storage, { token, error });
  };
  return (
    <Form className="BillingForm" onSubmit={handleSubmitClick}>
      <Form.Group size="lg" controlId="storage">
        <Form.Label>Storage</Form.Label>
        <Form.Control
          min="0"
          type="number"
          value={fields.storage}
          onChange={handleChange}
          placeholder="Number of notes to store"
        />
      </Form.Group>
      <hr />

      <Form.Group size="lg" controlId="name">
        <Form.Label>Cardholder&apos;s name</Form.Label>
        <Form.Control
          type="text"
          value={fields.name}
          onChange={handleChange}
          placeholder="Name on the card"
        />
      </Form.Group>
      <Form.Label>Credit Card Info</Form.Label>
      <CardElement
        className="card-field"
        onChange={(e) => setIsCardComplete(e.complete)}
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#495057',
              fontFamily: "'Open Sans', sans-serif",
            },
          },
        }}
      />
      <LoaderButton
        block
        size="lg"
        type="submit"
        isLoading={isLoading}
        disabled={!isFormValid}>
        Purchase
      </LoaderButton>
    </Form>
  );
}
