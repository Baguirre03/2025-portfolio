"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";
import { Pencil, Check, X, Loader2, Trash2, Lock, Unlock } from "lucide-react";
import type { PhotoVisibility } from "@/lib/types";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    roll_number: "",
    published_date: "",
    visibility: "public" as PhotoVisibility,
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [accessLevels, setAccessLevels] = useState<string[]>([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [accessPassword, setAccessPassword] = useState("");
  const [accessError, setAccessError] = useState("");
  const [accessLoading, setAccessLoading] = useState(false);
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
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.isAdmin) setIsAdmin(true);
      })
      .catch(() => {});

    fetch("/api/photo-access")
      .then((res) => res.json())
      .then((data) => {
        if (data.levels) setAccessLevels(data.levels);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setEditing(false);
        setConfirmDelete(false);
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
        : data.photos,
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
      visibility: selectedPhoto.visibility || "public",
    });
    setEditing(true);
  }, [selectedPhoto]);

  const cancelEditing = useCallback(() => {
    setEditing(false);
  }, []);

  const saveEdits = useCallback(async () => {
    if (!selectedPhoto) return;
    setSaving(true);
    try {
      const body = {
        title: editData.title,
        description: editData.description,
        roll_number: editData.roll_number
          ? parseInt(editData.roll_number, 10)
          : null,
        published_date: editData.published_date || null,
        visibility: editData.visibility,
      };
      const res = await fetch(`/api/photos/${selectedPhoto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save");
      const { photo: updated } = await res.json();
      // Update local state
      setPhotos((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
      );
      setSelectedPhoto((prev) => (prev ? { ...prev, ...updated } : prev));
      setEditing(false);
    } catch (err) {
      console.error("Error saving photo:", err);
    } finally {
      setSaving(false);
    }
  }, [selectedPhoto, editData]);

  const submitAccessPassword = useCallback(async () => {
    if (!accessPassword.trim()) return;
    setAccessLoading(true);
    setAccessError("");
    try {
      const res = await fetch("/api/photo-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: accessPassword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAccessError(data.error || "Incorrect password");
        return;
      }
      setAccessLevels(data.levels);
      setAccessPassword("");
      setShowPasswordPrompt(false);
      // Reload photos with new access
      setPhotos([]);
      setNextCursor(null);
      const limit = calculatePhotosToLoad();
      await loadPhotos(undefined, limit);
    } catch {
      setAccessError("Something went wrong");
    } finally {
      setAccessLoading(false);
    }
  }, [accessPassword, calculatePhotosToLoad, loadPhotos]);

  const clearAccess = useCallback(async () => {
    await fetch("/api/photo-access", { method: "DELETE" });
    setAccessLevels([]);
    // Reload photos (now only public)
    setPhotos([]);
    setNextCursor(null);
    const limit = calculatePhotosToLoad();
    await loadPhotos(undefined, limit);
  }, [calculatePhotosToLoad, loadPhotos]);

  const handleDelete = useCallback(async () => {
    if (!selectedPhoto) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/photos/${selectedPhoto.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setPhotos((prev) => prev.filter((p) => p.id !== selectedPhoto.id));
      setSelectedPhoto(null);
      setConfirmDelete(false);
      setEditing(false);
    } catch (err) {
      console.error("Error deleting photo:", err);
    } finally {
      setDeleting(false);
    }
  }, [selectedPhoto]);

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
      { threshold: 0.1, rootMargin: "100px" }, // Trigger 100px before visible
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

      {!isAdmin && (
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          {accessLevels.length > 0 ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Unlock className="w-4 h-4" />
              <span>
                Viewing:{" "}
                {accessLevels
                  .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
                  .join(", ")}{" "}
                photos
              </span>
              <button
                onClick={clearAccess}
                className="text-xs text-red-400 hover:text-red-300 underline ml-1"
              >
                Lock
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPasswordPrompt(true)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Enter access code
            </button>
          )}

          {showPasswordPrompt && (
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={accessPassword}
                onChange={(e) => {
                  setAccessPassword(e.target.value);
                  setAccessError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitAccessPassword();
                }}
                placeholder="Password"
                autoFocus
                className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
              <button
                onClick={submitAccessPassword}
                disabled={accessLoading}
                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
              >
                {accessLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Unlock"
                )}
              </button>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setAccessPassword("");
                  setAccessError("");
                }}
                className="p-1 rounded hover:bg-white/10 text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {accessError && (
                <span className="text-xs text-red-400">{accessError}</span>
              )}
            </div>
          )}
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
          onClick={() => {
            setSelectedPhoto(null);
            setEditing(false);
            setConfirmDelete(false);
          }}
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
            <div
              className="mt-4 text-center text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {editing ? (
                <div className="max-w-md mx-auto space-y-3">
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
                      value={editData.visibility}
                      onChange={(e) =>
                        setEditData((d) => ({
                          ...d,
                          visibility: e.target.value as PhotoVisibility,
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public" className="text-black">
                        Public
                      </option>
                      <option value="friends" className="text-black">
                        Friends
                      </option>
                      <option value="family" className="text-black">
                        Family
                      </option>
                      <option value="private" className="text-black">
                        Private
                      </option>
                    </select>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={saveEdits}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                </div>
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
                          disabled={deleting}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-50"
                        >
                          {deleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          disabled={deleting}
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
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
