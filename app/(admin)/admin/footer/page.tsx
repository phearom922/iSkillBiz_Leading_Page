"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function FooterManagementPage() {
  const [footerSection, setFooterSection] = useState<any>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchFooterSection();
  }, []);

  const fetchFooterSection = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      // Fetch Footer Section
      const sectionResponse = await fetch(`${apiUrl}/api/sections`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!sectionResponse.ok) {
        throw new Error("Failed to fetch Footer Section");
      }

      const sections = await sectionResponse.json();
      let footer = sections.find((s: any) => s.section_type === 'footer' || s.name === 'Footer');

      // Create Footer section if it doesn't exist
      if (!footer && token) {
        try {
          const createResponse = await fetch(`${apiUrl}/api/sections`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: "Footer",
              type: "text",
              section_type: "footer",
              order: 999,
              is_active: true,
              is_draggable: false,
              is_editable: true,
            }),
          });

          if (createResponse.ok) {
            footer = await createResponse.json();
          }
        } catch (error) {
          console.error("Error creating Footer section:", error);
        }
      }

      if (!footer) {
        throw new Error("Footer Section not found and could not be created");
      }

      setFooterSection(footer);

      // Fetch section details with content
      const detailsResponse = await fetch(`${apiUrl}/api/sections/${footer.id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (detailsResponse.ok) {
        const details = await detailsResponse.json();
        
        // Map content to state
        const contentMap: Record<string, string> = {};
        if (details.section_content) {
          details.section_content.forEach((item: any) => {
            if (item.language === 'km') {
              const key = `${item.field_name}_${item.language}`;
              contentMap[key] = item.content || "";
            }
          });
        }
        setContent(contentMap);
      }

      // Fetch images for Footer Section (logo type)
      const imagesResponse = await fetch(`${apiUrl}/api/images?section_id=${footer.id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        // Filter for logo type images
        const logoImages = imagesData.filter((img: any) => img.type === 'logo');
        setImages(logoImages);
      }
    } catch (error: any) {
      console.error("Error fetching Footer Section:", error);
      showToast(error.message || "Failed to fetch Footer Section", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!footerSection) return;

    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update each content field
      const updates = Object.entries(content).map(async ([key, value]) => {
        const lastUnderscoreIndex = key.lastIndexOf("_");
        if (lastUnderscoreIndex === -1) {
          throw new Error(`Invalid key format: ${key}`);
        }
        const fieldName = key.substring(0, lastUnderscoreIndex);
        const language = key.substring(lastUnderscoreIndex + 1);
        
        if (!['km', 'en'].includes(language)) {
          throw new Error(`Invalid language: ${language}. Must be 'km' or 'en'`);
        }
        
        const response = await fetch(`${apiUrl}/api/sections/${footerSection.id}/content`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fieldName,
            content: value,
            language,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update ${fieldName}: ${errorText}`);
        }
      });

      await Promise.all(updates);
      showToast("Footer updated successfully!", "success");
      fetchFooterSection(); // Refresh data
    } catch (error: any) {
      console.error("Error saving Footer Section:", error);
      showToast(error.message || "Failed to save Footer Section", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageAdded = () => {
    fetchFooterSection();
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}/api/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      showToast("Image deleted successfully!", "success");
      fetchFooterSection();
    } catch (error: any) {
      console.error("Error deleting image:", error);
      showToast(error.message || "Failed to delete image", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-gray-500 dark:text-gray-400">Loading Footer Section...</p>
        </div>
      </div>
    );
  }

  if (!footerSection) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Footer Section not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Footer Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage the footer section of your landing page
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Brand Logo */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Brand Logo
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Upload your brand logo to display in the footer
        </p>
        <ImageUploader
          sectionId={footerSection.id}
          images={images}
          onUpdate={handleImageAdded}
          onImageAdded={handleImageAdded}
        />
        {images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Logo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || "Footer logo"}
                    className="w-full h-32 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2"
                  />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete logo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Description
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Footer Description (Khmer)
          </label>
          <textarea
            value={content['description_km'] || ""}
            onChange={(e) => setContent({ ...content, 'description_km': e.target.value })}
            rows={4}
            placeholder="Enter footer description"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This description appears in the footer below the logo
          </p>
        </div>
      </div>

      {/* Telegram Link */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Telegram Link
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telegram URL
          </label>
          <input
            type="text"
            value={content['telegram_link_km'] || ""}
            onChange={(e) => setContent({ ...content, 'telegram_link_km': e.target.value })}
            placeholder="e.g., https://t.me/iskillsbiz"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            The Telegram link that appears in the footer
          </p>
        </div>
      </div>

      {/* Section Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Section Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Section Name
            </label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
              {footerSection.name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Type
            </label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
              {footerSection.section_type || footerSection.type}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </label>
            <p className="text-base font-semibold mt-1">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  footerSection.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {footerSection.is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          <strong>Note:</strong> Footer Section is always displayed at the bottom of the page and cannot be reordered.
        </p>
      </div>

      {ToastComponent}
    </div>
  );
}

