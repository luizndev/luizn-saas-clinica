import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Stripe secret key not found");
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Stripe signature not found");
    }

    const text = await request.text();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    });

    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      /**
       * Pagamento de fatura bem-sucedido
       */
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscription = invoice.subscription as string;
        const customer = invoice.customer as string;

        const metadata = invoice.subscription_details?.metadata;
        const userId = metadata?.userId;

        if (!subscription || !customer || !userId) {
          console.log("Dados incompletos no webhook", {
            subscription,
            customer,
            userId,
          });
          break;
        }

        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: subscription,
            stripeCustomerId: customer,
            plan: "essential",
          })
          .where(eq(usersTable.id, userId));

        break;
      }

      /**
       * Assinatura cancelada
       */
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.log("User ID não encontrado no cancelamento");
          break;
        }

        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            plan: "free",
          })
          .where(eq(usersTable.id, userId));

        break;
      }

      default:
        // eventos não tratados
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return new NextResponse("Webhook error", { status: 400 });
  }
};
