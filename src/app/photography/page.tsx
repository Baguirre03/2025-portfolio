"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";
import { Pencil, Check, X, Loader2, Trash2, Tag } from "lucide-react";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const PHOTOS_PAGE_SIZE = 24;

async function fetchMe(): Promise<{ isAdmin: boolean }> {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function fetchPhotos({
  cursor = 0,
  limit = PHOTOS_PAGE_SIZE,
}: {
  cursor?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  params.set("cursor", String(cursor));
  params.set("limit", String(limit));
  const res = await fetch(`/api/photos?${params}`);
  if (!res.ok) throw new Error("Failed to fetch photos");
  return res.json() as Promise<{ photos: Photo[]; nextCursor: number | null }>;
}

async function fetchAllTags(): Promise<{ tags: string[] }> {
  const res = await fetch("/api/photos/tags");
  if (!res.ok) throw new Error("Failed to fetch tags");
  return res.json();
}

export default function PhotoGallery() {
  const queryClient = useQueryClient();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    roll_number: "",
    published_date: "",
    bucket: "photos-public",
    tags: [] as string[],
    tagInput: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = meData?.isAdmin ?? false;

  const { data: tagsData } = useQuery({
    queryKey: ["photos", "tags"],
    queryFn: fetchAllTags,
    staleTime: 5 * 60 * 1000,
  });
  const allTags = tagsData?.tags ?? [];

  const {
    data,
    isLoading: loading,
    isFetchingNextPage: loadingMore,
    hasNextPage,
    fetchNextPage,
    error: photosError,
  } = useInfiniteQuery({
    queryKey: ["photos"],
    queryFn: ({ pageParam }) =>
      fetchPhotos({ cursor: pageParam, limit: PHOTOS_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const photos = useMemo(
    () => data?.pages.flatMap((p) => p.photos) ?? [],
    [data],
  );

  const saveEditsMutation = useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: {
        title: string;
        description: string;
        roll_number: number | null;
        published_date: string | null;
        bucket: string;
        tags: string[];
      };
    }) => {
      const res = await fetch(`/api/photos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json() as Promise<{ photo: Photo }>;
    },
    onSuccess: ({ photo: updated }) => {
      queryClient.setQueryData(
        ["photos"],
        (
          old:
            | { pages: { photos: Photo[]; nextCursor: number | null }[] }
            | undefined,
        ) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              photos: page.photos.map((p) =>
                p.id === updated.id ? updated : p,
              ),
            })),
          };
        },
      );
      setSelectedPhoto((prev) => (prev?.id === updated.id ? updated : prev));
      setEditing(false);
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        ["photos"],
        (
          old:
            | { pages: { photos: Photo[]; nextCursor: number | null }[] }
            | undefined,
        ) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              photos: page.photos.filter((p) => p.id !== deletedId),
            })),
          };
        },
      );
      setSelectedPhoto(null);
      setConfirmDelete(false);
      setEditing(false);
    },
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !loadingMore) {
      fetchNextPage();
    }
  }, [hasNextPage, loadingMore, fetchNextPage]);

  const startEditing = useCallback(() => {
    if (!selectedPhoto) return;
    setEditData({
      title: selectedPhoto.title || "",
      description: selectedPhoto.description || "",
      roll_number:
        selectedPhoto.roll_number != null
          ? String(selectedPhoto.roll_number)
          : "",
      published_date: selectedPhoto.published_date || "",
      bucket: selectedPhoto.bucket || "photos-public",
      tags: selectedPhoto.tags ?? [],
      tagInput: "",
    });
    setEditing(true);
  }, [selectedPhoto]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setEditing(false);
        setConfirmDelete(false);
        return;
      }

      if (e.key === "e" && !editing && isAdmin) {
        e.preventDefault();
        startEditing();
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
  }, [selectedPhoto, photos, editing, isAdmin, startEditing]);

  const cancelEditing = useCallback(() => {
    setEditing(false);
  }, []);

  const saveEdits = useCallback(() => {
    if (!selectedPhoto) return;
    saveEditsMutation.mutate({
      id: selectedPhoto.id,
      body: {
        title: editData.title,
        description: editData.description,
        roll_number: editData.roll_number
          ? parseInt(editData.roll_number, 10)
          : null,
        published_date: editData.published_date || null,
        bucket: editData.bucket,
        tags: editData.tags,
      },
    });
  }, [selectedPhoto, editData, saveEditsMutation]);

  const handleDelete = useCallback(() => {
    if (!selectedPhoto) return;
    deletePhotoMutation.mutate(selectedPhoto.id);
  }, [selectedPhoto, deletePhotoMutation]);

  // Infinite scroll: observe when the load more trigger enters viewport
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, loadingMore, handleLoadMore]);

  const filteredPhotos = activeTag
    ? photos.filter((p) => p.tags?.includes(activeTag))
    : photos;

  const error = photosError?.message ?? null;

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
        {filteredPhotos.map((photo, index) => (
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
            />
          </button>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
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
          onClick={() => {
            setSelectedPhoto(null);
            setEditing(false);
            setConfirmDelete(false);
          }}
        >
          <div className="relative w-full max-w-5xl max-h-full overflow-y-auto">
            <div
              className={`relative w-full bg-transparent rounded-lg overflow-hidden ${editing ? "h-[35vh] md:h-[45vh]" : "h-[60vh] md:h-[70vh]"}`}
            >
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
            <div
              className={`${editing ? "mt-2" : "mt-4"} text-center text-white`}
              onClick={(e) => e.stopPropagation()}
            >
              {editing ? (
                <form
                  className="max-w-md mx-auto space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveEdits();
                  }}
                >
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, title: e.target.value }))
                    }
                    placeholder="Title"
                    className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description"
                    rows={2}
                    className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      min="1"
                      value={editData.roll_number}
                      onChange={(e) =>
                        setEditData((d) => ({
                          ...d,
                          roll_number: e.target.value,
                        }))
                      }
                      placeholder="Roll #"
                      className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={editData.published_date}
                      onChange={(e) =>
                        setEditData((d) => ({
                          ...d,
                          published_date: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={editData.bucket}
                      onChange={(e) =>
                        setEditData((d) => ({
                          ...d,
                          bucket: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="photos-public" className="text-black">
                        Public
                      </option>
                      <option value="photos-private" className="text-black">
                        Private
                      </option>
                    </select>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {editData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-xs text-gray-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() =>
                              setEditData((d) => ({
                                ...d,
                                tags: d.tags.filter((t) => t !== tag),
                              }))
                            }
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={editData.tagInput}
                      onChange={(e) =>
                        setEditData((d) => ({ ...d, tagInput: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" || e.key === ",") &&
                          editData.tagInput.trim()
                        ) {
                          e.preventDefault();
                          const newTag = editData.tagInput.trim().toLowerCase();
                          if (!editData.tags.includes(newTag)) {
                            setEditData((d) => ({
                              ...d,
                              tags: [...d.tags, newTag],
                              tagInput: "",
                            }));
                          } else {
                            setEditData((d) => ({ ...d, tagInput: "" }));
                          }
                        }
                      }}
                      placeholder="Add tag (enter or comma)"
                      className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={saveEditsMutation.isPending}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
                    >
                      {saveEditsMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saveEditsMutation.isPending}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {selectedPhoto.title || "Untitled"}
                    </h3>
                    {isAdmin && (
                      <>
                        <button
                          onClick={startEditing}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                          title="Edit photo details"
                        >
                          <Pencil className="w-4 h-4 text-gray-300" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="p-1 rounded hover:bg-red-500/20 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4 text-gray-300 hover:text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                  {confirmDelete ? (
                    <div className="mt-3 p-3 rounded bg-red-500/10 border border-red-500/30 max-w-sm mx-auto">
                      <p className="text-sm text-red-200 mb-2">
                        Are you sure you want to delete this photo? This cannot
                        be undone.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={handleDelete}
                          disabled={deletePhotoMutation.isPending}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-50"
                        >
                          {deletePhotoMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          disabled={deletePhotoMutation.isPending}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {selectedPhoto.description && (
                        <p className="text-sm text-gray-200 mt-1">
                          {selectedPhoto.description}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-300">
                        {selectedPhoto.roll_number != null && (
                          <span>Roll #{selectedPhoto.roll_number}</span>
                        )}
                        {selectedPhoto.published_date && (
                          <span>
                            {new Date(
                              selectedPhoto.published_date + "T00:00:00",
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      {selectedPhoto.tags?.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                          {selectedPhoto.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tag filter — desktop only, bottom-right */}
      {allTags.length > 0 && !selectedPhoto && (
        <div className="hidden md:block fixed bottom-6 right-6 z-40">
          <div
            className={`origin-bottom-right transition-all duration-300 ease-out ${
              showTagFilter
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            }`}
          >
            <div className="bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 rounded-xl p-3 shadow-lg max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Filter by tag
                </span>
                <button
                  onClick={() => setShowTagFilter(false)}
                  className="p-0.5 rounded hover:bg-neutral-700 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-all duration-200 ${
                    activeTag === null
                      ? "bg-white text-black scale-105"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveTag((prev) => (prev === tag ? null : tag))
                    }
                    className={`px-2.5 py-1 rounded-full text-xs transition-all duration-200 ${
                      activeTag === tag
                        ? "bg-white text-black scale-105"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                    style={{
                      transitionDelay: showTagFilter
                        ? `${(i + 1) * 30}ms`
                        : "0ms",
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowTagFilter((v) => !v)}
            className={`transition-all duration-300 ease-out flex items-center gap-2 px-3 py-2 rounded-full shadow-lg mt-2 ml-auto ${
              showTagFilter
                ? "scale-90 opacity-0 pointer-events-none"
                : "scale-100 opacity-100"
            } ${
              activeTag
                ? "bg-white text-black"
                : "bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 text-neutral-300 hover:text-white"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="text-sm">{activeTag || "Tags"}</span>
          </button>
        </div>
      )}
    </>
  );
}
