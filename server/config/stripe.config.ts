// server/config/stripe.config.ts
export const stripeConfig = {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    currency: 'rub'
};
