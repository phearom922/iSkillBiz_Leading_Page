"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function HeroManagementPage() {
  const [heroSection, setHeroSection] = useState<any>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchHeroSection();
  }, []);

  const fetchHeroSection = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      // Fetch Hero Section
      const sectionResponse = await fetch(`${apiUrl}/api/sections`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!sectionResponse.ok) {
        throw new Error("Failed to fetch Hero Section");
      }

      const sections = await sectionResponse.json();
      let hero = sections.find((s: any) => s.name === "Hero Section");

      // If Hero Section doesn't exist, create it
      if (!hero && token) {
        console.log("⚠️ Hero Section not found. Creating it...");
        const createResponse = await fetch(`${apiUrl}/api/sections`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: "Hero Section",
            type: "hero",
            section_type: "hero",
            order: 1,
            is_active: true,
            is_draggable: false,
            is_editable: true,
          }),
        });

        if (createResponse.ok) {
          hero = await createResponse.json();
          console.log("✅ Hero Section created successfully");
          
          // Create default content fields
          const defaultContent = [
            { fieldName: "headline", content: "ផ្សព្វផ្សាយទៅកាន់អតិថិជនរាប់ពាន់នាក់ — ដោយមិនត្រូវការធ្វើពាណិជ្ជកម្ម ឬការងារដៃផ្ទាល់", language: "km" },
            { fieldName: "subheadline", content: "iskillbiz ជួយអាជីវកម្មនៃការផ្ញើសារទៅជាបណ្តាញដែលមានប្រសិទ្ធភាពខ្ពស់បំផុត ដោយប្រើប្រាស់ការផ្សព្វផ្សាយស្វ័យប្រវត្តិ និង ប្រើប្រាស់ AI ឲ្យធ្វើការ", language: "km" },
            { fieldName: "cta_primary", content: "Start Now", language: "km" },
            { fieldName: "cta_primary_link", content: "https://t.me/iskillsbiz", language: "km" },
            { fieldName: "cta_secondary", content: "View Pricing", language: "km" },
            { fieldName: "cta_secondary_link", content: "#pricing", language: "km" },
          ];

          // Create content fields
          for (const contentItem of defaultContent) {
            await fetch(`${apiUrl}/api/sections/${hero.id}/content`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(contentItem),
            }).catch(err => console.error("Error creating content field:", err));
          }
        } else {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create Hero Section: ${errorText}`);
        }
      }

      if (!hero) {
        throw new Error("Hero Section not found and could not be created. Please check your database.");
      }

      setHeroSection(hero);

      // Fetch section details with content
      const detailsResponse = await fetch(`${apiUrl}/api/sections/${hero.id}`, {
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

      // Fetch images for Hero Section
      const imagesResponse = await fetch(`${apiUrl}/api/images?section_id=${hero.id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        // Filter for hero type images
        const heroImages = imagesData.filter((img: any) => img.type === 'hero');
        setImages(heroImages);
      }
    } catch (error: any) {
      console.error("Error fetching Hero Section:", error);
      showToast(error.message || "Failed to fetch Hero Section", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!heroSection) return;

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
        
        const response = await fetch(`${apiUrl}/api/sections/${heroSection.id}/content`, {
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
      showToast("Hero Section updated successfully!", "success");
      fetchHeroSection(); // Refresh data
    } catch (error: any) {
      console.error("Error saving Hero Section:", error);
      showToast(error.message || "Failed to save Hero Section", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageAdded = () => {
    fetchHeroSection();
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
      fetchHeroSection();
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
          <p className="text-gray-500 dark:text-gray-400">Loading Hero Section...</p>
        </div>
      </div>
    );
  }

  if (!heroSection) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Hero Section not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hero Section Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage the main hero section of your landing page
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

      {/* Hero Image */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Hero Image
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Upload an image to display in the Hero Section
        </p>
        <ImageUploader
          sectionId={heroSection.id}
          images={images}
          onUpdate={handleImageAdded}
          onImageAdded={handleImageAdded}
          defaultImageType="hero"
        />
        {images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Hero Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || "Hero image"}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Text Content (Khmer)
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Headline (Title)
            </label>
            <input
              type="text"
              value={content['headline_km'] || ""}
              onChange={(e) => setContent({ ...content, 'headline_km': e.target.value })}
              placeholder="Enter headline"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subheadline (Description)
            </label>
            <textarea
              value={content['subheadline_km'] || ""}
              onChange={(e) => setContent({ ...content, 'subheadline_km': e.target.value })}
              rows={4}
              placeholder="Enter subheadline"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Call-to-Action Buttons
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Primary Button
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={content['cta_primary_km'] || ""}
                onChange={(e) => setContent({ ...content, 'cta_primary_km': e.target.value })}
                placeholder="e.g., Start Now"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Link
              </label>
              <input
                type="text"
                value={content['cta_primary_link_km'] || ""}
                onChange={(e) => setContent({ ...content, 'cta_primary_link_km': e.target.value })}
                placeholder="e.g., https://t.me/iskillsbiz"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Secondary Button
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={content['cta_secondary_km'] || ""}
                onChange={(e) => setContent({ ...content, 'cta_secondary_km': e.target.value })}
                placeholder="e.g., View Pricing"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Link
              </label>
              <input
                type="text"
                value={content['cta_secondary_link_km'] || ""}
                onChange={(e) => setContent({ ...content, 'cta_secondary_link_km': e.target.value })}
                placeholder="e.g., #pricing"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
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
              {heroSection.name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Type
            </label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
              {heroSection.type}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </label>
            <p className="text-base font-semibold mt-1">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  heroSection.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {heroSection.is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          <strong>Note:</strong> Hero Section is always displayed at the top of the page and cannot be reordered.
        </p>
      </div>

      {ToastComponent}
    </div>
  );
}

