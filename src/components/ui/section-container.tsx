import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function SectionContainer({
  children,
  size = "lg",
  className,
}: SectionContainerProps) {
  const maxWidths = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
  };

  return (
    <div className={cn("mx-auto px-4 py-16", maxWidths[size], className)}>
      {children}
    </div>
  );
}
