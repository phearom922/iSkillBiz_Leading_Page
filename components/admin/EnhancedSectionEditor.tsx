"use client";

import { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";
import { Video, Image as ImageIcon, X, Plus, Loader2 } from "lucide-react";
import VideoManager from "./VideoManager";
import ImageUploader from "./ImageUploader";

interface EnhancedSectionEditorProps {
  section: any;
  onBack: () => void;
  onSave: () => void;
}

export default function EnhancedSectionEditor({
  section,
  onBack,
  onSave,
}: EnhancedSectionEditorProps) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [videos, setVideos] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "videos" | "images">("content");
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetchSectionData();
  }, [section.id]);

  const fetchSectionData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      
      // Fetch section content
      if (section.section_content) {
        const contentMap: Record<string, string> = {};
        section.section_content.forEach((item: any) => {
          if (item.language === 'km') {
            const key = `${item.field_name}_${item.language}`;
            contentMap[key] = item.content || "";
          }
        });
        setContent(contentMap);
      }

      // Fetch videos
      const videosResponse = await fetch(`${apiUrl}/api/videos?section_id=${section.id}`);
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideos(videosData || []);
      }

      // Fetch images
      const imagesResponse = await fetch(`${apiUrl}/api/images?section_id=${section.id}`);
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        setImages(imagesData || []);
      }
    } catch (error: any) {
      console.error("Error fetching section data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
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
        
        const response = await fetch(`${apiUrl}/api/sections/${section.id}/content`, {
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
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`Failed to save ${fieldName} (${language}): ${errorData.message || response.statusText}`);
        }

        return response.json();
      });

      await Promise.all(updates);
      showToast("Content saved successfully!", "success");
      onSave();
    } catch (error: any) {
      console.error("Error saving content:", error);
      showToast(error.message || "Failed to save content", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleVideoAdded = () => {
    fetchSectionData();
  };

  const handleImageAdded = () => {
    fetchSectionData();
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}/api/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete video");
      }

      showToast("Video deleted successfully", "success");
      fetchSectionData();
    } catch (error: any) {
      showToast(error.message || "Failed to delete video", "error");
    }
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

      showToast("Image deleted successfully", "success");
      fetchSectionData();
    } catch (error: any) {
      showToast(error.message || "Failed to delete image", "error");
    }
  };

  // Ensure title and description fields exist
  const contentFields = (section.section_content || []).filter((item: any) => item.language === 'km');
  const hasTitle = contentFields.some((item: any) => item.field_name === 'title');
  const hasDescription = contentFields.some((item: any) => item.field_name === 'description');

  // Create title and description if they don't exist
  if (!hasTitle && !content['title_km']) {
    content['title_km'] = '';
  }
  if (!hasDescription && !content['description_km']) {
    content['description_km'] = '';
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2"
          >
            ← Back to Sections
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit: {section.name}
          </h1>
        </div>
        <button
          onClick={handleSaveContent}
          disabled={saving}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Section Info Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Section Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Section Name
            </label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
              {section.name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Type
            </label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
              {section.type}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Order
            </label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
              {section.order || "Not set"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Status
            </label>
            <p className="text-base font-semibold mt-1">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  section.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {section.is_active ? "Visible" : "Hidden"}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Videos
            </label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
              {videos.length}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Images
            </label>
            <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
              {images.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("content")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "content"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Title & Description
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "videos"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Video className="h-4 w-4" />
            YouTube Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "images"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Images ({images.length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <>
          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title (km)
                </label>
                <input
                  type="text"
                  value={content['title_km'] || ""}
                  onChange={(e) => setContent({ ...content, 'title_km': e.target.value })}
                  placeholder="Enter section title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (km)
                </label>
                <textarea
                  value={content['description_km'] || ""}
                  onChange={(e) => setContent({ ...content, 'description_km': e.target.value })}
                  rows={6}
                  placeholder="Enter section description"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add YouTube Video
                </h3>
                <VideoManager
                  sectionId={section.id}
                  onVideoAdded={handleVideoAdded}
                  videos={[]}
                  sections={[]}
                  onUpdate={handleVideoAdded}
                />
              </div>

              {videos.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Existing Videos
                  </h3>
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {video.video_url}
                          </p>
                          {video.title && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {video.title}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Upload Image
                </h3>
                <ImageUploader
                  sectionId={section.id}
                  onImageAdded={handleImageAdded}
                  images={[]}
                  onUpdate={handleImageAdded}
                />
              </div>

              {images.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Existing Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt={image.alt_text || "Section image"}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {ToastComponent}
    </div>
  );
}

