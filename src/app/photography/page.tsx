"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";

type PhotosResponse = {
  photos: Photo[];
  nextCursor: number | null;
};

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Calculate how many photos to load based on viewport
  const calculatePhotosToLoad = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Determine columns based on breakpoint (md:grid-cols-5, default grid-cols-2)
    const columns = viewportWidth >= 768 ? 5 : 2;

    // Estimate photo height (aspect-square + gap)
    // Each photo is roughly viewportWidth / columns, plus gap
    const gapSize = 8; // gap-2 = 0.5rem = 8px
    const photoSize = (viewportWidth - (columns + 1) * gapSize) / columns;

    // Calculate rows that fit in viewport + 2 extra rows for smooth scrolling
    const rowsThatFit = Math.ceil(viewportHeight / (photoSize + gapSize));
    const bufferRows = 2;
    const totalRows = rowsThatFit + bufferRows;

    // Total photos = rows × columns, minimum 12, maximum 50
    const calculated = totalRows * columns;
    return Math.min(Math.max(calculated, 12), 50);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      if (e.key === "Escape") {
        setSelectedPhoto(null);
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
        if (currentIndex === -1 || photos.length === 0) return;

        const nextIndex =
          e.key === "ArrowRight"
            ? (currentIndex + 1) % photos.length
            : (currentIndex - 1 + photos.length) % photos.length;

        setSelectedPhoto(photos[nextIndex]);
      }
    };
    if (selectedPhoto) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedPhoto, photos]);

  const loadPhotos = useCallback(async (cursor?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (typeof cursor === "number" && cursor > 0) {
      params.set("cursor", cursor.toString());
    }
    if (limit) {
      params.set("limit", limit.toString());
    }

    const url = `/api/photos${params.size ? `?${params.toString()}` : ""}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch photos: ${res.status}`);
    }

    const data: PhotosResponse = await res.json();
    setPhotos((prev) =>
      typeof cursor === "number" && cursor > 0
        ? [...prev, ...data.photos]
        : data.photos
    );
    setNextCursor(data.nextCursor);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialPhotos() {
      setLoading(true);
      setError(null);
      try {
        const limit = calculatePhotosToLoad();
        await loadPhotos(undefined, limit);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching photos:", err);
        setError("Unable to load photos right now.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInitialPhotos();

    return () => {
      cancelled = true;
    };
  }, [loadPhotos, calculatePhotosToLoad]);

  const handleLoadMore = useCallback(async () => {
    if (nextCursor == null || loadingMore) return;

    setLoadingMore(true);
    setError(null);
    try {
      const limit = calculatePhotosToLoad();
      await loadPhotos(nextCursor, limit);
    } catch (err) {
      console.error("Error fetching more photos:", err);
      setError("Unable to load more photos. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }, [loadPhotos, nextCursor, loadingMore, calculatePhotosToLoad]);

  // Infinite scroll: observe when the load more trigger enters viewport
  useEffect(() => {
    if (!loadMoreRef.current || nextCursor == null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // Trigger 100px before visible
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [nextCursor, loadingMore, handleLoadMore]);

  if (loading) return <div>Loading photos...</div>;

  if (error && photos.length === 0) {
    return <div>{error}</div>;
  }

  return (
    <>
      {error && (
        <div className="mb-4 text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
      <div className="photo-gallery grid grid-cols-2 md:grid-cols-5 gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id ?? index}
            type="button"
            className="relative aspect-square focus:outline-none focus:ring-2 rounded"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.public_url}
              alt={photo.title || `Photo ${index}`}
              fill
              className="object-cover rounded cursor-zoom-in"
              sizes="(max-width: 768px) 50vw, 20vw"
              loading={index < 18 ? "eager" : "lazy"}
              priority={index < 6}
              // unoptimized={photo.bucket === "photos-private"}
            />
          </button>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {nextCursor != null && (
        <div ref={loadMoreRef} className="mt-6 flex justify-center py-4">
          {loadingMore && (
            <div className="text-sm text-gray-500">Loading more photos...</div>
          )}
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title || "Photo viewer"}
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative w-full max-w-5xl">
            <div className="relative w-full h-[60vh] md:h-[70vh] bg-transparent rounded-lg overflow-hidden">
              <Image
                src={selectedPhoto.public_url}
                alt={selectedPhoto.title || "Selected photo"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                // unoptimized={selectedPhoto.bucket === "photos-private"}
              />
            </div>
            <div className="mt-4 text-center text-white">
              <h3 className="text-lg font-semibold">
                {selectedPhoto.title || "Untitled"}
              </h3>
              {selectedPhoto.description && (
                <p className="text-sm text-gray-200 mt-1">
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
