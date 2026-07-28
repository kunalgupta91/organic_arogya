export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-border rounded-xl border bg-white p-5">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-display text-primary-900 mt-1 text-3xl">{value}</p>
    </div>
  );
}
