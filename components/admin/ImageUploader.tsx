"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "../ui/Toast";

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
  const { showToast, ToastComponent } = useToast();
  const [formData, setFormData] = useState({
    section_id: sectionId || "",
    type: defaultImageType,
    altText: "",
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
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
      onUpdate();
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
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {uploading && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Uploading...
              </p>
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

