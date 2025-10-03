export default function PricingPage() {
  const tiers = [
    { name: 'Free', price: 0, credits: '10k/mo', features: ['TTS, STT', 'Limited Studio', 'API (low concurrency)'] },
    { name: 'Starter', price: 5, credits: '30k/mo', features: ['Commercial use', 'Instant cloning', 'Dubbing Studio'] },
    { name: 'Creator', price: 11, credits: '100k/mo', features: ['Pro cloning', 'Usage billing', '192 kbps audio'] },
    { name: 'Pro', price: 99, credits: '500k/mo', features: ['44.1kHz PCM', 'High concurrency', 'Priority support'] },
    { name: 'Scale', price: 330, credits: '2M/mo + 3 seats', features: ['Team controls', 'Elevated concurrency'] },
    { name: 'Business', price: 1320, credits: '11M/mo + 5 seats', features: ['Low-latency pricing', '3 pro clones', 'SLA'] }
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Pricing</h1>
      <p className="mt-2 text-zinc-300">Choose a plan that scales with you.</p>
      <div className="mt-10 grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="text-sm text-zinc-400">{t.credits}</div>
            <div className="mt-2 text-2xl font-semibold">{t.name}</div>
            <div className="mt-1 text-3xl font-bold">${t.price}<span className="text-base font-medium text-zinc-400">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {t.features.map((f) => (<li key={f}>• {f}</li>))}
            </ul>
            <a className="mt-6 inline-block w-full text-center px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white" href="/signup">Choose</a>
          </div>
        ))}
      </div>
    </div>
  );
}
