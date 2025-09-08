"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  icon: ReactNode;
  onClick: () => void;
  tooltip?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FloatingActionButton({
  icon,
  onClick,
  tooltip,
  position = "bottom-right",
  size = "md",
  className,
}: FloatingActionButtonProps) {
  const positions = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  const sizes = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  };

  const button = (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
        positions[position],
        sizes[size],
        className
      )}
    >
      {icon}
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
