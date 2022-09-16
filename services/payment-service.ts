import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    typescript: true,
    apiVersion: '2020-08-27'
})

import successAndErrors from "../utils/successAndErrors";
import _ from "lodash";

const createPaymentIntent = async (user: any, body: any) => {
    const { amount, description } = body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'AUD',
            payment_method_types: ['card'],
            receipt_email: user?.email,
            capture_method: "automatic",
            description: description ?? "Plan subcription",
            metadata: {
                userId: user?.id
            }
        });
        if (!_.isEmpty(paymentIntent?.cancellation_reason)) {
            throw successAndErrors.failWithCustomMessage(`Payment is not processed because ${paymentIntent?.cancellation_reason}`)
        }
        // console.log("paymentIntent.status,", paymentIntent.status);
        // if (paymentIntent.status == )
        return { clientSecret: paymentIntent.client_secret }
    } catch (error: any) {
        throw successAndErrors.failWithCustomMessage(error?.message ?? 'Payment is not processed please contact admin, ');
    }
};

const createDonatePaymentIntent = async (body: any) => {
    const { amount, email, description } = body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'AUD',
            payment_method_types: ['card'],
            receipt_email: email,
            capture_method: "automatic",
            description: description ?? "Donation"
        });
        if (!_.isEmpty(paymentIntent?.cancellation_reason)) {
            throw successAndErrors.failWithCustomMessage(`Payment is not processed because ${paymentIntent?.cancellation_reason}`)
        }
        // console.log("paymentIntent.status,", paymentIntent.status);
        // if (paymentIntent.status == )
        return { clientSecret: paymentIntent.client_secret }
    } catch (error: any) {
        throw successAndErrors.failWithCustomMessage(error?.message ?? 'Payment is not processed please contact admin, ');
    }
};

export {
    createPaymentIntent,
    createDonatePaymentIntent
}