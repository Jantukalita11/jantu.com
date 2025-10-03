export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Ultra‑realistic AI voices. Studio‑grade tools.
            </h1>
            <p className="mt-6 text-lg text-zinc-300">
              Generate lifelike speech, clone voices, dub videos, and transcribe audio across 32+ languages.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="/signup" className="px-5 py-3 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium">Start free</a>
              <a href="/pricing" className="px-5 py-3 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-medium">See pricing</a>
            </div>
          </div>
          <div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-sm text-zinc-400">Public demo voice</div>
              <div className="mt-4 flex items-center gap-3">
                <button className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white">Play demo</button>
                <button className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white">Generate sample</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
