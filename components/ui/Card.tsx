import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  highlighted?: boolean;
}

export default function Card({
  children,
  className = "",
  highlighted = false,
}: CardProps) {
  const baseClasses =
    "bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-premium";
  const highlightedClasses = highlighted && !className.includes("pricing-card")
    ? "ring-2 ring-primary-500 dark:ring-primary-400 shadow-xl scale-105 border-primary-200 dark:border-primary-800 hover:scale-105"
    : highlighted && className.includes("pricing-card")
    ? ""
    : "hover:shadow-lg hover:-translate-y-[2px] hover:border-gray-300/60 dark:hover:border-gray-600/60 hover:bg-gray-50/30 dark:hover:bg-gray-700/30";

  return (
    <div className={`${baseClasses} ${highlightedClasses} ${className}`}>
      {children}
    </div>
  );
}

