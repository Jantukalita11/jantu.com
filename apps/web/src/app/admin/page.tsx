export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Admin Console</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="font-semibold">Users</div>
          <div className="text-sm text-zinc-400">Manage users, teams, and seats</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="font-semibold">Usage</div>
          <div className="text-sm text-zinc-400">View credits and overages</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="font-semibold">Billing</div>
          <div className="text-sm text-zinc-400">Invoices and plans</div>
        </div>
      </div>
    </div>
  );
}
