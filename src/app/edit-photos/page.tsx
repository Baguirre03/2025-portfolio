"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";
import { Tag, Loader2, CheckSquare, Square, Tags } from "lucide-react";
import Link from "next/link";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";

type PhotosResponse = {
  photos: Photo[];
  nextCursor: number | null;
};

async function fetchMe(): Promise<{ isAdmin: boolean }> {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function fetchPhotos({
  cursor = 0,
  limit = 100,
}: {
  cursor?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  params.set("cursor", String(cursor));
  params.set("limit", String(limit));
  const res = await fetch(`/api/photos?${params}`);
  if (!res.ok) throw new Error("Failed to fetch photos");
  return res.json() as Promise<PhotosResponse>;
}

export default function EditPhotosPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tagInput, setTagInput] = useState("");
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = meData?.isAdmin ?? false;

  const {
    data,
    isLoading: photosLoading,
    isFetchingNextPage: loadingMore,
    hasNextPage,
    fetchNextPage,
    error: photosError,
  } = useInfiniteQuery({
    queryKey: ["photos", "edit"],
    queryFn: ({ pageParam }) =>
      fetchPhotos({ cursor: pageParam, limit: 100 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: isAdmin,
  });

  const photos = useMemo(
    () => data?.pages.flatMap((p) => p.photos) ?? [],
    [data]
  );
  const loading = meLoading || (isAdmin && photosLoading);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !loadingMore) fetchNextPage();
  }, [hasNextPage, loadingMore, fetchNextPage]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore();
      },
      { threshold: 0.1, rootMargin: "100px" },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, handleLoadMore]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(photos.map((p) => p.id)));
  }, [photos]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const addTagFromInput = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    setTagsToAdd((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed].sort(),
    );
    setTagInput("");
  }, [tagInput]);

  const removeTag = useCallback((tag: string) => {
    setTagsToAdd((prev) => prev.filter((t) => t !== tag));
  }, []);

  const applyTags = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0 || tagsToAdd.length === 0) return;

    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/photos/batch-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, tagsToAdd }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to update tags");
      }

      setSaveMessage(`Added tags to ${data.updated} photo(s).`);
      setSelectedIds(new Set());
      setTagsToAdd([]);

      // Optimistic update: photos are from useInfiniteQuery, we need to invalidate
      queryClient.invalidateQueries({ queryKey: ["photos", "edit"] });
    } catch (err) {
      setSaveMessage(
        err instanceof Error ? err.message : "Failed to update tags.",
      );
    } finally {
      setSaving(false);
    }
  }, [selectedIds, tagsToAdd, queryClient]);

  if (meLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!meLoading && !isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <p className="text-muted-foreground">Not authorized.</p>
        <Link
          href="/photography"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          Back to Photography
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Photos (Batch Tags)</h1>
        <Link
          href="/photography"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Photography
        </Link>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-10 -mx-6 px-6 py-4 bg-background/95 backdrop-blur border-y border-border mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={selectAll}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            Select all
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted transition-colors"
          >
            <Square className="w-4 h-4" />
            Deselect all
          </button>
          <span className="text-sm text-muted-foreground">
            {selectedIds.size} selected
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Tag className="w-4 h-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTagFromInput();
                }
              }}
              placeholder="Add tag (Enter or comma)"
              className="flex-1 min-w-0 px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <button
              type="button"
              onClick={addTagFromInput}
              className="shrink-0 px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted text-sm transition-colors"
            >
              Add
            </button>
          </div>
          {tagsToAdd.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tagsToAdd.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="hover:text-destructive"
                    aria-label={`Remove ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={applyTags}
            disabled={
              saving || selectedIds.size === 0 || tagsToAdd.length === 0
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Tags className="w-4 h-4" />
            )}
            Add tags to selected
          </button>
          {saveMessage && (
            <span
              className={`text-sm ${saveMessage.startsWith("Added") ? "text-chart-2" : "text-destructive"}`}
            >
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      {photosError && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {photosError.message}
        </div>
      )}

      <div className="photo-gallery grid grid-cols-2 md:grid-cols-5 gap-2">
        {photos.map((photo, index) => (
          <label
            key={photo.id}
            className="relative aspect-square group cursor-pointer block focus-within:ring-2 focus-within:ring-ring rounded overflow-hidden"
          >
            <input
              type="checkbox"
              checked={selectedIds.has(photo.id)}
              onChange={() => toggleSelect(photo.id)}
              className="sr-only peer"
            />
            <Image
              src={photo.public_url}
              alt={photo.title || `Photo ${index}`}
              fill
              className="object-cover rounded peer-checked:ring-2 peer-checked:ring-primary"
              sizes="(max-width: 768px) 50vw, 20vw"
              loading={index < 24 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 peer-checked:opacity-100 transition-opacity rounded">
              {selectedIds.has(photo.id) ? (
                <CheckSquare className="w-10 h-10 text-primary" />
              ) : (
                <Square className="w-10 h-10 text-white/80" />
              )}
            </div>
          </label>
        ))}
      </div>

      {hasNextPage && (
        <div ref={loadMoreRef} className="mt-6 flex justify-center py-4">
          {loadingMore && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
