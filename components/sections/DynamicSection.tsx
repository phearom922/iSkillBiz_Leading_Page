"use client";

import YouTubeEmbed from "../YouTubeEmbed";
import { useContentContext } from "../ContentProvider";
import Image from "next/image";
import { useState } from "react";

interface DynamicSectionProps {
  sectionName: string;
  className?: string;
}

export default function DynamicSection({ sectionName, className = "" }: DynamicSectionProps) {
  const { getSectionContent, getVideos, getImages, getSection } = useContentContext();
  
  const section = getSection(sectionName);
  if (!section) {
    console.log(`⚠️ DynamicSection: Section "${sectionName}" not found`);
    return null;
  }
  
  if (!section.is_active) {
    console.log(`⚠️ DynamicSection: Section "${sectionName}" is inactive`);
    return null;
  }

  const title = getSectionContent(sectionName, "title", "km");
  const description = getSectionContent(sectionName, "description", "km");
  const videos = getVideos(sectionName);
  const images = getImages(sectionName);

  // Check if section has any content
  const hasTitle = !!title;
  const hasDescription = !!description;
  const hasVideos = videos.length > 0;
  const hasImages = images.length > 0;

  console.log(`📋 DynamicSection "${sectionName}":`, {
    hasTitle,
    hasDescription,
    hasVideos,
    hasImages,
    videosCount: videos.length,
    imagesCount: images.length,
  });

  // If section has no content at all, don't render
  if (!hasTitle && !hasDescription && !hasVideos && !hasImages) {
    console.log(`⚠️ DynamicSection "${sectionName}": No content found, skipping render`);
    return null;
  }

  return (
    <section className={`py-20 sm:py-28 lg:py-32 bg-white dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ส่วนที่ 1: Title + Description */}
        {(hasTitle || hasDescription) && (
          <div className="text-center mb-12">
            {hasTitle && (
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {title}
              </h2>
            )}
            {hasDescription && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* ส่วนที่ 2: YouTube Videos (Grid) */}
        {hasVideos && (
          <div className="mb-12">
            {videos.length === 1 ? (
              // ถ้ามี 1 คลิป แสดงเต็มขนาด
              <div className="flex justify-center">
                <div className="w-full md:w-3/4 lg:w-2/3">
                  <YouTubeEmbed videoId={videos[0].video_url} />
                </div>
              </div>
            ) : videos.length === 2 ? (
              // ถ้ามี 2 คลิป แสดง 2 columns
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {videos.map((video: any) => (
                  <div key={video.id} className="w-full">
                    <YouTubeEmbed videoId={video.video_url} />
                  </div>
                ))}
              </div>
            ) : (
              // ถ้ามี 3 คลิปขึ้นไป แสดง 3 columns
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {videos.map((video: any) => (
                  <div key={video.id} className="w-full">
                    <YouTubeEmbed videoId={video.video_url} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ส่วนที่ 3: Images */}
        {hasImages && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {images.map((image: any) => (
              <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {image.image_url && (
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || sectionName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

