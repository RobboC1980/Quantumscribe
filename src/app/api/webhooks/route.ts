import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const supabase = createRouteHandlerClient({ cookies });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Retrieve the subscription from Stripe
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Update user's subscription status
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: session.metadata?.userId,
            status: 'active',
            subscription_id: subscription.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            tier: session.metadata?.subscriptionTier || 'basic'
          });

        if (error) {
          console.error('Error updating subscription:', error);
          return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
        }
        break;
      }

      // Add other event handlers as needed
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
} 