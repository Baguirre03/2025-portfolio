"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    };
    if (selectedPhoto) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedPhoto]);

  useEffect(() => {
    async function fetchPhotos() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      try {
        const res = await fetch("/api/photos");
        const data: Photo[] = await res.json();
        console.log(data, "data");
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  if (loading) return <div>Loading photos...</div>;

  return (
    <>
      <div className="photo-gallery grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos
          .filter((p) => p.bucket === "photos-public")
          .map((photo, index) => (
            <button
              key={photo.id ?? index}
              type="button"
              className="relative aspect-square focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.public_url}
                alt={photo.title || `Photo ${index}`}
                fill
                className="object-cover rounded cursor-zoom-in"
              />
            </button>
          ))}
      </div>

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
