"use client";

import YouTubeEmbed from "../YouTubeEmbed";
import { useContentContext } from "../ContentProvider";

export default function PainPoints() {
  const { getVideos, getSectionContent } = useContentContext();
  const videos = getVideos("Pain Points");
  const title = getSectionContent("Pain Points", "title", "km") || "តើអ្នកមានបញ្ហាការទំនាក់ទំនងជាមួយអតិថិជនមែនទេ?";
  const description = getSectionContent("Pain Points", "description", "km") || "បញ្ហាទូទៅទាំងនេះការពារអាជីវកម្មពីការទាក់ទងអតិថិជនឱ្យមានប្រសិទ្ធភាព។";
  
  // Get videos from admin dashboard only (no fallback)
  const videoUrls = videos.length > 0 
    ? videos.map((v: any) => v.video_url)
    : [];

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-5 leading-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        {videoUrls.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoUrls.map((videoUrl: string, index: number) => (
                <YouTubeEmbed key={index} videoId={videoUrl} />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No videos available. Please add videos in the admin dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

