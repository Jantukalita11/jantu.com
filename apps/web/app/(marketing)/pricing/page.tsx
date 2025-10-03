const tiers = [
  { name: "Free", price: "$0", credits: "10k/mo" },
  { name: "Starter", price: "$5", credits: "30k/mo" },
  { name: "Creator", price: "$11", credits: "100k/mo" },
  { name: "Pro", price: "$99", credits: "500k/mo" },
  { name: "Scale", price: "$330", credits: "2M/mo" },
  { name: "Business", price: "$1320", credits: "11M/mo" },
];

export default function PricingPage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-xl border p-6 bg-white/5">
            <h2 className="text-2xl font-semibold">{t.name}</h2>
            <p className="text-3xl font-bold mt-2">{t.price}</p>
            <p className="text-gray-500 dark:text-gray-400">{t.credits} credits</p>
            <button className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white">Choose</button>
          </div>
        ))}
      </div>
    </main>
  );
}
