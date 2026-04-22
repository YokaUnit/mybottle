"use client";

import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/lib/env";

const stripeKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);
