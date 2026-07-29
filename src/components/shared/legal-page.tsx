import { SITE_CONFIG } from "@/constants/site";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Draft placeholder — legal review required.</strong> This page uses generic
        e-commerce policy language and has not been reviewed by a lawyer. Do not treat it as
        final or legally binding until qualified counsel has reviewed and approved it,
        especially given {SITE_CONFIG.name}&apos;s international customers.
      </div>
      <h1 className="font-display text-primary-900 text-3xl">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed [&_h2]:font-display [&_h2]:text-primary-900 [&_h2]:mt-8 [&_h2]:text-xl [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
