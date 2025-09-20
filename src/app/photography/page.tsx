"use client";
import { useState, useEffect } from "react";
import { getPublicPhotos } from "@/lib/supabase";
import Image from "next/image";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        // List all files in the photos bucket
        const files = await getPublicPhotos();
        console.log(files, "files");

        const photoUrls = files.map((file) => {
          return {
            name: file.name,
            url: file.name,
          };
        });

        setPhotos(photoUrls);
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
    <div className="photo-gallery">
      {photos.map((photo, index) => (
        <Image
          key={index}
          src={photo.url}
          alt={photo.name}
          width={200}
          height={200}
          className="object-cover"
        />
      ))}
    </div>
  );
}
