import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <a href="/" className="font-semibold">Audio AI Studio</a>
          <nav className="space-x-4">
            <a href="/pricing" className="text-sm">Pricing</a>
            <a href="/dashboard" className="text-sm">Dashboard</a>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
