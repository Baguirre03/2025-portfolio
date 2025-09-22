"use client";

import { useState, useRef, useCallback } from "react";
import { uploadPhotoToPublicBucket } from "@/lib/supabase";

// Types
interface Photo {
  id: string;
  filename: string;
  public_url: string;
  title: string;
  description: string;
  file_size: number;
  mime_type: string;
  bucket: string;
  uploaded_at: string;
}

interface UploadResult {
  success: boolean;
  photo?: Photo;
  publicUrl?: string;
  error?: string;
}

interface FormData {
  title: string;
  description: string;
}

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Custom hook for file validation
const useFileValidation = () => {
  const validateFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return {
          isValid: false,
          error: `Please select a valid image file. Supported formats: ${ALLOWED_FILE_TYPES.map(
            (type) => type.split("/")[1].toUpperCase()
          ).join(", ")}`,
        };
      }

      if (file.size > MAX_FILE_SIZE) {
        return {
          isValid: false,
          error: `File size must be less than ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        };
      }

      return { isValid: true };
    },
    []
  );

  return { validateFile };
};

// Custom hook for file preview
const useFilePreview = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const generatePreview = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  return { preview, generatePreview, clearPreview };
};

export default function PhotoUpload() {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom hooks
  const { validateFile } = useFileValidation();
  const { preview, generatePreview, clearPreview } = useFilePreview();

  // Handlers
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      // Clear previous errors
      setValidationError(null);
      setUploadResult(null);

      if (!file) {
        setSelectedFile(null);
        clearPreview();
        return;
      }

      const validation = validateFile(file);
      if (!validation.isValid) {
        setValidationError(validation.error || "Invalid file");
        setSelectedFile(null);
        clearPreview();
        return;
      }

      setSelectedFile(file);
      generatePreview(file);
    },
    [validateFile, clearPreview, generatePreview]
  );

  const handleFormDataChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setFormData({ title: "", description: "" });
    clearPreview();
    setValidationError(null);
    setUploadResult(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [clearPreview]);

  const handleUpload = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedFile) {
        setValidationError("Please select a file first");
        return;
      }

      setUploading(true);
      setUploadResult(null);
      setValidationError(null);

      try {
        const result = await uploadPhotoToPublicBucket(
          selectedFile,
          formData.title.trim() || selectedFile.name,
          formData.description.trim()
        );

        if (result.success) {
          setUploadResult(result);
          resetForm();
        } else {
          setUploadResult({
            success: false,
            error: result.error || "Upload failed",
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setUploadResult({
          success: false,
          error: errorMessage,
        });
      } finally {
        setUploading(false);
      }
    },
    [selectedFile, formData, resetForm]
  );

  // Computed values
  const isFormValid = selectedFile && !validationError && !uploading;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Upload Photo</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* File Input */}
        <div>
          <label
            htmlFor="photo-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Photo
          </label>
          <input
            ref={fileInputRef}
            id="photo-input"
            type="file"
            accept={ALLOWED_FILE_TYPES.join(",")}
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
            disabled={uploading}
          />
          {selectedFile && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{validationError}</p>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleFormDataChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={selectedFile ? selectedFile.name : "Enter photo title"}
            maxLength={100}
            disabled={uploading}
          />
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              handleFormDataChange("description", e.target.value)
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            placeholder="Enter photo description"
            maxLength={500}
            disabled={uploading}
          />
          <p className="mt-1 text-xs text-gray-400">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Photo"
          )}
        </button>
      </form>

      {/* Upload Result */}
      {uploadResult && (
        <div
          className={`mt-4 p-4 rounded-md ${
            uploadResult.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
          role="alert"
        >
          {uploadResult.success ? (
            <div>
              <div className="flex">
                <svg
                  className="h-5 w-5 text-green-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-800 font-semibold">
                  Upload successful!
                </p>
              </div>
              {uploadResult.publicUrl && (
                <p className="text-green-600 text-sm mt-2 break-all">
                  <strong>URL:</strong> {uploadResult.publicUrl}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-800 font-semibold">Upload failed</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{uploadResult.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
