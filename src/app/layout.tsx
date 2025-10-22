import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ben Aguirre",
  description:
    "Ben Aguirre's portfolio highlighting Loyola Chicago marketer-turned-software builder, featuring projects, photography, writing, and open source work",
  // No need to set icons here anymore - handled by the client component
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <head>
          <link rel="icon" href="/images/code-3.png" />
        </head>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <Navigation />
            <main className="min-h-screen">{children}</main>
          </Suspense>
        </ThemeProvider>
        <Analytics></Analytics>
      </body>
    </html>
  );
}
