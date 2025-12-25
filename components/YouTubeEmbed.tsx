"use client";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

function extractVideoId(urlOrId: string): string {
  // If it's already a video ID (no URL format), return as is
  if (!urlOrId.includes("youtube.com") && !urlOrId.includes("youtu.be")) {
    return urlOrId;
  }

  // Extract from standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = urlOrId.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return watchMatch[1];
  }

  // Extract from short YouTube URL: https://youtu.be/VIDEO_ID
  const shortMatch = urlOrId.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return shortMatch[1];
  }

  // Fallback: return as is (might already be an ID)
  return urlOrId;
}

export default function YouTubeEmbed({
  videoId,
  title = "YouTube video player",
  className = "",
}: YouTubeEmbedProps) {
  // Validate videoId
  if (!videoId || typeof videoId !== "string" || videoId.trim() === "") {
    console.error("❌ YouTubeEmbed: Invalid videoId provided:", videoId);
    return (
      <div className={`w-full ${className}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Invalid video ID
          </p>
        </div>
      </div>
    );
  }

  const extractedId = extractVideoId(videoId.trim());
  
  if (!extractedId || extractedId.trim() === "") {
    console.error("❌ YouTubeEmbed: Could not extract video ID from:", videoId);
    return (
      <div className={`w-full ${className}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Could not extract video ID
          </p>
        </div>
      </div>
    );
  }

  console.log(`🎥 YouTubeEmbed rendering:`, {
    originalVideoId: videoId,
    extractedId: extractedId,
    title: title,
  });

  return (
    <div className={`w-full ${className}`}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${extractedId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

