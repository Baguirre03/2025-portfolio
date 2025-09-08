import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  gradient?: "primary" | "secondary" | "rainbow" | "sunset" | "ocean";
  className?: string;
}

export function GradientText({
  children,
  gradient = "primary",
  className,
}: GradientTextProps) {
  const gradients = {
    primary: "bg-gradient-to-r from-primary to-primary/60",
    secondary: "bg-gradient-to-r from-secondary to-secondary/60",
    rainbow:
      "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
    sunset: "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500",
    ocean: "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500",
  };

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent",
        gradients[gradient],
        className
      )}
    >
      {children}
    </span>
  );
}
