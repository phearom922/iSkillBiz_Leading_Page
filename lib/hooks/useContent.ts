"use client";

import { useEffect, useState } from "react";
import { useRealtime } from "./useRealtime";

interface ContentData {
  sections: any[];
  pricing: any[];
  videos: any[];
  images: any[];
  _warning?: string;
}

export function useContent() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      console.log("🔄 Fetching content from /api/content...");
      const response = await fetch("/api/content", {
        cache: "no-store", // Prevent caching
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch content");
      }
      const data = await response.json();
      
      // Check if Supabase is not configured
      if (data._warning) {
        console.warn("⚠️", data._warning);
        console.warn("📝 Please create .env.local file with Supabase credentials. See URGENT_FIX_ENV.md");
      }
      
      if (data.sections && data.sections.length > 0) {
        console.log(`✅ Content fetched:`, {
          sections: data.sections.length,
          videos: data.videos?.length || 0,
          images: data.images?.length || 0,
          pricing: data.pricing?.length || 0,
        });
        
        // Log each section's content
        data.sections.forEach((section: any) => {
          console.log(`  📋 "${section.name}":`, {
            order: section.order,
            is_active: section.is_active,
            contentFields: section.content?.length || 0,
            videos: section.videos?.length || 0,
            images: section.images?.length || 0,
          });
        });
      } else {
        console.warn("⚠️ No sections found. Check Supabase configuration or database.");
      }
      
      setContent(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("❌ Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    
    // Poll for updates every 30 seconds as fallback if realtime doesn't work
    const pollInterval = setInterval(() => {
      console.log("🔄 Polling for content updates...");
      fetchContent();
    }, 30000);
    
    return () => clearInterval(pollInterval);
  }, []);

  // Subscribe to realtime updates
  useRealtime({
    table: "sections",
    onUpdate: (payload) => {
      console.log("📡 Realtime update on sections:", payload);
      fetchContent();
    },
    onInsert: (payload) => {
      console.log("📡 Realtime insert on sections:", payload);
      fetchContent();
    },
    onDelete: (payload) => {
      console.log("📡 Realtime delete on sections:", payload);
      fetchContent();
    },
  });

  useRealtime({
    table: "section_content",
    onUpdate: (payload) => {
      console.log("📡 Realtime update on section_content:", payload);
      fetchContent();
    },
    onInsert: (payload) => {
      console.log("📡 Realtime insert on section_content:", payload);
      fetchContent();
    },
    onDelete: (payload) => {
      console.log("📡 Realtime delete on section_content:", payload);
      fetchContent();
    },
  });

  useRealtime({
    table: "pricing_plans",
    onUpdate: (payload) => {
      console.log("📡 Realtime update on pricing_plans:", payload);
      fetchContent();
    },
  });

  useRealtime({
    table: "youtube_videos",
    onUpdate: (payload) => {
      console.log("📡 Realtime update on youtube_videos:", payload);
      fetchContent();
    },
    onInsert: (payload) => {
      console.log("📡 Realtime insert on youtube_videos:", payload);
      fetchContent();
    },
    onDelete: (payload) => {
      console.log("📡 Realtime delete on youtube_videos:", payload);
      fetchContent();
    },
  });

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}

