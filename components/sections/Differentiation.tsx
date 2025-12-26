"use client";

import YouTubeEmbed from "../YouTubeEmbed";
import { useContentContext } from "../ContentProvider";

export default function Differentiation() {
  const { getVideos, getSectionContent } = useContentContext();
  const videos = getVideos("Differentiation");
  const title = getSectionContent("Differentiation", "title", "km") || "លទ្ធផលដែលទទួលបានពីការប្រើប្រាស់ iSkillBiz";
  const description = getSectionContent("Differentiation", "description", "km") || "ខណៈពេលដែលអ្នកផ្សេងទៀតផ្តោតលើការសន្ទនារវាងអតិថិជននិងអ្នកលក់ iSkillbiz ត្រូវបានបង្កើតឡើងសម្រាប់អាជីវកម្មដែលអាចផ្ញើរសារទៅដល់មនុស្សរាប់ពាន់នាក់ក្នុងពេលតែមួយ។";
  
  // Get video from admin dashboard only (no fallback)
  const videoUrl = videos.length > 0 ? videos[0].video_url : null;

  return (
    <section className="py-10 sm:py-14 lg:py-18 bg-gray-50 dark:bg-[#111827]">
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

