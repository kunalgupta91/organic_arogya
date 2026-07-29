"use client";

import { useActionState } from "react";
import { submitContactAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactAction, {
    success: false,
    error: null,
  });

  if (state.success) {
    return (
      <p className="text-primary-700 bg-primary-50 rounded-lg p-4 text-sm">
        Thanks for reaching out — we&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div>
          <Label htmlFor="subject">Subject (optional)</Label>
          <Input id="subject" name="subject" />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
