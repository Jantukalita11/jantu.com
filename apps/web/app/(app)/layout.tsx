import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="border-b bg-white/60 backdrop-blur dark:bg-gray-900/60">
        <div className="max-w-6xl mx-auto p-4 flex items-center gap-4">
          <a href="/dashboard" className="font-semibold">Dashboard</a>
          <a href="#" className="text-sm">Projects</a>
          <a href="#" className="text-sm">Studio</a>
          <a href="#" className="text-sm">API</a>
          <a href="#" className="text-sm">Admin</a>
        </div>
      </nav>
      {children}
    </div>
  );
}
