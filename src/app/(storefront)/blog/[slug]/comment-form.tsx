"use client";

import { useActionState } from "react";
import { submitCommentAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CommentForm({
  blogId,
  isLoggedIn,
}: {
  blogId: string;
  isLoggedIn: boolean;
}) {
  const [state, formAction, isPending] = useActionState(submitCommentAction, {
    error: null,
    success: false,
  });

  if (state.success) {
    return (
      <p className="text-primary-700 bg-primary-50 rounded-lg p-4 text-sm">
        Thanks for your comment! It will appear once approved by a moderator.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="blogId" value={blogId} />
      {!isLoggedIn && (
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
      )}
      <div>
        <Label htmlFor="content">Comment</Label>
        <Textarea id="content" name="content" rows={3} required />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Posting…" : "Post comment"}
      </Button>
    </form>
  );
}
