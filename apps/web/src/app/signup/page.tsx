export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <div className="mt-6 space-y-4">
        <button className="w-full px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700">Continue with Google</button>
        <button className="w-full px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700">Continue with GitHub</button>
        <div className="h-px bg-zinc-800" />
        <form className="space-y-3">
          <input className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" placeholder="Email" />
          <input type="password" className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800" placeholder="Password" />
          <button className="w-full px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white">Sign up</button>
        </form>
      </div>
    </div>
  );
}
