import Stripe from 'stripe';
import handler from './util/handler';
import { calculateCost } from './util/cost';

/*
  - We get the storage and soruce from the request body. The storage variable is the number
  of notes the user would like to store in his account. And source is the Stripe token for the card
  that we are going to charge.
  - We are using calculateCost(storage) function to figure out how much to charge a user based on the number of notes
  that are going to be stored.
  - We create a new Stripe object using our Stripe Secret key. We are getting this from the environment variable
  that we configured.
  - Finally, we use the stripe.charges.create method to charge the user and respond
  to the request if everything went through successfully.
*/
export const main = handler(async (event) => {
  const { storage, source } = JSON.parse(event.body);

  const amount = calculateCost(storage);
  const description = 'Scratch charge';

  // Load our secret key from the environment variables
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: 'usd',
  });

  return { status: true };
});
