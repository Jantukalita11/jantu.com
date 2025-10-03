export default function APIPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">API & SDK</h1>
      <p className="mt-2 text-zinc-300">REST API for TTS, STT, cloning, and jobs. SDKs for JS & Python.</p>
      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="font-semibold">Quickstart (JavaScript)</div>
        <pre className="mt-2 text-sm overflow-auto"><code>{`import { AudioAI } from '@audio-ai/sdk';

const client = new AudioAI({ apiKey: process.env.AUDIOAI_API_KEY });
const audio = await client.tts.synthesize({ text: 'Hello world', voiceId: 'alloy' });
`}</code></pre>
      </div>
    </div>
  );
}
