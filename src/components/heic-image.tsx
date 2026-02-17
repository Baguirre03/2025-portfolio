"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface HeicImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function HeicImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: HeicImageProps) {
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const objectUrlRef = useRef<string | null>(null);
  const isHeic = src.toLowerCase().endsWith(".heic");

  useEffect(() => {
    if (!isHeic) return;

    let cancelled = false;

    async function convert() {
      try {
        const heic2any = (await import("heic2any")).default;
        const res = await fetch(src);
        const blob = await res.blob();
        const converted = await heic2any({
          blob,
          toType: "image/jpeg",
          quality: 0.9,
        });
        const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
        const url = URL.createObjectURL(jpegBlob);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = url;
        setConvertedUrl(url);
        setError(false);
      } catch (err) {
        if (!cancelled) {
          console.error("HEIC conversion failed:", err);
          setError(true);
        }
      }
    }

    convert();

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [src, isHeic]);

  if (!isHeic) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  if (error) {
    return (
      <div
        className={className}
        style={
          fill
            ? { position: "absolute", inset: 0 }
            : undefined
        }
      >
        <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
          Image unavailable
        </div>
      </div>
    );
  }

  if (!convertedUrl) {
    return (
      <div
        className={className}
        style={
          fill
            ? { position: "absolute", inset: 0 }
            : undefined
        }
      >
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={convertedUrl}
      alt={alt}
      className={className}
      style={
        fill
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }
          : undefined
      }
    />
  );
}
