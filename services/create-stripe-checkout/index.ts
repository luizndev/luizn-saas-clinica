"use server"

import { headers } from "next/headers";
import Stripe from "stripe";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const createStripeCheckout = actionClient.action(async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session?.user) {
        throw new Error("Usuário não autenticado")
    }

    if(!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Chave secreta do Stripe não encontrada")
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2026-01-28.clover"
    })


    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
                quantity: 1,
            },
        ],
        subscription_data: {
            metadata: {
                userId: session.user.id,
            },
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/plans`,
    })

    return {
        sessionId: checkoutSession.id,
        url: checkoutSession.url
    }
})