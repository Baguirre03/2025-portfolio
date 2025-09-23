"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const mounted = true;
    (async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } catch (e) {
        console.log(e, "e");
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session) {
        router.replace("/photography");
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        router.refresh();
        router.replace("/photography");
      }
    });
    return () => sub.subscription?.unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/login`
              : undefined,
        },
      });
      if (error) throw error;
      setMessage("Check your email for the magic link.");
    } catch (err: unknown) {
      const error = err as Error;
      setMessage(error.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-3 py-2 bg-black text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </form>
    </div>
  );
}
