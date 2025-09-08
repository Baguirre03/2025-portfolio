"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  category?: string;
  location?: string;
  camera?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  categories?: string[];
}

export function PhotoGallery({ photos, categories = [] }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);

  return (
    <>
      {categories.length > 0 && (
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onClick={() => setSelectedPhoto(photo)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {categories.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => setSelectedPhoto(photo)}
            />
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedPhoto && (
            <>
              <div className="relative aspect-video mb-4">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <DialogTitle>{selectedPhoto.title}</DialogTitle>
              <DialogDescription className="text-base">
                {selectedPhoto.description}
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedPhoto.category && (
                  <Badge variant="secondary">{selectedPhoto.category}</Badge>
                )}
                {selectedPhoto.location && (
                  <Badge variant="outline">📍 {selectedPhoto.location}</Badge>
                )}
                {selectedPhoto.camera && (
                  <Badge variant="outline">📷 {selectedPhoto.camera}</Badge>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <Button
            variant="ghost"
            className="absolute inset-0 w-full h-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onClick}
          >
            View Photo
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
          <p className="text-muted-foreground text-sm">{photo.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
