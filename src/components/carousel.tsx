"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  src: string;
  caption?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  className?: string;
}

export function Carousel({ slides, className }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const current = slides[index];

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? slides.length - 1 : i - 1));
  }, [slides.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= slides.length - 1 ? 0 : i + 1));
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className={cn("relative my-6 overflow-hidden rounded-lg", className)}
      role="region"
      aria-label="Image carousel"
    >
      <div className="relative aspect-video w-full bg-muted">
        <Image
          src={current.src}
          alt={current.caption ?? `Slide ${index + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 800px"
          priority={index === 0}
        />
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>
      )}
      {current.caption && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {current.caption}
        </p>
      )}
    </div>
  );
}
