"use client";

import { useState } from "react";
import Card from "../ui/Card";
import YouTubeEmbed from "../YouTubeEmbed";
import { useContentContext } from "../ContentProvider";

export default function FAQ() {
  const { getVideos, getSectionContent } = useContentContext();
  const videos = getVideos("FAQ");
  const title = getSectionContent("FAQ", "title", "km") || "សំណួរដែលសួរញឹកញាប់";
  const description = getSectionContent("FAQ", "description", "km") || "អ្វីៗដែលអ្នកត្រូវការដឹងអំពី iskillbiz";
  
  // Get video from admin dashboard only (no fallback)
  const videoUrl = videos.length > 0 ? videos[0].video_url : null;

  return (
    <section id="faq" className="py-10 sm:py-14 lg:py-18 bg-white dark:bg-[#111827]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {videoUrl ? (
            <div className="mb-8">
              <YouTubeEmbed videoId={videoUrl} />
            </div>
          ) : (
            <div className="mb-8 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No video available. Please add a video in the admin dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

