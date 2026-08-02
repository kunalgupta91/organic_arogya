import type { Metadata } from "next";
import { createBannerAction } from "../actions";
import { BannerForm } from "../banner-form";

export const metadata: Metadata = {
  title: "Add Banner",
};

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Add banner</h1>
      <BannerForm action={createBannerAction} />
    </div>
  );
}
