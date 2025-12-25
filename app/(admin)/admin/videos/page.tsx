"use client";

import { useEffect, useState } from "react";
import VideoManager from "@/components/admin/VideoManager";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
    fetchSections();
  }, []);

  const fetchVideos = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/videos`);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/sections`);
      const data = await response.json();
      setSections(data || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        YouTube Videos
      </h1>
      <VideoManager videos={videos} sections={sections} onUpdate={fetchVideos} />
    </div>
  );
}

