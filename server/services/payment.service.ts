// server/services/payment.service.ts
import Stripe from 'stripe';
import { Payment } from '../models/Payment';
import { ApiError } from '../utils/ApiError';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
});

export const paymentService = {
    async createPaymentIntent(amount: number) {
        return stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'rub'
        });
    },

    async processPayment(paymentIntentId: string) {
        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!payment) {
            throw new ApiError(404, 'Payment not found');
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            payment.status = 'completed';
            payment.completedAt = new Date();
            await payment.save();
        } else if (paymentIntent.status === 'canceled') {
            payment.status = 'failed';
            await payment.save();
        }

        return payment;
    }
};
