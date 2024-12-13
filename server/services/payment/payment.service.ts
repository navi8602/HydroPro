// server/services/payment/payment.service.ts
import Stripe from 'stripe';
import { Payment } from '../../models/Payment';
import { ApiError } from '../../utils/ApiError';
import { stripeConfig } from '../../config/stripe.config';

const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: '2023-10-16'
});

export class PaymentService {
    static async processRentalPayment(userId: string, amount: number, contractId: string) {
        try {
            const payment = await Payment.create({
                userId,
                amount,
                type: 'rental',
                status: 'pending',
                contractId
            });

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100, // Convert to cents
                currency: 'rub',
                metadata: {
                    paymentId: payment.id,
                    contractId
                }
            });

            await Payment.findByIdAndUpdate(payment.id, {
                stripePaymentIntentId: paymentIntent.id
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentId: payment.id
            };
        } catch (error) {
            throw new ApiError(500, 'Payment processing failed');
        }
    }

    static async handleStripeWebhook(event: Stripe.Event) {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handleSuccessfulPayment(event.data.object as Stripe.PaymentIntent);
                break;
            case 'payment_intent.payment_failed':
                await this.handleFailedPayment(event.data.object as Stripe.PaymentIntent);
                break;
        }
    }

    private static async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
        const payment = await Payment.findOne({
            stripePaymentIntentId: paymentIntent.id
        });

        if (payment) {
            payment.status = 'completed';
            payment.completedAt = new Date();
            await payment.save();
        }
    }

    private static async handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
        const payment = await Payment.findOne({
            stripePaymentIntentId: paymentIntent.id
        });

        if (payment) {
            payment.status = 'failed';
            payment.error = paymentIntent.last_payment_error?.message;
            await payment.save();
        }
    }
}
