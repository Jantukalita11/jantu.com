export default function ApiPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API & SDKs</h1>
      <div className="rounded-lg border p-6 space-y-2">
        <p>Use our JS or Python SDKs or call the REST API directly.</p>
        <pre className="bg-black/80 text-white p-3 rounded-md overflow-auto text-sm">{`npm i @audioai/sdk`}</pre>
        <pre className="bg-black/80 text-white p-3 rounded-md overflow-auto text-sm">{`pip install audioai-sdk  # when published`}</pre>
      </div>
    </main>
  );
}
