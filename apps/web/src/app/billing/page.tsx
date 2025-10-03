export default function BillingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p className="mt-2 text-zinc-300">Manage your plan, credits, and invoices.</p>
      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="font-semibold">Current plan</div>
        <div className="text-zinc-300">Free — 10k credits/month</div>
        <a href="/pricing" className="mt-4 inline-block px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white">Upgrade</a>
      </div>
    </div>
  );
}
