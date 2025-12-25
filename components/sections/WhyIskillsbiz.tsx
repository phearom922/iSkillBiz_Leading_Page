"use client";

import YouTubeEmbed from "../YouTubeEmbed";
import { useContentContext } from "../ContentProvider";

export default function WhyIskillbiz() {
  const { getVideos, getSectionContent } = useContentContext();
  const videos = getVideos("Why iskillbiz");
  const title = getSectionContent("Why iskillbiz", "title", "km") || "ហេតុអ្វីបានជាត្រូវជ្រើសរើស iskillbiz?";
  const description = getSectionContent("Why iskillbiz", "description", "km") || "យើងមិនមែនគ្រាន់តែជាឧបករណ៍ Chatbot ធម្មតាៗនោះទេ តែយើងគឺជាវេទិកាផ្សព្វផ្សាយពេញលេញដែលបានរចនាដើម្បីទទួលបានលទ្ធផលអាជីវកម្មពិតៗ";
  
  // Get video from admin dashboard only (no fallback)
  const videoUrl = videos.length > 0 ? videos[0].video_url : null;

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        {videoUrl ? (
          <div className="max-w-4xl mx-auto">
            <YouTubeEmbed videoId={videoUrl} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No video available. Please add a video in the admin dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

