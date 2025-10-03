export default function DashboardPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">Usage</div>
        <div className="rounded-lg border p-4">Recent Jobs</div>
        <div className="rounded-lg border p-4">Projects</div>
      </div>
    </main>
  );
}
