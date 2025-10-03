export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Credits</div>
          <div className="text-2xl font-semibold">10,000</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Recent Jobs</div>
          <ul className="mt-2 text-sm text-zinc-300 space-y-1">
            <li>• TTS: Welcome message</li>
            <li>• STT: Meeting.mp3</li>
          </ul>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Team</div>
          <div className="text-zinc-300">1 seat (Owner)</div>
        </div>
      </div>
    </div>
  );
}
