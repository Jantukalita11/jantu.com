export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Welcome! Let’s set things up.</h1>
      <ol className="mt-6 space-y-4 list-decimal list-inside text-zinc-300">
        <li>Generate your first sample voice</li>
        <li>Create a project in Studio</li>
        <li>Connect billing (trial available)</li>
      </ol>
      <div className="mt-8 flex gap-3">
        <a className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white" href="/studio">Open Studio</a>
        <a className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white" href="/dashboard">Go to Dashboard</a>
      </div>
    </div>
  );
}
