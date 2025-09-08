"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Photos", href: "/photos" },
  { name: "Blog", href: "/blog" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:text-foreground/70 transition-colors"
          >
            Ben Aguirre
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-8">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/blog" && pathname?.startsWith("/blog/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu (you can expand this with state management) */}
        <div className="md:hidden border-t border-border py-2">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/blog" && pathname?.startsWith("/blog/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
