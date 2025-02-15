// src/components/CheckoutForm.tsx
import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {}

export default function CheckoutForm({}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      // Make sure to change this to your client secret.
      '{CLIENT_SECRET}',
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Jenny Rosen',
          },
        },
      }
    );

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else {
      if (paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        setIsLoading(false);
      }
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement id="card-element" options={{ hidePostalCode: true }} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}