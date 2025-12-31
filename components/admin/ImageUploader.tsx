"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useToast } from "../ui/Toast";
import { Upload, X, ImageIcon, Loader2, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  images?: any[];
  onUpdate?: () => void;
  sectionId?: string;
  onImageAdded?: () => void;
  defaultImageType?: string;
}

export default function ImageUploader({
  images = [],
  onUpdate,
  sectionId,
  onImageAdded,
  defaultImageType = "other",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, ToastComponent } = useToast();
  const [formData, setFormData] = useState({
    section_id: sectionId || "",
    type: defaultImageType,
    altText: "",
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);
      uploadFormData.append("type", formData.type);
      uploadFormData.append("altText", formData.altText);
      const finalSectionId = sectionId || formData.section_id;
      if (finalSectionId) {
        uploadFormData.append("sectionId", finalSectionId);
      }

      const response = await fetch(`${apiUrl}/api/images/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      setFormData({ section_id: sectionId || "", type: defaultImageType, altText: "" });
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      showToast("Image uploaded successfully!", "success");
      if (onImageAdded) onImageAdded();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${apiUrl}/api/images/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      showToast("Image deleted successfully!", "success");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting image:", error);
      showToast("Failed to delete image", "error");
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Upload New Image
        </h2>
        <div className="space-y-4">
          {!sectionId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section ID (optional)
              </label>
              <input
                type="text"
                value={formData.section_id}
                onChange={(e) =>
                  setFormData({ ...formData, section_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Section UUID"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="logo">Logo</option>
              <option value="dashboard">Dashboard</option>
              <option value="hero">Hero</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={formData.altText}
              onChange={(e) =>
                setFormData({ ...formData, altText: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image File
            </label>
            
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                dragActive
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50"
              } ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary-400 dark:hover:border-primary-500"}`}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                disabled={uploading}
                className="hidden"
              />

              {!preview ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`mb-4 p-4 rounded-full ${
                    dragActive
                      ? "bg-primary-100 dark:bg-primary-900/30"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}>
                    <Upload className={`h-8 w-8 ${
                      dragActive
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`} />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {dragActive ? "Drop image here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {selectedFile && (
                    <div className="mt-3 text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploading...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {preview && !uploading && (
              <button
                onClick={handleUpload}
                className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                Upload Image
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
              <Image
                src={image.image_url}
                alt={image.alt_text || "Image"}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {image.type}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {image.alt_text}
              </p>
              <button
                onClick={() => handleDelete(image.id)}
                className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {ToastComponent}
    </div>
  );
}

