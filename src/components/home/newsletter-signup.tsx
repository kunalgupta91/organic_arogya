"use client";

import { useActionState } from "react";
import { subscribeNewsletterAction } from "@/app/(storefront)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletterAction, {
    success: false,
    error: null,
  });

  return (
    <section className="bg-primary-900 py-16 text-white">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <h2 className="font-display text-2xl">Health Tips, Straight to Your Inbox</h2>
        <p className="mt-2 text-sm text-white/70">
          Subscribe for Ayurvedic wellness tips and early access to new products.
        </p>
        {state.success ? (
          <p className="mt-6 text-sm">Thanks for subscribing!</p>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="bg-white text-black"
            />
            <Button type="submit" variant="secondary" disabled={isPending}>
              {isPending ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        )}
        {state.error && <p className="mt-2 text-sm text-red-300">{state.error}</p>}
      </div>
    </section>
  );
}
