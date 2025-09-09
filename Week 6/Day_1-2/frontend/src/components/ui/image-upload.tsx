"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getAuthToken } from "@/lib/auth-utils";

interface UploadedImage {
  url: string;
  public_id?: string;
  alt?: string;
  order?: number;
}

interface ImageUploadProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  onImageRemoved?: (imageUrl: string) => void;
  maxImages?: number;
  existingImages?: UploadedImage[];
  disabled?: boolean;
  productId?: string;
}

export default function ImageUpload({
  onImagesUploaded,
  onImageRemoved,
  maxImages = 10,
  existingImages = [],
  disabled = false,
  productId,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const validateFiles = (files: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
        errors.push(
          `${file.name}: Only JPEG, PNG, GIF, and WebP files are allowed`
        );
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: File size must be less than 5MB`);
        return;
      }

      // Check total images limit
      if (existingImages.length + validFiles.length >= maxImages) {
        errors.push(`Maximum ${maxImages} images allowed`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join("\\n"));
    }

    return validFiles;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
    }
  };

  const uploadImages = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error(
          "You are not authenticated. Please log in and try again."
        );
      }
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      let uploadUrl = "/api/upload/multiple";
      if (productId) {
        uploadUrl = `/api/products/upload-images/${productId}`;
      }

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();
      const uploadedImages = result.images || [];

      onImagesUploaded(uploadedImages);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setUploading(false);
    }
  }, [selectedFiles, onImagesUploaded, productId]);

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    if (onImageRemoved) {
      onImageRemoved(imageUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.accept = "image/*";
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleFileSelect(target.files);
            };
            input.click();
          }
        }}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop images here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          JPEG, PNG, GIF, WebP up to 5MB each (max {maxImages} images)
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {existingImages.length}/{maxImages} images uploaded
        </p>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Selected Files:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg border overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedFile(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={uploadImages}
              disabled={uploading || selectedFiles.length === 0}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {selectedFiles.length} Image
                  {selectedFiles.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Current Images:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg border overflow-hidden">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt || `Product image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                  />
                </div>
                {onImageRemoved && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExistingImage(image.url);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={disabled}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {existingImages.length === 0 && selectedFiles.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
