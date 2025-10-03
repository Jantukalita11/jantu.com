export default function StudioPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Studio</h1>
      <p className="mt-2 text-zinc-300">Project-based workspace with multi-track timeline and cloning wizard.</p>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="font-semibold">Create new project</div>
          <div className="mt-3 flex gap-3">
            <button className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white">TTS Project</button>
            <button className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white">Dubbing Project</button>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="font-semibold">Recent projects</div>
          <ul className="mt-2 text-sm text-zinc-300 space-y-1">
            <li>• Podcast intro</li>
            <li>• Product ad (EN→ES dubbing)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
