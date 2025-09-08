import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconBoxProps {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "destructive";
  className?: string;
}

export function IconBox({
  icon,
  size = "md",
  variant = "default",
  className,
}: IconBoxProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const variants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary text-secondary-foreground",
    success:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    destructive: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        sizeClasses[size],
        variants[variant],
        className
      )}
    >
      <div className={iconSizes[size]}>{icon}</div>
    </div>
  );
}
