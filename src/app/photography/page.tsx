"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

type PhotoRow = {
  id?: string | number;
  title?: string | null;
  description?: string | null;
  display_url: string;
};

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos");
        const data: PhotoRow[] = await res.json();
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
    <div className="photo-gallery grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <div key={photo.id ?? index} className="relative aspect-square">
          <Image
            src={photo.display_url}
            alt={photo.title ?? `Photo ${index + 1}`}
            fill
            className="object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
}
