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
      <div className={`relative py-8 ${className}`}>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent"></div>
      </div>
    );
  }

  if (variant === "blur") {
    return (
      <div className={`relative py-8 ${className}`}>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200/30 dark:bg-gray-700/30 backdrop-blur-[2px]"></div>
      </div>
    );
  }

  // soft - subtle background transition with gradient fade
  return (
    <div className={`h-16 bg-gradient-to-b from-gray-50/20 via-gray-50/10 to-transparent dark:from-gray-800/20 dark:via-gray-800/10 dark:to-transparent ${className}`}></div>
  );
}

