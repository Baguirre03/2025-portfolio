import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Photos | Your Name",
  description: "A collection of my photography and visual stories.",
};

export default function Photos() {
  // This would typically come from a CMS, database, or file system
  const photos = [
    {
      id: 1,
      src: "/next.svg", // Replace with actual photo paths
      alt: "Sample photo 1",
      title: "Sample Photo 1",
      description: "A beautiful moment captured.",
    },
    {
      id: 2,
      src: "/vercel.svg", // Replace with actual photo paths
      alt: "Sample photo 2",
      title: "Sample Photo 2",
      description: "Another wonderful shot.",
    },
    // Add more photos as needed
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Photos</h1>
        <p className="text-xl text-gray-600 mb-12">
          A visual journey through moments that caught my eye.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo) => (
            <div key={photo.id} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {photo.title}
                </h3>
                <p className="text-gray-600 mt-1">{photo.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            More photos coming soon. Follow my journey on social media for the
            latest updates.
          </p>
        </div>
      </div>
    </div>
  );
}
