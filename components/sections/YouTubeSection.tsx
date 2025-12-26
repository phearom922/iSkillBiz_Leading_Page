"use client";

import YouTubeEmbed from "../YouTubeEmbed";
import { useContentContext } from "../ContentProvider";
import Image from "next/image";

interface YouTubeSectionProps {
  sectionName: string;
  className?: string;
}

export default function YouTubeSection({ sectionName, className = "" }: YouTubeSectionProps) {
  const { getSectionContent, getVideos, getImages, getSection } = useContentContext();
  
  const section = getSection(sectionName);
  if (!section || !section.is_active) {
    return null;
  }

  const title = getSectionContent(sectionName, "title", "km");
  const description = getSectionContent(sectionName, "description", "km");
  const videos = getVideos(sectionName);
  const images = getImages(sectionName);

  // Debug logging
  console.log(`🎬 YouTubeSection "${sectionName}":`, {
    videosCount: videos.length,
    videos: videos.map((v: any) => ({
      id: v.id,
      video_id: v.video_id,
      video_url: v.video_url,
      title: v.title,
    })),
  });

  // YouTube section must have at least one video
  if (videos.length === 0) {
    console.warn(`⚠️ YouTubeSection "${sectionName}": No videos found`);
    return null;
  }

  // Get the first video (primary video for YouTube sections)
  const primaryVideo = videos[0];
  
  // Extract video ID from video_url or use video_id
  const videoId = primaryVideo.video_id || primaryVideo.video_url;

  // Determine grid layout based on number of videos
  const getGridCols = () => {
    if (videos.length === 1) return "grid-cols-1"; // Single video: full width
    if (videos.length === 2) return "grid-cols-1 md:grid-cols-2"; // 2 videos: 2 columns
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"; // 3+ videos: 3 columns
  };

  return (
    <section className={`py-10 sm:py-14 lg:py-18 bg-white dark:bg-[#111827] ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Title and Description (optional) */}
          {(title || description) && (
            <div className="text-center mb-12">
              {title && (
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* YouTube Videos Grid */}
          <div className={`grid ${getGridCols()} gap-6`}>
            {videos
              .filter((video: any) => {
                // Filter out videos without valid video ID
                const videoId = video.video_id || video.video_url;
                const isValid = videoId && videoId.trim() !== "";
                
                if (!isValid) {
                  console.warn(`⚠️ YouTubeSection "${sectionName}": Video ${video.id} has no valid video_id or video_url:`, {
                    video_id: video.video_id,
                    video_url: video.video_url,
                  });
                }
                
                return isValid;
              })
              .map((video: any) => {
                // Extract video ID - prioritize video_id, fallback to video_url
                const videoId = (video.video_id || video.video_url)?.trim();
                
                if (!videoId) {
                  return null;
                }

                console.log(`✅ Rendering video:`, {
                  id: video.id,
                  videoId: videoId,
                  title: video.title,
                });

                return (
                  <div key={video.id} className={videos.length === 1 ? "max-w-4xl mx-auto w-full" : "w-full"}>
                    <YouTubeEmbed 
                      videoId={videoId} 
                      title={video.title || ""}
                    />
                  </div>
                );
              })}
          </div>

          {/* Images (if any) */}
          {images.length > 0 && (
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image: any) => (
                  <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

