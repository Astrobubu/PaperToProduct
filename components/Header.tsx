"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-none">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M12 6v7" />
                <path d="M9 10l3 3 3-3" />
              </svg>
            </div>
            <span className="font-heading font-bold text-lg text-t-primary">
              PaperToProduct
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/search"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/search")
                  ? "text-secondary bg-accent/40"
                  : "text-t-muted hover:text-t-secondary"
              }`}
            >
              Papers
            </Link>
            <Link
              href="/patents"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/patents")
                  ? "text-secondary bg-accent/40"
                  : "text-t-muted hover:text-t-secondary"
              }`}
            >
              Patents
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
