"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Photography", href: "/photography" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-semibold tracking-tight">
              Ben Aguirre
            </span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium leading-6 transition-colors hover:text-accent",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <Link
              href="https://linkedin.com/in/ben-aguirre"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://github.com/Baguirre03"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://x.com/Ben_Aguirre1"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-6 pb-6 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors hover:bg-muted",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Social Links for Mobile */}
            <div className="space-y-2 pt-4 border-t">
              <Link
                href="mailto:hello@example.com"
                className="flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="mr-3 h-4 w-4" />
                Email
              </Link>
              <Link
                href="https://github.com"
                className="flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="mr-3 h-4 w-4" />
                GitHub
              </Link>
              <Link
                href="https://linkedin.com"
                className="flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Linkedin className="mr-3 h-4 w-4" />
                LinkedIn
              </Link>
              <Link
                href="https://twitter.com/yourusername"
                target="_blank"
                className="flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Twitter className="mr-3 h-4 w-4" />
                Twitter
              </Link>
            </div>

            <div className="pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full justify-start p-3"
              >
                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute ml-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                Toggle theme
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
