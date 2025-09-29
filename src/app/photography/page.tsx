"use client";
import { useState, useEffect, useCallback } from "react";
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

  const loadPhotos = useCallback(async (cursor?: number) => {
    const params = new URLSearchParams();
    if (typeof cursor === "number" && cursor > 0) {
      params.set("cursor", cursor.toString());
    }

    const url = `/api/photos${params.size ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });

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
        await loadPhotos();
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
  }, [loadPhotos]);

  const handleLoadMore = useCallback(async () => {
    if (nextCursor == null) return;

    setLoadingMore(true);
    setError(null);
    try {
      await loadPhotos(nextCursor);
    } catch (err) {
      console.error("Error fetching more photos:", err);
      setError("Unable to load more photos. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }, [loadPhotos, nextCursor]);

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
              // unoptimized={photo.bucket === "photos-private"}
            />
          </button>
        ))}
      </div>

      {nextCursor != null && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more photos"}
          </button>
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
