interface SectionDividerProps {
  variant?: "gradient" | "blur" | "soft";
  className?: string;
}

export default function SectionDivider({
  variant = "gradient",
  className = "",
}: SectionDividerProps) {
  if (variant === "gradient") {
    return (
      <div className={`relative py-4 sm:py-6 lg:py-8 ${className}`}>
        <div className="absolute inset-x-0 top-1/2 h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent"></div>
        </div>
        {/* Decorative center element */}
        <div className="absolute inset-x-0 top-1/2 flex items-center justify-center -translate-y-1/2">
          <div className="h-2 w-2 rounded-full bg-gray-300/60 dark:bg-gray-600/60 ring-4 ring-white dark:ring-gray-900"></div>
        </div>
      </div>
    );
  }

  if (variant === "blur") {
    return (
      <div className={`relative py-4 sm:py-6 lg:py-8 ${className}`}>
        {/* Main blur line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-200/30 dark:via-gray-700/30 to-transparent backdrop-blur-[2px]"></div>
        {/* Subtle shadow layer for depth */}
        <div className="absolute inset-x-0 top-1/2 -mt-px h-px bg-gradient-to-r from-transparent via-gray-100/10 dark:via-gray-800/10 to-transparent"></div>
      </div>
    );
  }

  // soft - subtle background transition with gradient fade
  return (
    <div className={`h-8 bg-gradient-to-b from-gray-50/40 via-gray-50/20 to-transparent dark:from-gray-800/40 dark:via-gray-800/20 dark:to-transparent ${className}`}></div>
  );
}

