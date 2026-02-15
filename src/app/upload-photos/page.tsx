"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/upload";
import { X, Upload, Check, AlertCircle, Loader2 } from "lucide-react";

type FileEntry = {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

type PhotoVisibility = "public" | "private" | "friends" | "family";

interface SharedFormData {
  visibility: PhotoVisibility;
  rollNumber: string;
  publishedDate: string;
}

export default function PhotoUpload() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [sharedData, setSharedData] = useState<SharedFormData>({
    visibility: "public",
    rollNumber: "",
    publishedDate: "",
  });
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return {
          isValid: false,
          error: `Unsupported format: ${file.type.split("/")[1]?.toUpperCase()}`,
        };
      }
      if (file.size > MAX_FILE_SIZE) {
        return {
          isValid: false,
          error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB)`,
        };
      }
      return { isValid: true };
    },
    [],
  );

  const handleFilesSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files;
      if (!selected || selected.length === 0) return;

      setValidationError(null);

      const newEntries: FileEntry[] = [];
      const errors: string[] = [];

      for (const file of Array.from(selected)) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }
        newEntries.push({
          file,
          preview: URL.createObjectURL(file),
          status: "pending",
        });
      }

      if (errors.length > 0) {
        setValidationError(errors.join("\n"));
      }

      setFiles((prev) => [...prev, ...newEntries]);

      // Reset file input so the same files can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [validateFile],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const entry = prev[index];
      if (entry) URL.revokeObjectURL(entry.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setValidationError(null);
    setUploadProgress({ done: 0, total: 0 });
  }, [files]);

  const handleUploadAll = useCallback(async () => {
    const pending = files.filter((f) => f.status === "pending");
    if (pending.length === 0) return;

    setUploading(true);
    setUploadProgress({ done: 0, total: pending.length });

    let completed = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue;

      // Mark as uploading
      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f)),
      );

      try {
        const payload = new FormData();
        payload.append("file", files[i].file);
        payload.append("title", files[i].file.name);
        payload.append("description", "");
        payload.append("visibility", sharedData.visibility);
        if (sharedData.rollNumber.trim()) {
          payload.append("rollNumber", sharedData.rollNumber.trim());
        }
        if (sharedData.publishedDate) {
          payload.append("publishedDate", sharedData.publishedDate);
        }

        const res = await fetch("/api/upload-photo", {
          method: "POST",
          body: payload,
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Upload failed");
        }

        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "done" } : f)),
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed";
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error", error: message } : f,
          ),
        );
      }

      completed++;
      setUploadProgress({ done: completed, total: pending.length });
    }

    setUploading(false);
  }, [files, sharedData]);

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Upload Photos</h2>

      {/* File picker */}
      <div className="mb-6">
        <label
          htmlFor="photo-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Photos
        </label>
        <input
          ref={fileInputRef}
          id="photo-input"
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={handleFilesSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
          disabled={uploading}
        />
        <p className="mt-1 text-xs text-gray-400">
          JPEG or PNG, max 10MB each. Select multiple files at once.
        </p>
      </div>

      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm whitespace-pre-line">
            {validationError}
          </p>
        </div>
      )}

      {/* Thumbnails grid */}
      {files.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">
              {files.length} photo{files.length !== 1 ? "s" : ""} selected
              {doneCount > 0 && (
                <span className="text-green-600 ml-2">
                  ({doneCount} uploaded)
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-700"
              disabled={uploading}
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {files.map((entry, index) => (
              <div key={`${entry.file.name}-${index}`} className="relative group">
                <div className="relative aspect-square rounded overflow-hidden border">
                  <Image
                    src={entry.preview}
                    alt={entry.file.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                  {/* Status overlay */}
                  {entry.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                  {entry.status === "done" && (
                    <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {entry.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                {/* Remove button */}
                {entry.status === "pending" && !uploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {entry.status === "error" && (
                  <p className="text-[10px] text-red-500 mt-0.5 truncate">
                    {entry.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shared metadata */}
      {files.length > 0 && (
        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium text-gray-700">
            Shared settings for all photos
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Roll # <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="rollNumber"
                type="number"
                min="1"
                value={sharedData.rollNumber}
                onChange={(e) =>
                  setSharedData((d) => ({ ...d, rollNumber: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g. 1"
                disabled={uploading}
              />
            </div>
            <div>
              <label
                htmlFor="publishedDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Published Date{" "}
                <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="publishedDate"
                type="date"
                value={sharedData.publishedDate}
                onChange={(e) =>
                  setSharedData((d) => ({
                    ...d,
                    publishedDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={uploading}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="visibility"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Visibility
            </label>
            <select
              id="visibility"
              value={sharedData.visibility}
              onChange={(e) =>
                setSharedData((d) => ({
                  ...d,
                  visibility: e.target.value as PhotoVisibility,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
              disabled={uploading}
            >
              <option value="public">Public</option>
              <option value="friends">Friends</option>
              <option value="family">Family</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>
              Uploading {uploadProgress.done} of {uploadProgress.total}...
            </span>
            <span>
              {Math.round(
                (uploadProgress.done / uploadProgress.total) * 100,
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(uploadProgress.done / uploadProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={handleUploadAll}
        disabled={pendingCount === 0 || uploading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload {pendingCount > 0 ? `${pendingCount} Photo${pendingCount !== 1 ? "s" : ""}` : "Photos"}
          </>
        )}
      </button>

      {/* Summary after upload */}
      {!uploading && doneCount > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm font-medium">
            {doneCount} photo{doneCount !== 1 ? "s" : ""} uploaded successfully.
            You can edit titles and descriptions from the gallery.
          </p>
        </div>
      )}
    </div>
  );
}
